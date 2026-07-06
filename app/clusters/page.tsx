import type { Metadata } from "next";
import { preloadQuery } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { ClustersListLive } from "@/components/clusters-list-live";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";

export const metadata: Metadata = {
  title: "Clusters",
};

export default async function ClustersPage() {
  const preloadedClusters = await preloadQuery(api.clusters.list);

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Wallet clusters
          </h1>
          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Groups of Hyperliquid wallets funded from the same Arbitrum address.
            Updated every few minutes from bridge deposit tracing.
          </p>
        </div>
        <ClustersListLive preloadedClusters={preloadedClusters} />
      </div>
    </AppShell>
  );
}
