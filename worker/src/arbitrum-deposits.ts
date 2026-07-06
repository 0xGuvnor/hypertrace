import {
  createPublicClient,
  decodeEventLog,
  http,
  parseAbiItem,
  type Address,
  type PublicClient,
} from "viem";
import { arbitrum } from "viem/chains";

import type { FundingResolver } from "./funding-resolution";

const TRANSFER_EVENT = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

const USDC_DECIMALS = 6;

export type ParsedDeposit = {
  hlAddress: string;
  sourceAddress: string;
  amount: number;
  timestamp: number;
  arbTxHash: string;
  logIndex: number;
  depositKey: string;
  blockNumber: number;
};

export type ArbitrumDepositScannerConfig = {
  rpcUrl: string;
  bridge2Address: Address;
  usdcAddress: Address;
  bridge2StartBlock: bigint;
  logChunkBlocks: bigint;
  fundingResolver?: FundingResolver;
  client?: PublicClient;
};

export type ArbitrumDepositScanner = {
  getChainHead(): Promise<bigint>;
  getClient(): PublicClient;
  scanDepositsWithCursor(
    hlAddress: Address,
    cursorBlock: number | null,
  ): Promise<{ deposits: ParsedDeposit[]; lastScannedBlock: number }>;
};

export function createArbitrumDepositScanner(
  config: ArbitrumDepositScannerConfig,
): ArbitrumDepositScanner {
  const client =
    config.client ??
    createPublicClient({
      chain: arbitrum,
      transport: http(config.rpcUrl),
    });

  return {
    getClient() {
      return client;
    },

    async getChainHead() {
      return await client.getBlockNumber();
    },

    async scanDepositsWithCursor(hlAddress, cursorBlock) {
      const chainHead = await client.getBlockNumber();
      let fromBlock =
        cursorBlock === null
          ? config.bridge2StartBlock
          : BigInt(cursorBlock + 1);

      if (fromBlock > chainHead) {
        return {
          deposits: [],
          lastScannedBlock: cursorBlock ?? Number(config.bridge2StartBlock) - 1,
        };
      }

      const deposits: ParsedDeposit[] = [];
      let lastScannedBlock =
        cursorBlock ?? Number(config.bridge2StartBlock) - 1;

      while (fromBlock <= chainHead) {
        const toBlock =
          fromBlock + config.logChunkBlocks - 1n > chainHead
            ? chainHead
            : fromBlock + config.logChunkBlocks - 1n;

        const chunkDeposits = await scanDepositsForRange(
          client,
          config,
          hlAddress,
          fromBlock,
          toBlock,
        );
        deposits.push(...chunkDeposits);
        lastScannedBlock = Number(toBlock);
        fromBlock = toBlock + 1n;
      }

      if (config.fundingResolver && deposits.length > 0) {
        const resolved = await config.fundingResolver.resolveDeposits(deposits);
        return { deposits: resolved, lastScannedBlock };
      }

      return { deposits, lastScannedBlock };
    },
  };
}

async function scanDepositsForRange(
  client: PublicClient,
  config: ArbitrumDepositScannerConfig,
  hlAddress: Address,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<ParsedDeposit[]> {
  const logs = await client.getLogs({
    address: config.usdcAddress,
    event: TRANSFER_EVENT,
    args: {
      from: hlAddress,
      to: config.bridge2Address,
    },
    fromBlock,
    toBlock,
  });

  if (logs.length === 0) {
    return [];
  }

  const blockTimestamps = await loadBlockTimestamps(
    client,
    logs.map((log) => log.blockNumber),
  );

  const deposits: ParsedDeposit[] = [];
  for (const log of logs) {
    const deposit = parseTransferLog(log, blockTimestamps);
    if (deposit) {
      deposits.push(deposit);
    }
  }

  return deposits;
}

function parseTransferLog(
  log: {
    blockNumber: bigint;
    data: `0x${string}`;
    topics: [] | [`0x${string}`, ...`0x${string}`[]];
    transactionHash: `0x${string}`;
    logIndex: number | null;
  },
  blockTimestamps: Map<bigint, number>,
): ParsedDeposit | null {
  const decoded = decodeEventLog({
    abi: [TRANSFER_EVENT],
    data: log.data,
    topics: log.topics,
  });

  const timestamp = blockTimestamps.get(log.blockNumber);
  if (timestamp === undefined) {
    return null;
  }

  const hlAddress = decoded.args.from.toLowerCase();
  const amount = Number(decoded.args.value) / 10 ** USDC_DECIMALS;
  const logIndex = log.logIndex ?? 0;
  const arbTxHash = log.transactionHash.toLowerCase();

  return {
    hlAddress,
    sourceAddress: hlAddress,
    amount,
    timestamp,
    arbTxHash,
    logIndex,
    depositKey: `${arbTxHash}:${logIndex}`,
    blockNumber: Number(log.blockNumber),
  };
}

async function loadBlockTimestamps(
  client: PublicClient,
  blockNumbers: readonly bigint[],
): Promise<Map<bigint, number>> {
  const unique = [...new Set(blockNumbers)];
  const entries = await Promise.all(
    unique.map(async (blockNumber) => {
      const block = await client.getBlock({ blockNumber });
      return [blockNumber, Number(block.timestamp) * 1000] as const;
    }),
  );
  return new Map(entries);
}
