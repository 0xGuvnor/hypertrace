# Hypertrace ingestion worker

Railway service that watches Convex `watchedAddresses`, subscribes to Hyperliquid WebSocket feeds, and pushes snapshots to Convex HTTP ingest.

## Env vars

| Variable | Required | Description |
| --- | --- | --- |
| `CONVEX_URL` | yes | Convex deployment URL (`https://….convex.cloud`) |
| `WORKER_INGEST_SECRET` | yes | Shared secret with Convex `WORKER_INGEST_SECRET` |
| `HL_WS_URL` | no | Default `wss://api.hyperliquid.xyz/ws` |
| `WATCH_POLL_MS` | no | Poll watch list interval (default 30000) |
| `REFRESH_DEBOUNCE_MS` | no | Debounce after WS events (default 1500) |
| `PORT` | no | Health server port (Railway sets automatically) |

`CONVEX_SITE_URL` is derived from `CONVEX_URL` (`.cloud` → `.site`) when omitted.

## Railway

- Root directory: `worker`
- Builder: Dockerfile (`railway.toml` included)
- Enable public networking if you want Railway health checks on `/health`

## Local

```bash
cd worker
bun install
CONVEX_URL=… WORKER_INGEST_SECRET=… bun run start
```
