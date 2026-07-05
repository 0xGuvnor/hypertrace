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
- Prefer Next.js App Router server patterns: async RSC pages, `fetchAction` from `convex/nextjs`, async `params` as `Promise`, and route-level `loading.tsx`/`error.tsx`/`not-found.tsx`.
- Keep `'use client'` limited to interactive islands (search forms, tabs, providers); fetch wallet data in the server page.
- Use the `frontend-design` skill for branding and distinctive UI work.
- Wordmark UI: italicize "trace" in Hypertrace (Hyperliquid-style); keep metadata titles plain "Hypertrace".
- Positions table: encode long/short with green/red asset badges; no separate Side column.
- Route `loading.tsx` skeletons should mirror the live page layout (reuse `AppShell`, `SiteHeader`, and table structure).

## Learned Workspace Facts

- Hypertrace is a Hyperliquid whale tracker: Next.js 16 App Router, Convex backend, shadcn/ui, Tailwind, Bun.
- GitHub: `0xGuvnor/hypertrace` on `master`; Vercel project `hypertrace` under team `0xguvnors-projects`.
- v0 feature: address search at `/address/[address]` via Convex action `wallets.getSnapshot`, calling Hyperliquid Info API (`clearinghouseState` + `userFills` + `frontendOpenOrders` at `https://api.hyperliquid.xyz/info`); UI shows positions (with TP/SL), an Open Orders tab, and fills.
- Wallet pages use server `fetchAction` for the first paint, then `WalletDetailLive` subscribes via `watches.request` + `useQuery(api.wallets.getLiveSnapshot)`.
- Live pipeline: Hyperliquid WS → `worker/` (Railway, Bun) → Convex HTTP ingest (`/ingest/watches`, `/ingest/snapshot`) → `walletSnapshots` table → client `useQuery`.
- Convex tables: `watchedAddresses` (24h TTL via `lastRequestedAt`), `walletSnapshots` (indexed by `address`).
- Worker env: `CONVEX_URL`, `WORKER_INGEST_SECRET` (must match Convex env), optional `HL_WS_URL`, `WATCH_POLL_MS`, `REFRESH_DEBOUNCE_MS`; Railway root directory `worker`.
- Do not subscribe to Hyperliquid from the browser.
- `@convex-dev/eslint-plugin` is configured; `convex/_generated/**` is ignored in ESLint.
- Branding layout uses `AppShell` + `SiteHeader` (hero/compact variants); logo at `public/logo.png`.
- Root layout metadata uses `NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → localhost for `metadataBase`.
- `.vercel` is gitignored; `.cursor/` is intentionally left untracked.
- For cloud-agent Convex dev, use `CONVEX_AGENT_MODE=anonymous bunx convex dev`.
