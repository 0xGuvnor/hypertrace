import type { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { LeaderboardListLive } from "@/components/leaderboard-list-live";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import {
  DEFAULT_LEADERBOARD_ORDER,
  DEFAULT_LEADERBOARD_SORT_BY,
  LEADERBOARD_LIST_PAGE_SIZE,
} from "@/lib/leaderboard-list";

export const metadata: Metadata = {
  title: "Leaderboard",
};

export default async function LeaderboardPage() {
  const preloadedLeaderboard = await preloadQuery(api.leaderboard.list, {
    sortBy: DEFAULT_LEADERBOARD_SORT_BY,
    order: DEFAULT_LEADERBOARD_ORDER,
    paginationOpts: { numItems: LEADERBOARD_LIST_PAGE_SIZE, cursor: null },
  });

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Filterable Hyperliquid whale PnL. Opted-in addresses from
            stats-data.
          </p>
        </div>
        <LeaderboardListLive preloadedLeaderboard={preloadedLeaderboard} />
      </div>
    </AppShell>
  );
}
