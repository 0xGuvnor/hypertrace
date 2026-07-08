# Hypertrace

Hyperliquid whale tracker. Two differentiators over Hyperliquid's native UI:

1. **Cross-wallet clustering.** Groups of addresses that behave as one entity, starting from shared deposit sources and later correlated trading behavior.
2. **Filterable leaderboard.** PnL windows, account value, and recent activity filters that `app.hyperliquid.xyz/leaderboard` does not offer.

Standalone app. Unrelated to Stonkseer.

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Frontend | Next.js (App Router), shadcn/ui, Tailwind | |
| Database / API | [Convex](https://convex.dev) | Document store + `query` / `mutation` / `action` API. Reactive queries push updates to the client. No separate Postgres/Mongo. |
| Ingestion worker | Bun always-on process on [Railway](https://railway.app) | Talks to Convex over HTTPS (`ConvexHttpClient` / HTTP ingest). No direct DB connection. |
| Chain data | Arbitrum RPC (Alchemy) | Bridge2 + Hyperliquid CCTP deposit tracing |
| Leaderboard data | `stats-data.hyperliquid.xyz` (undocumented) | Periodic Convex cron pull into `leaderboardSnapshots` |
| Auth | Better Auth (planned) | Email/password + social. No wallet sign-in. |
| Alerting | Discord / Telegram (planned) | Webhooks on new or growing clusters |

## Architecture

```
Hyperliquid WS + Info API  ──┐
Arbitrum RPC (deposits)      ├──> Railway worker ──HTTP ingest──> Convex
                             │                              │
                             │         ┌────────────────────┤
                             │         │                    │
                             │         ▼                    ▼
                             │   cron: deposit-source    cron: fetch stats-data
                             │   clustering (3 min)      leaderboard (30 min)
                             │         │                    │
                             │         ▼                    ▼
                             │   clusters table      leaderboardSnapshots
                             │         │                    │
                             └─────────┴────────────────────┘
                                              │
                                              ▼
                                    Next.js frontend (reactive)
```

**Worker uptime matters.** Hyperliquid's WebSocket does not backfill missed events on reconnect. Gaps look the same as inactivity. The worker keeps watched wallets fresh via WS-triggered and poll-based snapshot refreshes, and scans Arbitrum for deposits.

**Worker ↔ Convex.** Plain HTTPS to Convex HTTP routes and mutations. Not the reactive client. Snapshot and deposit writes are batched where possible.

**No browser Hyperliquid WS.** Live UI reads Convex (`walletSnapshots`, watches). The worker owns HL connectivity.

**Convex has no raw SQL.** Clustering and filters use indexed lookups. Heavy one-off analytics belong in an `action` or a data export.

**Leaderboard source caveat.** `https://stats-data.hyperliquid.xyz/Mainnet/leaderboard` is used by community clients and likely powers the official leaderboard UI, but it is not in Hyperliquid's documented API. Treat it as best-effort: no uptime/rate-limit guarantee, schema can change, wrap calls in defensive parsing. Do not make alert-critical paths depend only on it. A fills-derived fallback leaderboard is a future resilience option, not v1.

## Data model (Convex)

| Table | Status | Purpose |
| --- | --- | --- |
| `walletSnapshots` | Shipped | Cached HL account / positions / open orders / recent fills per address |
| `watchedAddresses` | Shipped | 24h TTL watch list driving the worker |
| `deposits` | Shipped | Bridge funding: hlAddress, sourceAddress, amount, timestamp, arbTxHash |
| `depositScanCursors` | Shipped | Per-wallet Arbitrum scan progress |
| `wallets` | Shipped | Tracked addresses: firstSeen, tags, clusterId |
| `clusters` | Shipped | Deposit-source groups: clusterKey, members, confidenceScore, basis |
| `leaderboardSnapshots` | Backend shipped | accountValue, pnlDay/Week/Month/AllTime, lastActivityTimestamp, fetchedAt |
| `fills` (dedicated table) | Not yet | Spec target for durable fill history used by behavioral clustering |

There is no dedicated `fills` table yet. Recent fills live on `walletSnapshots`. Behavioral clustering (signals 2–5) needs durable fill history first.

## Clustering signals (build order)

1. **Shared deposit source.** Same Arbitrum origin funding multiple HL addresses (shipped, rule-based).
2. **Time-correlated same-direction entries.** Same asset/direction within 30-120s.
3. **Position-size ratio consistency.** Stable size ratios across trades.
4. **Matching leverage / TP-SL patterns.** Behavioral fingerprint.
5. **Clustered liquidation prices.** Tight liq-price bands on the same asset.

Signal 1 runs on a Convex cron every 3 minutes (`internal.clusters.rebuildDepositSource`). Signals 2–5 wait on fill history and a statistical layer (DBSCAN / cosine similarity).

## Current state

### Shipped

- Home search → `/address/[address]`: positions, open orders, recent fills, deposits
- Live updates via Railway worker → Convex ingest → `useQuery` on wallet pages
- Arbitrum deposit tracing (Bridge2 + CCTP) with upstream `sourceAddress` resolution
- Deposit-source clustering + `/clusters` list and detail pages
- Leaderboard ingest cron (every 30 min): fetch stats-data endpoint, upsert `leaderboardSnapshots`, auto-create `wallets` rows for surfaced addresses

### In progress / next

- Filterable leaderboard UI (sort/filter on PnL windows, account value, recent activity)
- Cross-reference `lastActivityTimestamp` with tracked fill data where addresses overlap

### Planned

- Better Auth (email/password + Google/GitHub)
- Discord / Telegram alerts on cluster create / growth
- Durable `fills` table + statistical clustering (v2)
- Optional fills-derived leaderboard fallback

## Milestones

1. Convex schema + CRUD. Done (evolved toward snapshots + watches rather than a pure fills table).
2. Railway ingestion worker. Done.
3. Arbitrum deposit tracing. Done.
4. Leaderboard ingestion. Backend done; UI pending.
5. Rule-based clustering (deposit source). Done.
6. Frontend leaderboard view. Next.
7. Frontend clusters view. Done.
8. Better Auth. Planned.
9. Discord / Telegram alerting. Planned.
10. Statistical clustering (v2). Planned.

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev          # Next.js
bun run dev:convex   # Convex dev server (separate terminal)
```

Worker (Railway service root `worker/`):

```bash
cd worker
bun install
CONVEX_URL=… WORKER_INGEST_SECRET=… ARBITRUM_RPC_URL=… bun run start
```

See [`worker/README.md`](worker/README.md) for worker env vars.

For cloud-agent Convex dev:

```bash
CONVEX_AGENT_MODE=anonymous bunx convex dev
```

## Out of scope (for now)

- Wallet-based login (SIWE)
- Multi-user features beyond basic auth
- Stonkseer integration
- SQL-style ad-hoc analytics (export or action instead)
- Fills-only computed leaderboard fallback (future resilience, not v1)

## Links

- GitHub: [0xGuvnor/hypertrace](https://github.com/0xGuvnor/hypertrace)
- Deployed on Vercel (`hypertrace`)
