"use client";

import { useQuery } from "convex/react";

import { ClustersTable } from "@/components/clusters-table";
import { api } from "@/convex/_generated/api";
import type { Cluster } from "@/lib/cluster-types";

export function ClustersListLive({
  initialClusters,
}: {
  initialClusters: Cluster[];
}) {
  const liveClusters = useQuery(api.clusters.list);
  const clusters = liveClusters ?? initialClusters;

  return <ClustersTable clusters={clusters} />;
}
