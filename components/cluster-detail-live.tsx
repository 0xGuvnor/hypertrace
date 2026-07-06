"use client";

import { useQuery } from "convex/react";
import { notFound } from "next/navigation";

import { ClusterDetail } from "@/components/cluster-detail";
import { api } from "@/convex/_generated/api";
import type { Cluster } from "@/lib/cluster-types";

export function ClusterDetailLive({
  clusterKey,
  initialCluster,
  highlightAddress,
}: {
  clusterKey: string;
  initialCluster: Cluster;
  highlightAddress?: string;
}) {
  const liveCluster = useQuery(api.clusters.getByKey, { clusterKey });
  const cluster = liveCluster ?? initialCluster;

  if (cluster === null) {
    notFound();
  }

  return (
    <ClusterDetail cluster={cluster} highlightAddress={highlightAddress} />
  );
}
