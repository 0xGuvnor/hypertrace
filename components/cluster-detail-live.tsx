"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { notFound } from "next/navigation";

import { ClusterDetail } from "@/components/cluster-detail";
import { api } from "@/convex/_generated/api";

export function ClusterDetailLive({
  preloadedCluster,
  highlightAddress,
}: {
  preloadedCluster: Preloaded<typeof api.clusters.getByKey>;
  highlightAddress?: string;
}) {
  const cluster = usePreloadedQuery(preloadedCluster);

  if (cluster === null) {
    notFound();
  }

  return (
    <ClusterDetail cluster={cluster} highlightAddress={highlightAddress} />
  );
}
