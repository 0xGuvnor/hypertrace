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
- Build UI with shadcn/ui components first; do not hand-roll primitives when a shadcn component exists; keep `Button` `className` merge as shadcn ships (`cn(buttonVariants({ variant, size, className }))`); when overriding press translate on absolutely centered icon buttons, use the full `active:not-aria-[haspopup]:…` modifier chain (shorter `active:` overrides won't replace base `active:translate-y-px`).
- When implementing from an attached plan, do not edit the plan file itself.
- Prefer Next.js App Router server patterns: async RSC pages, async `params` as `Promise`, and route-level `loading.tsx`/`error.tsx`/`not-found.tsx`; cluster routes use `preloadQuery` + client `usePreloadedQuery` (clusters list page 2+ via imperative `useConvex().query()` because Convex has no paginated preload); wallet pages use `preloadQuery` for clusters/deposits, cached `getLiveSnapshot` when present, `fetchAction(getSnapshot)` only when missing, then `WalletDetailLive` live subscriptions.
- Keep `'use client'` limited to interactive islands (search forms, tabs, providers); fetch wallet data in the server page.
- Use the `frontend-design` skill for branding and distinctive UI work.
- Wordmark UI: italicize "trace" in Hypertrace (Hyperliquid-style); keep metadata titles plain "Hypertrace".
- Positions table: encode long/short with green/red asset badges; no separate Side column; Leverage column stacks multiplier + Cross/Isolated margin; funding fee negative/red = paid, positive/green = received; sortable on Value/Funding fee/uPnL (default Value desc) via lightweight client-side sort on the existing `Table` (parse HL numeric strings), not shadcn Data Table + TanStack unless multiple tables need shared filter/pagination.
- Route `loading.tsx` skeletons should mirror the live page layout (reuse `AppShell`, `SiteHeader`, and table structure).
- Home page is search-first: flat dark hero (no radial glow), `SiteHeader variant="minimal"` + centered `SiteHeroBrand`, `WalletSearch` near optical center (autofocus); in-input lucide `Search` icon submit; `WalletSearch` input uses `text-base md:text-sm` (16px mobile) to avoid iOS Safari focus zoom.
- Wallet tabs on mobile: full-width equal segments (`flex-1` triggers, `w-full` list); desktop keeps content-sized tabs (`sm:flex-none`, `sm:w-fit`).
- Use `/poteto-mode` for nontrivial implementation, investigation, and architecture work.

## Learned Workspace Facts

- Hypertrace is a Hyperliquid whale tracker with cross-wallet clustering and a filterable leaderboard as core differentiators: Next.js 16 App Router, Convex backend, shadcn/ui, Tailwind, Bun.
- GitHub: `0xGuvnor/hypertrace` on `master`; Vercel project `hypertrace` under team `0xguvnors-projects`; Railway worker project `zealous-cooperation`, service `invigorating-sparkle` (service root `worker/`; run `railway up` from repo root, not `worker/`).
- Shipped UI: `/address/[address]` via `wallets.getSnapshot` (HL Info API: default + xyz HIP-3 dex in parallel: `clearinghouseState` + `userFills` + `frontendOpenOrders`); positions (TP/SL via `isPositionTpsl`, notional from `positionValue`, funding from `cumFunding.sinceOpen`); Open Orders Size shows "Close position" for position-level TP/SL with `sz: "0"`; fills from snapshot with red Liquidated badge when `isLiquidation` (HL liquidation `dir`); `/clusters` paginated list (page 1 `preloadQuery`/`usePreloadedQuery`, load-more via `useConvex().query()`) + detail; `/leaderboard` filterable/sortable list via public `leaderboard.list` over `leaderboardSnapshots` (PnL + volume windows `vlmDay/Week/Month/AllTime`, min-volume chips); `WalletClusterCard` only when the wallet has cluster membership (solo funders get no cluster card); funding source for ingested deposits is the Deposits tab Source column; Deposits empty state cites scan-from date via `lib/deposit-scan.ts` `DEPOSIT_SCAN_START_DATE_LABEL`; no dedicated `fills` table yet.
- Wallet pages SSR: `preloadQuery` clusters/deposits; use cached `walletSnapshots` via `getLiveSnapshot` when present, else `fetchAction(getSnapshot)`; `WalletDetailLive` subscribes via `watches.request` + `useQuery(getLiveSnapshot)` (UI live badge uses `LIVE_STALE_AFTER_MS`, default 6m). Catch load failures on the server page and surface user messages via `walletLoadUserMessage` (e.g. HL rate limits), not uncaught RSC throws.
- Live pipeline: Hyperliquid WS → `worker/` (Railway, Bun) → Convex HTTP ingest (`/ingest/watches`, `/ingest/snapshot`, `/ingest/snapshot-timestamps`, `/ingest/leaderboard`) → `watchedAddresses` (24h TTL) + `walletSnapshots` (by address) + `leaderboardSnapshots` → client `useQuery`; worker poll refreshes only stale snapshots (default 300s), caches shared `metaAndAssetCtxs` (30s TTL, 5 HL calls/wallet), and routes all HL Info API POSTs through a global rate-limited queue; do not subscribe to Hyperliquid from the browser.
- Leaderboard ingestion (project Spec M4; README “M4” is deposit-source clustering — numbering differs): worker polls undocumented `https://stats-data.hyperliquid.xyz/Mainnet/leaderboard` (optional `LEADERBOARD_POLL_MS`, default 30m) and POSTs batches to `/ingest/leaderboard`; upserts `leaderboardSnapshots` + `wallets` only (never `watchedAddresses`); Convex actions cannot own this poll (V8 OOM / cloud cannot reach the stats host), so there is no leaderboard Convex cron/action fetch.
- Worker env: `CONVEX_URL` (prod `wonderful-condor-424.convex.cloud`), `WORKER_INGEST_SECRET` (must match Convex env), required `ARBITRUM_RPC_URL` (Alchemy Hypertrace app `lzbt77vxhe1kq3j6`; use `arb-mainnet` as Alchemy MCP network id), optional `HL_WS_URL`, `WATCH_POLL_MS`, `REFRESH_DEBOUNCE_MS`, `SNAPSHOT_STALE_MS` (default 300s / 5m), `WS_REFRESH_MIN_INTERVAL_MS` (default 5m), `META_CACHE_TTL_MS` (default 30s), `HL_MAX_CONCURRENCY` (default 3), `HL_MIN_REQUEST_INTERVAL_MS` (default 100), `LEADERBOARD_POLL_MS` (default 30m), `BRIDGE2_START_BLOCK` (default June 1 2026 block `468748168`), `FUNDING_LOOKBACK_DAYS` (default 7), `CCTP_EXTENSION_ADDRESS`, `CCTP_TOKEN_MESSENGER_V2` (Circle defaults on Arbitrum).
- Arbitrum deposit tracing (M3/M3.1): per watched wallet, scan USDC `Transfer` logs to Bridge2 (legacy) plus Hyperliquid CCTP paths (Circle CctpExtension outbound transfers and Token Messenger V2 deposit events with the wallet in indexed topic2); first scan backfills from `bridge2StartBlock` (not watch time), so pre-watch deposits still ingest; resolve upstream `sourceAddress` via Alchemy `getAssetTransfers` with `FUNDING_LOOKBACK_DAYS` measured before each deposit timestamp (worker resolution only, not a Deposits tab UI filter); `deposits`, `depositScanCursors`, and `wallets` tables plus HTTP ingest endpoints; `internal.deposits.resetAllScanCursors` one-time backfill after scanner changes (deploy new worker first, then reset cursors); `sourceAddress === hlAddress` is often correct (self-funded, lookback miss, or Alchemy fallback), not necessarily a bug.
- Deposit-source clustering (README M4): signal 1 of 5; behavioral HL signals are the planned differentiator; `confidenceScore = min(1, 0.5 + 0.1 × (memberCount − 1))` in `depositClustering.ts` (member count only, basis `shared_deposit_source`); Allium (not Arkham) is the planned enrichment for Deposits Source labels (separate API/billing from Alchemy; no `addressLabels` table yet); `clusters` table with `memberCount`; cron every 3 min runs `internal.clusters.rebuildDepositSource` using `.collect()` (Convex allows only one `.paginate()` per function); `clusterKey` format `deposit-source:0x…`; `clusters.list` paginated (20/page, `by_memberCount`); `getForWallet` uses indexed deposit-source lookup; `deposits.listByWallet` returns `{ deposits, hasMore }` capped at 100.
- Hyperliquid `cumFunding.sinceOpen` sign is inverted vs `userFunding` cash flow; negate at parse time in `convex/lib/hyperliquid.ts` and `worker/src/hyperliquid.ts`.
- Branding layout uses `AppShell` + `SiteHeader`: home `minimal` sticky header (nav only) + `SiteHeroBrand`; compact sticky header with logo + Clusters/Leaderboard links; mobile nav via shadcn Sheet (`MobileNavMenu`, links in `lib/site-nav.ts`); no header or mobile-sheet logo bottom border; transparent `logo.png` uses `object-contain` (`logo-background.png` is unused reference).
- Convex deployments: dev `wry-fox-504`, prod `wonderful-condor-424`; prefer `bunx convex` CLI when Convex MCP blocks or hangs (MCP `logs` often hangs on prod — use `bunx convex logs --prod --history N` or dashboard); `.vercel` is gitignored; `.cursor/` is intentionally left untracked; for cloud-agent Convex dev, use `CONVEX_AGENT_MODE=anonymous bunx convex dev`; pin `@typescript-eslint/utils` explicitly in devDependencies so `@convex-dev/eslint-plugin` resolves under Bun; root layout `metadataBase` uses `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost.
