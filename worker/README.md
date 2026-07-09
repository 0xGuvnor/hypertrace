# Hypertrace ingestion worker

Railway service that watches Convex `watchedAddresses`, subscribes to Hyperliquid WebSocket feeds, pushes snapshots to Convex HTTP ingest, scans Arbitrum USDC deposits per watched wallet (Bridge2 direct transfers plus Hyperliquid CCTP paths via Circle CctpExtension and Token Messenger V2), and periodically fetches the Hyperliquid stats-data leaderboard into Convex.

## Env vars

| Variable | Required | Description |
| --- | --- | --- |
| `CONVEX_URL` | yes | Convex deployment URL (`https://….convex.cloud`) |
| `WORKER_INGEST_SECRET` | yes | Shared secret with Convex `WORKER_INGEST_SECRET` |
| `HL_WS_URL` | no | Default `wss://api.hyperliquid.xyz/ws` |
| `WATCH_POLL_MS` | no | Poll watch list interval (default 30000) |
| `REFRESH_DEBOUNCE_MS` | no | Debounce after WS events (default 1500) |
| `PORT` | no | Health server port (Railway sets automatically) |
| `ARBITRUM_RPC_URL` | yes | Arbitrum One JSON-RPC URL (Alchemy/Infura) |
| `BRIDGE2_ADDRESS` | no | Default `0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7` |
| `CCTP_EXTENSION_ADDRESS` | no | Hyperliquid CCTP Extension on Arbitrum (default `0xa95d9c1f655341597c94393fddc30cf3c08e4fce`) |
| `CCTP_TOKEN_MESSENGER_V2` | no | Circle CCTP Token Messenger V2 (default `0x28b5a0e9c621a5badaa536219b3a228c8168cf5d`) |
| `USDC_ADDRESS` | no | Default `0xaf88d065e77c8cC2239327C5EDb3A432268e5831` |
| `BRIDGE2_START_BLOCK` | no | Backfill start block (default `468748168`, 2026-06-01 UTC) |
| `FUNDING_LOOKBACK_DAYS` | no | Inbound USDC lookback before each bridge deposit (default 7) |
| `ARBITRUM_LOG_CHUNK_BLOCKS` | no | `eth_getLogs` chunk size (default 2000; use 10 on Alchemy free tier) |
| `DEPOSIT_SCAN_CONCURRENCY` | no | Parallel deposit scans (default 1) |
| `SNAPSHOT_STALE_MS` | no | Poll-only snapshot refresh threshold (default 120000) |
| `META_CACHE_TTL_MS` | no | Shared `metaAndAssetCtxs` cache TTL (default 30000) |
| `HL_MAX_CONCURRENCY` | no | Max parallel Hyperliquid Info API requests (default 3) |
| `HL_MIN_REQUEST_INTERVAL_MS` | no | Min gap between HL request starts (default 100) |
| `HL_WS_MAX_USERS` | no | Max unique wallets on HL user-specific WS + watch-sync refresh (default 10) |
| `WS_REFRESH_MIN_INTERVAL_MS` | no | Min gap between WS-triggered snapshot refreshes per wallet (default 12000) |
| `LEADERBOARD_POLL_MS` | no | Leaderboard fetch interval (default `1800000` = 30 min) |

Deposit `sourceAddress` is resolved via Alchemy `getAssetTransfers` on the same `ARBITRUM_RPC_URL`. Pay-as-you-go is recommended for backfill volume across many watched wallets.

`CONVEX_SITE_URL` is derived from `CONVEX_URL` (`.cloud` → `.site`) when omitted.

## Railway

- Root directory: `worker`
- Builder: Dockerfile (`railway.toml` included)
- Enable public networking if you want Railway health checks on `/health`
- Leaderboard parse helpers are vendored under `worker/src/lib/` because the Docker context is `worker/` only.

## Local

```bash
cd worker
bun install
CONVEX_URL=… WORKER_INGEST_SECRET=… ARBITRUM_RPC_URL=… bun run start
```
