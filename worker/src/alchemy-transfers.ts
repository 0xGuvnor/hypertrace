import type { Address } from "viem";

export type AlchemyTransfer = {
  from: string;
  to: string;
  value: number;
  blockNum: number;
  hash: string;
  timestampMs: number | null;
};

export type AlchemyTransfersConfig = {
  rpcUrl: string;
  usdcAddress: Address;
};

type RawAssetTransfer = {
  from?: string;
  to?: string;
  value?: number | null;
  blockNum?: string;
  hash?: string;
  metadata?: { blockTimestamp?: string };
};

type AssetTransfersResponse = {
  transfers?: RawAssetTransfer[];
  pageKey?: string;
};

export async function fetchInboundUsdcTransfers(
  config: AlchemyTransfersConfig,
  args: {
    toAddress: Address;
    fromBlock: bigint;
    toBlock: bigint;
  },
): Promise<AlchemyTransfer[]> {
  const transfers: AlchemyTransfer[] = [];
  let pageKey: string | undefined;

  do {
    const params: Record<string, unknown> = {
      fromBlock: `0x${args.fromBlock.toString(16)}`,
      toBlock: `0x${args.toBlock.toString(16)}`,
      toAddress: args.toAddress,
      contractAddresses: [config.usdcAddress],
      category: ["erc20"],
      excludeZeroValue: true,
      order: "desc",
      withMetadata: true,
      maxCount: "0x3e8",
    };
    if (pageKey) {
      params.pageKey = pageKey;
    }

    const response = await fetch(config.rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [params],
      }),
    });

    if (!response.ok) {
      throw new Error(`alchemy_getAssetTransfers failed (${response.status})`);
    }

    const body = (await response.json()) as {
      error?: { message?: string };
      result?: AssetTransfersResponse;
    };

    if (body.error) {
      throw new Error(
        `alchemy_getAssetTransfers error: ${body.error.message ?? "unknown"}`,
      );
    }

    const page = body.result?.transfers ?? [];
    for (const transfer of page) {
      const parsed = parseTransfer(transfer);
      if (parsed) {
        transfers.push(parsed);
      }
    }

    pageKey = body.result?.pageKey;
  } while (pageKey);

  return transfers;
}

function parseTransfer(transfer: RawAssetTransfer): AlchemyTransfer | null {
  if (
    typeof transfer.from !== "string" ||
    typeof transfer.to !== "string" ||
    typeof transfer.blockNum !== "string" ||
    typeof transfer.hash !== "string" ||
    transfer.value === null ||
    transfer.value === undefined
  ) {
    return null;
  }

  const blockNum = Number.parseInt(transfer.blockNum, 16);
  if (!Number.isFinite(blockNum)) {
    return null;
  }

  let timestampMs: number | null = null;
  const rawTimestamp = transfer.metadata?.blockTimestamp;
  if (typeof rawTimestamp === "string") {
    const parsed = Date.parse(rawTimestamp);
    if (Number.isFinite(parsed)) {
      timestampMs = parsed;
    }
  }

  return {
    from: transfer.from.toLowerCase(),
    to: transfer.to.toLowerCase(),
    value: transfer.value,
    blockNum,
    hash: transfer.hash.toLowerCase(),
    timestampMs,
  };
}
