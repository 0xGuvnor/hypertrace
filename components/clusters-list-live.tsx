"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";

import { ClustersTable } from "@/components/clusters-table";
import { api } from "@/convex/_generated/api";

export function ClustersListLive({
  preloadedClusters,
}: {
  preloadedClusters: Preloaded<typeof api.clusters.list>;
}) {
  const clusters = usePreloadedQuery(preloadedClusters);

  return <ClustersTable clusters={clusters} />;
}
