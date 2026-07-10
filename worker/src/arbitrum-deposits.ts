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

const FINALIZED_WITHDRAWAL_EVENT = parseAbiItem(
  "event FinalizedWithdrawal(address indexed user, address destination, uint64 usd, uint64 nonce, bytes32 message)",
);

export const CCTP_MESSENGER_DEPOSIT_TOPIC =
  "0x0c8c1cbdc5190613ebd485511d4e2812cfa45eecb79d845893331fedad5130a5" as const;

const USDC_DECIMALS = 6;

export type TransferDirection = "deposit" | "withdrawal";

export type ParsedDeposit = {
  hlAddress: string;
  sourceAddress: string;
  amount: number;
  timestamp: number;
  arbTxHash: string;
  logIndex: number;
  depositKey: string;
  blockNumber: number;
  direction: TransferDirection;
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
      let chunksThisPass = 0;
      const maxChunksPerPass = 50;

      while (fromBlock <= chainHead) {
        const toBlock =
          fromBlock + config.logChunkBlocks - 1n > chainHead
            ? chainHead
            : fromBlock + config.logChunkBlocks - 1n;

        const chunkDeposits = await scanTransfersForRange(
          client,
          config,
          hlAddress,
          fromBlock,
          toBlock,
        );
        deposits.push(...chunkDeposits);
        lastScannedBlock = Number(toBlock);
        fromBlock = toBlock + 1n;
        chunksThisPass += 1;
        if (chunksThisPass >= maxChunksPerPass && fromBlock <= chainHead) {
          break;
        }
      }

      const deduped = dedupeDepositsByKey(deposits);

      if (config.fundingResolver && deduped.length > 0) {
        const inbound = deduped.filter((row) => row.direction === "deposit");
        const outbound = deduped.filter((row) => row.direction === "withdrawal");
        const resolved =
          inbound.length > 0
            ? await config.fundingResolver.resolveDeposits(inbound)
            : [];
        return { deposits: [...resolved, ...outbound], lastScannedBlock };
      }

      return { deposits: deduped, lastScannedBlock };
    },
  };
}

async function scanTransfersForRange(
  client: PublicClient,
  config: ArbitrumDepositScannerConfig,
  hlAddress: Address,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<ParsedDeposit[]> {
  const bridge2DepositLogs = await getLogsWithRetry(client, {
    address: config.usdcAddress,
    event: TRANSFER_EVENT,
    args: {
      from: hlAddress,
      to: config.bridge2Address,
    },
    fromBlock,
    toBlock,
  });
  const extensionDepositLogs = await getLogsWithRetry(client, {
    address: config.usdcAddress,
    event: TRANSFER_EVENT,
    args: {
      from: hlAddress,
      to: config.cctpExtensionAddress,
    },
    fromBlock,
    toBlock,
  });
  const messengerLogs = await getCctpMessengerDepositLogs(
    client,
    config,
    hlAddress,
    fromBlock,
    toBlock,
  );
  const bridge2WithdrawalLogs = await getLogsWithRetry(client, {
    address: config.bridge2Address,
    event: FINALIZED_WITHDRAWAL_EVENT,
    args: {
      user: hlAddress,
    },
    fromBlock,
    toBlock,
  });
  const extensionWithdrawalLogs = await getLogsWithRetry(client, {
    address: config.usdcAddress,
    event: TRANSFER_EVENT,
    args: {
      from: config.cctpExtensionAddress,
      to: hlAddress,
    },
    fromBlock,
    toBlock,
  });

  const allLogs: DepositLog[] = [
    ...bridge2DepositLogs,
    ...extensionDepositLogs,
    ...messengerLogs,
    ...bridge2WithdrawalLogs,
    ...extensionWithdrawalLogs,
  ];

  if (allLogs.length === 0) {
    return [];
  }

  const blockTimestamps = await loadBlockTimestamps(
    client,
    allLogs.map((log) => log.blockNumber),
  );

  const transfers: ParsedDeposit[] = [];

  for (const log of bridge2DepositLogs) {
    const deposit = parseTransferLog(log, blockTimestamps, "deposit");
    if (deposit) {
      transfers.push(deposit);
    }
  }

  for (const log of extensionDepositLogs) {
    const deposit = parseTransferLog(log, blockTimestamps, "deposit");
    if (deposit) {
      transfers.push(deposit);
    }
  }

  for (const log of messengerLogs) {
    const deposit = parseCctpMessengerDepositLog(
      log,
      blockTimestamps,
      hlAddress,
    );
    if (deposit) {
      transfers.push(deposit);
    }
  }

  for (const log of bridge2WithdrawalLogs) {
    const withdrawal = parseFinalizedWithdrawalLog(log, blockTimestamps);
    if (withdrawal) {
      transfers.push(withdrawal);
    }
  }

  for (const log of extensionWithdrawalLogs) {
    const withdrawal = parseTransferLog(log, blockTimestamps, "withdrawal");
    if (withdrawal) {
      transfers.push(withdrawal);
    }
  }

  return transfers;
}

async function getLogsWithRetry(
  client: PublicClient,
  params: Parameters<PublicClient["getLogs"]>[0],
  attempt = 1,
): Promise<DepositLog[]> {
  try {
    return (await client.getLogs(params)) as DepositLog[];
  } catch (error) {
    if (isAlchemyRateLimitError(error) && attempt < 5) {
      const delayMs = 250 * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return getLogsWithRetry(client, params, attempt + 1);
    }
    throw error;
  }
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

  const logs = await requestEthLogsWithRetry(client, filter);

  return logs.map((log) => ({
    blockNumber: BigInt(log.blockNumber),
    data: log.data,
    topics: log.topics as [`0x${string}`, ...`0x${string}`[]],
    transactionHash: log.transactionHash,
    logIndex: Number.parseInt(log.logIndex, 16),
  }));
}

async function requestEthLogsWithRetry(
  client: PublicClient,
  filter: Record<string, unknown>,
  attempt = 1,
): Promise<RawEthLog[]> {
  try {
    return (await client.request({
      method: "eth_getLogs",
      params: [filter] as never,
    })) as RawEthLog[];
  } catch (error) {
    if (isAlchemyRateLimitError(error) && attempt < 5) {
      const delayMs = 250 * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return requestEthLogsWithRetry(client, filter, attempt + 1);
    }
    throw error;
  }
}

function isAlchemyRateLimitError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("429") ||
    message.includes("compute units per second") ||
    message.includes("capacity")
  );
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
  direction: TransferDirection = "deposit",
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

  const from = decoded.args.from.toLowerCase();
  const to = decoded.args.to.toLowerCase();
  const hlAddress = direction === "deposit" ? from : to;
  const sourceAddress = direction === "deposit" ? from : to;
  const amount = Number(decoded.args.value) / 10 ** USDC_DECIMALS;
  const logIndex = log.logIndex ?? 0;
  const arbTxHash = log.transactionHash.toLowerCase();

  return {
    hlAddress,
    sourceAddress,
    amount,
    timestamp,
    arbTxHash,
    logIndex,
    depositKey: `${arbTxHash}:${logIndex}`,
    blockNumber: Number(log.blockNumber),
    direction,
  };
}

export function parseFinalizedWithdrawalLog(
  log: DepositLog,
  blockTimestamps: Map<bigint, number>,
): ParsedDeposit | null {
  const decoded = decodeEventLog({
    abi: [FINALIZED_WITHDRAWAL_EVENT],
    data: log.data,
    topics: log.topics,
  });

  const timestamp = blockTimestamps.get(log.blockNumber);
  if (timestamp === undefined) {
    return null;
  }

  const hlAddress = decoded.args.user.toLowerCase();
  const destination = decoded.args.destination.toLowerCase();
  const amount = Number(decoded.args.usd) / 10 ** USDC_DECIMALS;
  const logIndex = log.logIndex ?? 0;
  const arbTxHash = log.transactionHash.toLowerCase();

  return {
    hlAddress,
    sourceAddress: destination,
    amount,
    timestamp,
    arbTxHash,
    logIndex,
    depositKey: `${arbTxHash}:${logIndex}`,
    blockNumber: Number(log.blockNumber),
    direction: "withdrawal",
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
    direction: "deposit",
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
