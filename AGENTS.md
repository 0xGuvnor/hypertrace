<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

## Learned User Preferences

- Use Bun for this repo: `bun add`, `bun run` for scripts, and `bunx` for ad-hoc CLIs (Convex, shadcn); avoid `npx`/`npm`.
- Build UI with shadcn/ui components first; do not hand-roll primitives when a shadcn component exists.
- When implementing from an attached plan, do not edit the plan file itself.
- Prefer Next.js App Router server patterns: async RSC pages, async `params` as `Promise`, and route-level `loading.tsx`/`error.tsx`/`not-found.tsx`; cluster routes use `preloadQuery` + client `usePreloadedQuery`; wallet pages use `preloadQuery` for clusters/deposits, cached `getLiveSnapshot` when fresh (<90s), `fetchAction(getSnapshot)` only when stale, then `WalletDetailLive` live subscriptions.
- Keep `'use client'` limited to interactive islands (search forms, tabs, providers); fetch wallet data in the server page.
- Use the `frontend-design` skill for branding and distinctive UI work.
- Wordmark UI: italicize "trace" in Hypertrace (Hyperliquid-style); keep metadata titles plain "Hypertrace".
- Positions table: encode long/short with green/red asset badges; no separate Side column; Leverage column stacks multiplier + Cross/Isolated margin; funding fee negative/red = paid, positive/green = received.
- Route `loading.tsx` skeletons should mirror the live page layout (reuse `AppShell`, `SiteHeader`, and table structure).
- Home page is search-first: compact hero with `WalletSearch` anchored near optical center (autofocus); in-input lucide `Search` icon submit, not a separate Search button.
- Wallet tabs on mobile: full-width equal segments (`flex-1` triggers, `w-full` list); desktop keeps content-sized tabs (`sm:flex-none`, `sm:w-fit`).
- Use `/poteto-mode` for nontrivial implementation, investigation, and architecture work.

## Learned Workspace Facts

- Hypertrace is a Hyperliquid whale tracker with cross-wallet clustering as the core differentiator: Next.js 16 App Router, Convex backend, shadcn/ui, Tailwind, Bun.
- GitHub: `0xGuvnor/hypertrace` on `master`; Vercel project `hypertrace` under team `0xguvnors-projects`.
- Shipped UI: `/address/[address]` via `wallets.getSnapshot` (HL Info API: default + xyz HIP-3 dex in parallel: `clearinghouseState` + `userFills` + `frontendOpenOrders`); positions (TP/SL via `isPositionTpsl`, notional from `positionValue`, funding from `cumFunding.sinceOpen`); Open Orders Size shows "Close position" for position-level TP/SL with `sz: "0"`; fills from snapshot; `/clusters` paginated list + detail; wallet cluster card and Deposits tab; no dedicated `fills` table yet.
- Wallet pages SSR: `preloadQuery` clusters/deposits; use cached `walletSnapshots` via `getLiveSnapshot` when fresh (<90s), else `fetchAction(getSnapshot)`; `WalletDetailLive` subscribes via `watches.request` + `useQuery(getLiveSnapshot)`. Catch load failures on the server page and surface user messages via `walletLoadUserMessage` (e.g. HL rate limits), not uncaught RSC throws.
- Live pipeline: Hyperliquid WS → `worker/` (Railway, Bun) → Convex HTTP ingest (`/ingest/watches`, `/ingest/snapshot`) → `watchedAddresses` (24h TTL) + `walletSnapshots` (by address) → client `useQuery`; do not subscribe to Hyperliquid from the browser.
- Worker env: `CONVEX_URL`, `WORKER_INGEST_SECRET` (must match Convex env), required `ARBITRUM_RPC_URL` (Alchemy), optional `HL_WS_URL`, `WATCH_POLL_MS`, `REFRESH_DEBOUNCE_MS`, `BRIDGE2_START_BLOCK` (default June 1 2026 block `468748168`), `FUNDING_LOOKBACK_DAYS` (default 7); Railway root directory `worker`.
- Arbitrum deposit tracing (M3/M3.1): per watched wallet, scan Bridge2 USDC `Transfer` logs to the bridge (not on-chain `Deposit` events); resolve upstream `sourceAddress` via Alchemy `getAssetTransfers` with 7-day lookback; `deposits`, `depositScanCursors`, and `wallets` tables plus HTTP ingest endpoints.
- Deposit-source clustering (M4): `clusters` table with `memberCount`; cron every 3 min runs `internal.clusters.rebuildDepositSource`; `clusterKey` format `deposit-source:0x…`; `clusters.list` paginated (20/page, `by_memberCount`); `getForWallet` uses indexed deposit-source lookup; `deposits.listByWallet` returns `{ deposits, hasMore }` capped at 100.
- Hyperliquid `cumFunding.sinceOpen` sign is inverted vs `userFunding` cash flow; negate at parse time in `convex/lib/hyperliquid.ts` and `worker/src/hyperliquid.ts`.
- Branding layout uses `AppShell` + `SiteHeader` (hero/compact variants); transparent `logo.png` uses `object-contain` with no clipped wrapper (`logo-background.png` is unused full-bleed reference).
- Root layout metadata uses `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost for `metadataBase`.
- `.vercel` is gitignored; `.cursor/` is intentionally left untracked; for cloud-agent Convex dev, use `CONVEX_AGENT_MODE=anonymous bunx convex dev`.
