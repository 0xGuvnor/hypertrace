import type { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { LeaderboardListLive } from "@/components/leaderboard-list-live";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import {
  LEADERBOARD_LIST_PAGE_SIZE,
  leaderboardListArgsFromView,
  parseLeaderboardSearchParams,
} from "@/lib/leaderboard-list";

export const metadata: Metadata = {
  title: "Leaderboard",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const initialView = parseLeaderboardSearchParams(await searchParams);
  const preloadedLeaderboard = await preloadQuery(api.leaderboard.list, {
    ...leaderboardListArgsFromView(initialView),
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
        <LeaderboardListLive
          preloadedLeaderboard={preloadedLeaderboard}
          initialView={initialView}
        />
      </div>
    </AppShell>
  );
}
