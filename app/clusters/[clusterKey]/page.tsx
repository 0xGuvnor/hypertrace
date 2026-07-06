import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { ClusterDetailLive } from "@/components/cluster-detail-live";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/convex/_generated/api";
import { isValidAddress, normalizeAddress, truncateAddress } from "@/lib/address";
import {
  isValidClusterKey,
  parseClusterKey,
  sourceAddressFromClusterKey,
} from "@/lib/cluster-routes";

type PageProps = {
  params: Promise<{ clusterKey: string }>;
  searchParams: Promise<{ from?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { clusterKey: rawKey } = await params;
  const clusterKey = parseClusterKey(rawKey);

  if (!isValidClusterKey(clusterKey)) {
    return { title: "Not found" };
  }

  const sourceAddress = sourceAddressFromClusterKey(clusterKey);
  return {
    title: `${truncateAddress(sourceAddress, 4)} cluster`,
    robots: { index: false, follow: false },
  };
}

export default async function ClusterDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { clusterKey: rawKey } = await params;
  const { from } = await searchParams;
  const clusterKey = parseClusterKey(rawKey);

  if (!isValidClusterKey(clusterKey)) {
    notFound();
  }

  const preloadedCluster = await preloadQuery(api.clusters.getByKey, {
    clusterKey,
  });
  if (preloadedQueryResult(preloadedCluster) === null) {
    notFound();
  }

  const highlightAddress =
    from && isValidAddress(from) ? normalizeAddress(from) : undefined;

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <ClusterDetailLive
        preloadedCluster={preloadedCluster}
        highlightAddress={highlightAddress}
      />
    </AppShell>
  );
}
