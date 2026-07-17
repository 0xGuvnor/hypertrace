import type { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { ClustersListLive } from "@/components/clusters-list-live";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import { CLUSTERS_LIST_PAGE_SIZE } from "@/lib/cluster-list";

export const metadata: Metadata = {
  title: "Clusters",
};

export default async function ClustersPage() {
  const preloadedClusters = await preloadQuery(api.clusters.list, {
    paginationOpts: { numItems: CLUSTERS_LIST_PAGE_SIZE, cursor: null },
  });

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-6">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
            />
            <span>
              Market intelligence
              <span className="text-muted-foreground/50 mx-1.5">/</span>
              Clusters
            </span>
          </p>
          <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Wallet clusters
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-pretty text-sm leading-relaxed">
            Groups of Hyperliquid wallets funded from the same Arbitrum address.
            Updated every few minutes from bridge deposit tracing.
          </p>
        </div>
        <ClustersListLive preloadedClusters={preloadedClusters} />
      </div>
    </AppShell>
  );
}
