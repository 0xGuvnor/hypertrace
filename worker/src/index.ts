import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

import { createArbitrumDepositScanner } from "./arbitrum-deposits";
import { createConvexIngestClient } from "./convex-client";
import { loadConfig } from "./config";
import {
  createFundingResolver,
  resolveDepositBlockNumber,
} from "./funding-resolution";
import { fetchWalletSnapshot, configureHyperliquid } from "./hyperliquid";
import { HyperliquidSocket } from "./hyperliquid-socket";
import type { DepositRow } from "./types";

const config = loadConfig();
configureHyperliquid({
  metaCacheTtlMs: config.metaCacheTtlMs,
  hlMaxConcurrency: config.hlMaxConcurrency,
  hlMinRequestIntervalMs: config.hlMinRequestIntervalMs,
});
const convex = createConvexIngestClient(config.convexSiteUrl, config.ingestSecret);

const arbitrumClient = createPublicClient({
  chain: arbitrum,
  transport: http(config.arbitrumRpcUrl),
});

const fundingResolver = createFundingResolver(arbitrumClient, {
  rpcUrl: config.arbitrumRpcUrl,
  usdcAddress: config.usdcAddress,
  lookbackDays: config.fundingLookbackDays,
  backfillStartBlock: BigInt(config.bridge2StartBlock),
});

const arbitrumScanner = createArbitrumDepositScanner({
  rpcUrl: config.arbitrumRpcUrl,
  bridge2Address: config.bridge2Address,
  usdcAddress: config.usdcAddress,
  bridge2StartBlock: BigInt(config.bridge2StartBlock),
  logChunkBlocks: BigInt(config.arbitrumLogChunkBlocks),
  fundingResolver,
  client: arbitrumClient,
});

const refreshTimers = new Map<string, ReturnType<typeof setTimeout>>();
const inFlight = new Set<string>();
const depositInFlight = new Set<string>();

function startHealthServer() {
  Bun.serve({
    port: config.port,
    fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/health") {
        return new Response("ok");
      }
      return new Response("hypertrace worker", { status: 404 });
    },
  });
  console.log(`[health] listening on :${config.port}`);
}

async function refreshAddress(address: string, reason: string) {
  if (inFlight.has(address)) return;
  inFlight.add(address);
  try {
    const snapshot = await fetchWalletSnapshot(address);
    await convex.upsertSnapshot(snapshot);
    console.log(`[snapshot] ${address.slice(0, 8)}… (${reason})`);
  } catch (error) {
    console.error(`[snapshot] failed for ${address}`, error);
  } finally {
    inFlight.delete(address);
  }
}

function scheduleRefresh(address: string, reason: string) {
  const existing = refreshTimers.get(address);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    refreshTimers.delete(address);
    void refreshAddress(address, reason);
  }, config.refreshDebounceMs);

  refreshTimers.set(address, timer);
}

async function reconcileSelfSourcedDeposits(address: string) {
  const rows = await convex.listSelfSourcedDeposits([address]);
  const forAddress = rows.filter((row) => row.hlAddress === address);
  if (forAddress.length === 0) {
    return;
  }

  const updates: Array<{ depositKey: string; sourceAddress: string }> = [];
  for (const row of forAddress) {
    const blockNumber = await resolveDepositBlockNumber(arbitrumClient, {
      blockNumber: row.blockNumber,
      arbTxHash: row.arbTxHash as `0x${string}`,
    });
    const resolved = await fundingResolver.resolveDeposit({
      ...row,
      blockNumber,
    });
    if (resolved.sourceAddress !== row.hlAddress) {
      updates.push({
        depositKey: row.depositKey,
        sourceAddress: resolved.sourceAddress,
      });
    }
  }

  if (updates.length === 0) {
    return;
  }

  const result = await convex.patchDepositSources(updates);
  console.log(
    `[deposits] ${address.slice(0, 8)}… reconcile updated=${result.updated} skipped=${result.skipped}`,
  );
}

async function scanDepositsForAddress(address: string, cursor: number | null) {
  if (depositInFlight.has(address)) return;
  depositInFlight.add(address);
  try {
    const { deposits, lastScannedBlock } =
      await arbitrumScanner.scanDepositsWithCursor(
        address as `0x${string}`,
        cursor,
      );

    const result = await convex.ingestDeposits(deposits as DepositRow[], [
      { hlAddress: address, lastScannedBlock },
    ]);

    console.log(
      `[deposits] ${address.slice(0, 8)}… found=${deposits.length} inserted=${result.inserted} updated=${result.updated} skipped=${result.skipped} block=${lastScannedBlock}`,
    );

    await reconcileSelfSourcedDeposits(address);
  } catch (error) {
    console.error(`[deposits] failed for ${address}`, error);
  } finally {
    depositInFlight.delete(address);
  }
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  let index = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      await worker(current);
    }
  });
  await Promise.all(runners);
}

async function syncDepositScans(addresses: string[]) {
  if (addresses.length === 0) return;

  try {
    const cursors = await convex.getDepositCursors(addresses);
    await runWithConcurrency(
      addresses,
      config.depositScanConcurrency,
      async (address) => {
        const normalized = address.toLowerCase();
        await scanDepositsForAddress(normalized, cursors[normalized] ?? null);
      },
    );
  } catch (error) {
    console.error("[deposits] sync failed", error);
  }
}

async function syncWatches(socket: HyperliquidSocket) {
  try {
    const addresses = await convex.listActiveWatches();
    socket.syncAddresses(addresses);
    console.log(`[watches] tracking ${addresses.length} address(es)`);

    const timestamps = await convex.getSnapshotTimestamps(addresses);
    const now = Date.now();
    for (const address of addresses) {
      const normalized = address.toLowerCase();
      const updatedAt = timestamps[normalized];
      if (updatedAt == null || now - updatedAt >= config.snapshotStaleMs) {
        scheduleRefresh(normalized, "watch-sync");
      }
    }

    void syncDepositScans(addresses);
  } catch (error) {
    console.error("[watches] sync failed", error);
  }
}

async function main() {
  startHealthServer();

  const socket = new HyperliquidSocket({
    wsUrl: config.hlWsUrl,
    onUserEvent: (address) => scheduleRefresh(address, "ws-event"),
    onReady: () => {
      void syncWatches(socket);
    },
    onDisconnect: () => {
      console.warn("[worker] hyperliquid socket disconnected");
    },
  });

  socket.start();
  setInterval(() => {
    void syncWatches(socket);
  }, config.watchPollMs);

  console.log("[worker] hypertrace ingestion worker started");
}

void main();
