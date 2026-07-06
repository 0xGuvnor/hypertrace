# Hypertrace

Hyperliquid whale tracker with **cross-wallet clustering** as the core differentiator. Hypertrace goes beyond Hyperliquid's native UI by detecting coordinated wallet clusters — groups of addresses that behave as a single entity, based on shared deposit sources and correlated trading behavior.

Standalone app. Unrelated to Stonkseer.

## Overview

| Layer | Choice |
| --- | --- |
| Frontend | Next.js (App Router), shadcn/ui, Tailwind |
| Database / API | [Convex](https://convex.dev) — reactive queries, document store, no separate SQL DB |
| Ingestion worker | Node/Bun always-on process on [Railway](https://railway.app) |
| Chain data | Arbitrum RPC (Alchemy or Infura) for bridge deposit tracing |
| Auth | Better Auth — email/password + social (Google, GitHub). No wallet sign-in |
| Alerting | Discord / Telegram webhooks on cluster changes |

## Architecture

```
Hyperliquid WS (trades, userEvents, activeAssetCtx, allMids)  ──┐
                                                                  ├──> Railway worker
Arbitrum RPC (bridge deposit events)                            ──┘         │
                                                                              │ batched mutations
                                                                              ▼
                                                                     Convex (fills, deposits)
                                                                              │
                                                              scheduled cron (1–5 min)
                                                                              │
                                                            clustering job (rule-based → statistical)
                                                                              │
                                                                              ▼
                                                            clusters table + diff detection
                                                                              │
                                                    ┌─────────────────────────┴─────────────────────────┐
                                                    ▼                                                   ▼
                                          Next.js frontend (reactive)                    Discord / Telegram alerts
```

The worker runs continuously. Hyperliquid's WebSocket does not backfill missed events on reconnect, so gaps in fill history look identical to inactivity and break clustering signals. The frontend may hold its own direct WS connection for a live view, separate from the worker's history-building role.

Worker ↔ Convex integration uses `ConvexHttpClient` over HTTPS (not the reactive client). Fills are batched over a short window (1–5s) into a single mutation to reduce overhead and survive brief network blips.

## Data model (Convex)

| Table | Purpose |
| --- | --- |
| `fills` | Per-trade records: address, asset, side, size, price, leverage, timestamp, txHash |
| `deposits` | Bridge funding: hlAddress, sourceAddress, amount, timestamp, arbTxHash |
| `wallets` | Tracked addresses: firstSeen, tags, clusterId |
| `clusters` | Detected groups: memberAddresses, confidenceScore, basis signals, lastUpdated |

Watched whale addresses are public Hyperliquid data, not tied to the logged-in user's wallet. Per-user watchlists are a `users` → `address` join when auth ships.

## Clustering signals (build order)

1. **Shared deposit source** — same Arbitrum wallet funding multiple HL addresses (rule-based join, ship first)
2. **Time-correlated same-direction entries** — same asset, same direction, within 30–120s
3. **Position-size ratio consistency** — stable size ratios across trades
4. **Matching leverage / TP-SL patterns** — behavioral fingerprint
5. **Clustered liquidation prices** — tight liquidation-price bands on the same asset

Rule-based clustering (signal 1) ships before statistical methods (DBSCAN / cosine similarity over feature vectors for signals 2–5). Statistical clustering needs sufficient fill history first.

## Milestones

1. Convex schema + CRUD for fills, deposits, wallets, clusters
2. Railway ingestion worker — Hyperliquid WS → batched Convex mutations
3. Arbitrum deposit tracing → `deposits` table
4. Rule-based clustering cron — deposit-source join → `clusters`
5. Frontend — reactive fills / clusters view (wallet lookup ships early as search entry point)
6. Better Auth
7. Discord / Telegram alerting on cluster diffs
8. Statistical clustering (v2)

## Current state

v0 ships wallet search at `/address/[address]`: positions, open orders, and recent fills via Hyperliquid Info API, with live updates through the Railway worker → Convex ingest pipeline. Clustering and alerting are on the roadmap above.

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev          # Next.js
bun run dev:convex   # Convex dev server (separate terminal)
```

Worker (Railway root directory `worker`):

```bash
cd worker
bun install
CONVEX_URL=… WORKER_INGEST_SECRET=… bun run start
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
- SQL-style ad-hoc analytics (export + action instead)

## Links

- GitHub: [0xGuvnor/hypertrace](https://github.com/0xGuvnor/hypertrace)
- Deployed on Vercel (`hypertrace`)
