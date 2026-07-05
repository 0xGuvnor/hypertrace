import type { WorkerConfig } from "./types";

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
  };
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
