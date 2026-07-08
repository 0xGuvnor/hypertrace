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

export const CCTP_MESSENGER_DEPOSIT_TOPIC =
  "0x0c8c1cbdc5190613ebd485511d4e2812cfa45eecb79d845893331fedad5130a5" as const;

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
  cctpExtensionAddress: Address;
  cctpTokenMessengerV2: Address;
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

type DepositLog = {
  blockNumber: bigint;
  data: `0x${string}`;
  topics: [] | [`0x${string}`, ...`0x${string}`[]];
  transactionHash: `0x${string}`;
  logIndex: number | null;
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

      const deduped = dedupeDepositsByKey(deposits);

      if (config.fundingResolver && deduped.length > 0) {
        const resolved = await config.fundingResolver.resolveDeposits(deduped);
        return { deposits: resolved, lastScannedBlock };
      }

      return { deposits: deduped, lastScannedBlock };
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
  const [bridge2Logs, extensionLogs, messengerLogs] = await Promise.all([
    client.getLogs({
      address: config.usdcAddress,
      event: TRANSFER_EVENT,
      args: {
        from: hlAddress,
        to: config.bridge2Address,
      },
      fromBlock,
      toBlock,
    }),
    client.getLogs({
      address: config.usdcAddress,
      event: TRANSFER_EVENT,
      args: {
        from: hlAddress,
        to: config.cctpExtensionAddress,
      },
      fromBlock,
      toBlock,
    }),
    getCctpMessengerDepositLogs(client, config, hlAddress, fromBlock, toBlock),
  ]);

  const allLogs: DepositLog[] = [
    ...bridge2Logs,
    ...extensionLogs,
    ...messengerLogs,
  ];

  if (allLogs.length === 0) {
    return [];
  }

  const blockTimestamps = await loadBlockTimestamps(
    client,
    allLogs.map((log) => log.blockNumber),
  );

  const deposits: ParsedDeposit[] = [];
  for (const log of bridge2Logs) {
    const deposit = parseTransferLog(log, blockTimestamps);
    if (deposit) {
      deposits.push(deposit);
    }
  }

  for (const log of extensionLogs) {
    const deposit = parseTransferLog(log, blockTimestamps);
    if (deposit) {
      deposits.push(deposit);
    }
  }

  for (const log of messengerLogs) {
    const deposit = parseCctpMessengerDepositLog(
      log,
      blockTimestamps,
      hlAddress,
    );
    if (deposit) {
      deposits.push(deposit);
    }
  }

  return deposits;
}

type RawEthLog = {
  blockNumber: `0x${string}`;
  data: `0x${string}`;
  topics: `0x${string}`[];
  transactionHash: `0x${string}`;
  logIndex: `0x${string}`;
};

async function getCctpMessengerDepositLogs(
  client: PublicClient,
  config: ArbitrumDepositScannerConfig,
  hlAddress: Address,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<DepositLog[]> {
  const filter = {
    address: config.cctpTokenMessengerV2,
    topics: [
      CCTP_MESSENGER_DEPOSIT_TOPIC,
      null,
      addressTopicToAddress(hlAddress),
    ],
    fromBlock: `0x${fromBlock.toString(16)}`,
    toBlock: `0x${toBlock.toString(16)}`,
  };

  const logs = (await client.request({
    method: "eth_getLogs",
    params: [filter] as never,
  })) as RawEthLog[];

  return logs.map((log) => ({
    blockNumber: BigInt(log.blockNumber),
    data: log.data,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
    transactionHash: log.transactionHash,
    logIndex: Number.parseInt(log.logIndex, 16),
  }));
}

export function dedupeDepositsByKey(
  deposits: ParsedDeposit[],
): ParsedDeposit[] {
  const seen = new Set<string>();
  const result: ParsedDeposit[] = [];

  for (const deposit of deposits) {
    if (seen.has(deposit.depositKey)) {
      continue;
    }
    seen.add(deposit.depositKey);
    result.push(deposit);
  }

  return result;
}

export function parseTransferLog(
  log: DepositLog,
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

export function parseCctpMessengerDepositLog(
  log: DepositLog,
  blockTimestamps: Map<bigint, number>,
  hlAddress: Address,
): ParsedDeposit | null {
  const topics = log.topics;
  if (topics.length < 3) {
    return null;
  }

  if (topics[0]?.toLowerCase() !== CCTP_MESSENGER_DEPOSIT_TOPIC) {
    return null;
  }

  const depositorTopic = topics[2]?.toLowerCase();
  const expectedDepositor = addressTopicToAddress(hlAddress);
  if (depositorTopic !== expectedDepositor) {
    return null;
  }

  const amountRaw = parseFirstUint256(log.data);
  if (amountRaw === null) {
    return null;
  }

  const timestamp = blockTimestamps.get(log.blockNumber);
  if (timestamp === undefined) {
    return null;
  }

  const amount = Number(amountRaw) / 10 ** USDC_DECIMALS;
  const logIndex = log.logIndex ?? 0;
  const arbTxHash = log.transactionHash.toLowerCase();

  return {
    hlAddress: hlAddress.toLowerCase(),
    sourceAddress: hlAddress.toLowerCase(),
    amount,
    timestamp,
    arbTxHash,
    logIndex,
    depositKey: `${arbTxHash}:${logIndex}`,
    blockNumber: Number(log.blockNumber),
  };
}

export function addressTopicToAddress(address: Address): string {
  return `0x${address.slice(2).toLowerCase().padStart(64, "0")}`;
}

export function parseFirstUint256(data: `0x${string}`): bigint | null {
  const hex = data.slice(2);
  if (hex.length < 64) {
    return null;
  }
  return BigInt(`0x${hex.slice(0, 64)}`);
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
