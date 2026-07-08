"use client";

import {
  Preloaded,
  useConvex,
  usePreloadedQuery,
} from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { ClustersTable } from "@/components/clusters-table";
import { api } from "@/convex/_generated/api";
import type { Cluster } from "@/lib/cluster-types";
import { CLUSTERS_LIST_PAGE_SIZE } from "@/lib/cluster-list";

type ClustersListLiveProps = {
  preloadedClusters: Preloaded<typeof api.clusters.list>;
};

type ClustersListTailProps = {
  firstPage: {
    page: Cluster[];
    continueCursor: string | null;
    isDone: boolean;
  };
};

function ClustersListTail({ firstPage }: ClustersListTailProps) {
  const convex = useConvex();
  const [additionalClusters, setAdditionalClusters] = useState<Cluster[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [exhausted, setExhausted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const clusters = useMemo(
    () => [...firstPage.page, ...additionalClusters],
    [firstPage.page, additionalClusters],
  );

  const canLoadMore =
    !exhausted &&
    (additionalClusters.length > 0
      ? nextCursor !== null
      : !firstPage.isDone);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || exhausted) return;

    const cursor =
      additionalClusters.length === 0
        ? firstPage.continueCursor
        : nextCursor;
    if (cursor === null) return;

    setLoadingMore(true);
    try {
      const result = await convex.query(api.clusters.list, {
        paginationOpts: {
          numItems: CLUSTERS_LIST_PAGE_SIZE,
          cursor,
        },
      });
      setAdditionalClusters((prev) => [...prev, ...result.page]);
      setNextCursor(result.continueCursor);
      setExhausted(result.isDone);
    } finally {
      setLoadingMore(false);
    }
  }, [
    additionalClusters.length,
    convex,
    exhausted,
    firstPage.continueCursor,
    loadingMore,
    nextCursor,
  ]);

  return (
    <ClustersTable
      clusters={clusters}
      canLoadMore={canLoadMore}
      isLoadingMore={loadingMore}
      onLoadMore={() => void handleLoadMore()}
    />
  );
}

export function ClustersListLive({ preloadedClusters }: ClustersListLiveProps) {
  const firstPage = usePreloadedQuery(preloadedClusters);

  const firstPageKey = useMemo(
    () => firstPage.page.map((cluster) => cluster.clusterKey).join(","),
    [firstPage.page],
  );

  return <ClustersListTail key={firstPageKey} firstPage={firstPage} />;
}
