import type { Address, PublicClient } from "viem";

import {
  fetchInboundUsdcTransfers,
  type AlchemyTransfer,
  type AlchemyTransfersConfig,
} from "./alchemy-transfers";
import { isFundingDenylisted, MAX_FUNDERS } from "./known-addresses";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type FundingResolutionConfig = AlchemyTransfersConfig & {
  lookbackDays: number;
  backfillStartBlock: bigint;
};

export type DepositFunder = {
  address: string;
  amount: number;
  weight: number;
};

export type DepositForFunding = {
  hlAddress: string;
  sourceAddress: string;
  amount: number;
  timestamp: number;
  blockNumber: number;
  arbTxHash: string;
  logIndex: number;
  depositKey: string;
  direction: "deposit" | "withdrawal";
  funders?: DepositFunder[];
};

type TransferCacheKey = string;

export type FundingResolver = {
  resolveDeposit(deposit: DepositForFunding): Promise<DepositForFunding>;
  resolveDeposits(deposits: DepositForFunding[]): Promise<DepositForFunding[]>;
};

export function createFundingResolver(
  client: PublicClient,
  config: FundingResolutionConfig,
): FundingResolver {
  const transferCache = new Map<TransferCacheKey, Promise<AlchemyTransfer[]>>();

  async function getBlockForTimestamp(targetMs: number): Promise<bigint> {
    const head = await client.getBlockNumber();
    const targetSec = Math.floor(targetMs / 1000);

    let lo = config.backfillStartBlock;
    let hi = head;
    while (lo < hi) {
      const mid = (lo + hi) / 2n;
      const block = await client.getBlock({ blockNumber: mid });
      if (Number(block.timestamp) < targetSec) {
        lo = mid + 1n;
      } else {
        hi = mid;
      }
    }
    return lo;
  }

  async function loadInboundTransfers(
    hlAddress: Address,
    fromBlock: bigint,
    toBlock: bigint,
  ): Promise<AlchemyTransfer[]> {
    const key = `${hlAddress}:${fromBlock}:${toBlock}`;
    const existing = transferCache.get(key);
    if (existing) {
      return await existing;
    }

    const promise = fetchInboundUsdcTransfers(config, {
      toAddress: hlAddress,
      fromBlock,
      toBlock,
    });
    transferCache.set(key, promise);
    return await promise;
  }

  async function resolveDeposit(
    deposit: DepositForFunding,
  ): Promise<DepositForFunding> {
    const hlAddress = deposit.hlAddress.toLowerCase() as Address;
    const depositBlock = BigInt(deposit.blockNumber);
    const lookbackStartMs = deposit.timestamp - config.lookbackDays * MS_PER_DAY;
    const fromBlock = await getBlockForTimestamp(lookbackStartMs);
    const boundedFrom =
      fromBlock < config.backfillStartBlock
        ? config.backfillStartBlock
        : fromBlock;

    try {
      const inbound = await loadInboundTransfers(
        hlAddress,
        boundedFrom,
        depositBlock,
      );

      const attribution = buildFundingAttribution(
        hlAddress,
        deposit.blockNumber,
        inbound,
      );

      return {
        ...deposit,
        sourceAddress: attribution.sourceAddress,
        funders: attribution.funders,
      };
    } catch (error) {
      console.warn(
        `[funding] lookup failed for ${deposit.depositKey}, using self source`,
        error,
      );
      return deposit;
    }
  }

  return {
    resolveDeposit,
    async resolveDeposits(deposits) {
      const resolved: DepositForFunding[] = [];
      for (const deposit of deposits) {
        resolved.push(await resolveDeposit(deposit));
      }
      return resolved;
    },
  };
}

export function buildFundingAttribution(
  hlAddress: string,
  depositBlock: number,
  inbound: AlchemyTransfer[],
): { sourceAddress: string; funders: DepositFunder[] } {
  const wallet = hlAddress.toLowerCase();
  const amountsByFrom = new Map<string, number>();

  for (const transfer of inbound) {
    const from = transfer.from.toLowerCase();
    if (from === wallet) {
      continue;
    }
    if (isFundingDenylisted(from)) {
      continue;
    }
    if (transfer.blockNum > depositBlock) {
      continue;
    }
    const value = Number.isFinite(transfer.value) ? transfer.value : 0;
    if (value <= 0) {
      continue;
    }
    amountsByFrom.set(from, (amountsByFrom.get(from) ?? 0) + value);
  }

  const ranked = [...amountsByFrom.entries()]
    .map(([address, amount]) => ({ address, amount }))
    .sort((a, b) => {
      if (b.amount !== a.amount) {
        return b.amount - a.amount;
      }
      return a.address.localeCompare(b.address);
    })
    .slice(0, MAX_FUNDERS);

  const total = ranked.reduce((sum, row) => sum + row.amount, 0);
  if (total <= 0 || ranked.length === 0) {
    return { sourceAddress: wallet, funders: [] };
  }

  const funders: DepositFunder[] = ranked.map((row) => ({
    address: row.address,
    amount: row.amount,
    weight: row.amount / total,
  }));

  return {
    sourceAddress: funders[0]?.address ?? wallet,
    funders,
  };
}

/** @deprecated Prefer buildFundingAttribution; kept for call-site clarity in tests. */
export function pickFundingSource(
  hlAddress: string,
  depositBlock: number,
  inbound: AlchemyTransfer[],
): string {
  return buildFundingAttribution(hlAddress, depositBlock, inbound).sourceAddress;
}

export async function resolveDepositBlockNumber(
  client: PublicClient,
  deposit: {
    blockNumber?: number;
    arbTxHash: `0x${string}`;
  },
): Promise<number> {
  if (deposit.blockNumber && deposit.blockNumber > 0) {
    return deposit.blockNumber;
  }

  const receipt = await client.getTransactionReceipt({
    hash: deposit.arbTxHash,
  });
  return Number(receipt.blockNumber);
}
