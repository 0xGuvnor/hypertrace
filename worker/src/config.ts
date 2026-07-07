import type { WorkerConfig } from "./types";
import { JUNE_1_2026_START_BLOCK } from "./types";

export function loadConfig(): WorkerConfig {
  const convexUrl = requiredEnv("CONVEX_URL");
  const convexSiteUrl =
    process.env.CONVEX_SITE_URL ?? convexUrl.replace(".convex.cloud", ".convex.site");

  return {
    convexSiteUrl,
    ingestSecret: requiredEnv("WORKER_INGEST_SECRET"),
    hlWsUrl: process.env.HL_WS_URL ?? "wss://api.hyperliquid.xyz/ws",
    watchPollMs: numberEnv("WATCH_POLL_MS", 30_000),
    refreshDebounceMs: numberEnv("REFRESH_DEBOUNCE_MS", 1_500),
    port: numberEnv("PORT", 8080),
    arbitrumRpcUrl: requiredEnv("ARBITRUM_RPC_URL"),
    bridge2Address: addressEnv(
      "BRIDGE2_ADDRESS",
      "0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7",
    ),
    usdcAddress: addressEnv(
      "USDC_ADDRESS",
      "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    ),
    bridge2StartBlock: numberEnv("BRIDGE2_START_BLOCK", JUNE_1_2026_START_BLOCK),
    arbitrumLogChunkBlocks: numberEnv("ARBITRUM_LOG_CHUNK_BLOCKS", 2_000),
    depositScanConcurrency: numberEnv("DEPOSIT_SCAN_CONCURRENCY", 3),
    fundingLookbackDays: numberEnv("FUNDING_LOOKBACK_DAYS", 7),
    snapshotStaleMs: numberEnv("SNAPSHOT_STALE_MS", 120_000),
    metaCacheTtlMs: numberEnv("META_CACHE_TTL_MS", 30_000),
    hlMaxConcurrency: numberEnv("HL_MAX_CONCURRENCY", 3),
    hlMinRequestIntervalMs: numberEnv("HL_MIN_REQUEST_INTERVAL_MS", 100),
    wsRefreshMinIntervalMs: numberEnv("WS_REFRESH_MIN_INTERVAL_MS", 12_000),
  };
}

function addressEnv(name: string, fallback: `0x${string}`): `0x${string}` {
  const value = process.env[name];
  if (!value) return fallback;
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    throw new Error(`Invalid address for ${name}: ${value}`);
  }
  return value as `0x${string}`;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid number for ${name}: ${raw}`);
  }
  return parsed;
}
