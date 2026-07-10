import type { Address, PublicClient } from "viem";

import {
  fetchInboundUsdcTransfers,
  type AlchemyTransfer,
  type AlchemyTransfersConfig,
} from "./alchemy-transfers";
import { isFundingDenylisted } from "./known-addresses";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export type FundingResolutionConfig = AlchemyTransfersConfig & {
  lookbackDays: number;
  backfillStartBlock: bigint;
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

      const sourceAddress = pickFundingSource(
        hlAddress,
        deposit.blockNumber,
        inbound,
      );

      return {
        ...deposit,
        sourceAddress,
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

export function pickFundingSource(
  hlAddress: string,
  depositBlock: number,
  inbound: AlchemyTransfer[],
): string {
  const candidates = inbound.filter((transfer) => {
    if (transfer.from === hlAddress) {
      return false;
    }
    if (isFundingDenylisted(transfer.from)) {
      return false;
    }
    if (transfer.blockNum > depositBlock) {
      return false;
    }
    if (transfer.blockNum < depositBlock) {
      return true;
    }
    return transfer.hash !== undefined;
  });

  if (candidates.length === 0) {
    return hlAddress;
  }

  candidates.sort((a, b) => {
    if (b.blockNum !== a.blockNum) {
      return b.blockNum - a.blockNum;
    }
    return b.hash.localeCompare(a.hash);
  });

  return candidates[0]?.from ?? hlAddress;
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
