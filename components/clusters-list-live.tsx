"use client";

import { usePaginatedQuery } from "convex/react";

import { ClustersTable } from "@/components/clusters-table";
import { api } from "@/convex/_generated/api";
import { CLUSTERS_LIST_PAGE_SIZE } from "@/lib/cluster-list";

export function ClustersListLive() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.clusters.list,
    {},
    { initialNumItems: CLUSTERS_LIST_PAGE_SIZE },
  );

  return (
    <ClustersTable
      clusters={results ?? []}
      canLoadMore={status === "CanLoadMore"}
      isLoadingMore={status === "LoadingMore"}
      onLoadMore={() => loadMore(CLUSTERS_LIST_PAGE_SIZE)}
    />
  );
}
