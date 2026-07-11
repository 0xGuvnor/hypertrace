"use client";

import {
  Preloaded,
  useConvex,
  usePreloadedQuery,
} from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import { LeaderboardControls } from "@/components/leaderboard-controls";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { api } from "@/convex/_generated/api";
import { formatTimestamp } from "@/lib/format";
import {
  LEADERBOARD_LIST_PAGE_SIZE,
  type LeaderboardListArgs,
  type LeaderboardOrder,
  type LeaderboardRow,
  type LeaderboardSortBy,
  type LeaderboardTailStatus,
  type LeaderboardView,
  type MinAccountValueFilter,
  type MinVolumeFilter,
  type PnlWindow,
  leaderboardHref,
  leaderboardListArgsFromView,
  parseLeaderboardSearchParams,
  PNL_WINDOW_TO_SORT,
} from "@/lib/leaderboard-list";
import { useInView } from "@/lib/use-in-view";

type LeaderboardListLiveProps = {
  preloadedLeaderboard: Preloaded<typeof api.leaderboard.list>;
  initialView: LeaderboardView;
};

type PageResult = {
  page: LeaderboardRow[];
  continueCursor: string | null;
  isDone: boolean;
};

function matchesPreloadedView(
  view: LeaderboardView,
  initialView: LeaderboardView,
): boolean {
  return (
    view.sortBy === initialView.sortBy &&
    view.order === initialView.order &&
    view.minAccountValueFilter === initialView.minAccountValueFilter &&
    view.minVolumeFilter === initialView.minVolumeFilter &&
    view.pnlWindow === initialView.pnlWindow
  );
}

function viewFromLocation(): LeaderboardView {
  return parseLeaderboardSearchParams(
    new URLSearchParams(window.location.search),
  );
}

function LeaderboardListTail({
  firstPage,
  listArgs,
  pnlWindow,
  sortBy,
  sortOrder,
  onSort,
}: {
  firstPage: PageResult;
  listArgs: LeaderboardListArgs;
  pnlWindow: PnlWindow;
  sortBy: LeaderboardSortBy;
  sortOrder: LeaderboardOrder;
  onSort: (key: LeaderboardSortBy) => void;
}) {
  const convex = useConvex();
  const [additionalRows, setAdditionalRows] = useState<LeaderboardRow[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [exhausted, setExhausted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const rows = useMemo(
    () => [...firstPage.page, ...additionalRows],
    [firstPage.page, additionalRows],
  );

  const canLoadMore =
    !exhausted &&
    (additionalRows.length > 0
      ? nextCursor !== null
      : !firstPage.isDone && firstPage.continueCursor !== null);

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || exhausted) return;

    const cursor =
      additionalRows.length === 0 ? firstPage.continueCursor : nextCursor;
    if (cursor === null) return;

    setLoadingMore(true);
    try {
      const result = await convex.query(api.leaderboard.list, {
        ...listArgs,
        paginationOpts: {
          numItems: LEADERBOARD_LIST_PAGE_SIZE,
          cursor,
        },
      });
      setAdditionalRows((prev) => [...prev, ...result.page]);
      setNextCursor(result.continueCursor);
      setExhausted(result.isDone);
    } finally {
      setLoadingMore(false);
    }
  }, [
    additionalRows.length,
    convex,
    exhausted,
    firstPage.continueCursor,
    listArgs,
    loadingMore,
    nextCursor,
  ]);

  const { ref: sentinelRef, inView } = useInView({
    rootMargin: "0px",
    enabled: canLoadMore,
  });

  useEffect(() => {
    if (inView && canLoadMore && !loadingMore) {
      void handleLoadMore();
    }
  }, [inView, canLoadMore, loadingMore, handleLoadMore]);

  const tail: LeaderboardTailStatus = loadingMore
    ? "loadingMore"
    : canLoadMore
      ? "canLoadMore"
      : "exhausted";

  return (
    <LeaderboardTable
      rows={rows}
      pnlWindow={pnlWindow}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      tail={tail}
      sentinelRef={sentinelRef}
    />
  );
}

export function LeaderboardListLive({
  preloadedLeaderboard,
  initialView,
}: LeaderboardListLiveProps) {
  const router = useRouter();
  const preloadedPage = usePreloadedQuery(preloadedLeaderboard);
  const convex = useConvex();

  const [pnlWindow, setPnlWindow] = useState<PnlWindow>(initialView.pnlWindow);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>(initialView.sortBy);
  const [sortOrder, setSortOrder] = useState<LeaderboardOrder>(
    initialView.order,
  );
  const [minAccountValueFilter, setMinAccountValueFilter] =
    useState<MinAccountValueFilter>(initialView.minAccountValueFilter);
  const [minVolumeFilter, setMinVolumeFilter] = useState<MinVolumeFilter>(
    initialView.minVolumeFilter,
  );
  const [queriedPage, setQueriedPage] = useState<PageResult | null>(null);
  const [querying, setQuerying] = useState(false);

  const currentView = useMemo(
    (): LeaderboardView => ({
      pnlWindow,
      sortBy,
      order: sortOrder,
      minAccountValueFilter,
      minVolumeFilter,
    }),
    [minAccountValueFilter, minVolumeFilter, pnlWindow, sortBy, sortOrder],
  );

  const listArgs = useMemo(
    () => leaderboardListArgsFromView(currentView),
    [currentView],
  );

  const usePreloaded = matchesPreloadedView(currentView, initialView);

  const firstPage = usePreloaded
    ? preloadedPage
    : (queriedPage ?? {
        page: [],
        continueCursor: null,
        isDone: !querying,
      });

  const snapshotAt = useMemo(() => {
    const rows = firstPage.page;
    if (rows.length === 0) return null;
    return rows.reduce(
      (max, row) => (row.fetchedAt > max ? row.fetchedAt : max),
      rows[0]!.fetchedAt,
    );
  }, [firstPage.page]);

  const remountKey = useMemo(
    () =>
      [
        sortBy,
        sortOrder,
        minAccountValueFilter,
        minVolumeFilter,
        pnlWindow,
        firstPage.page.map((row) => row.address).join(","),
      ].join("|"),
    [
      firstPage.page,
      minAccountValueFilter,
      minVolumeFilter,
      pnlWindow,
      sortBy,
      sortOrder,
    ],
  );

  const refetch = useCallback(
    async (nextArgs: LeaderboardListArgs) => {
      setQuerying(true);
      try {
        const result = await convex.query(api.leaderboard.list, {
          ...nextArgs,
          paginationOpts: {
            numItems: LEADERBOARD_LIST_PAGE_SIZE,
            cursor: null,
          },
        });
        setQueriedPage(result);
      } finally {
        setQuerying(false);
      }
    },
    [convex],
  );

  const applyView = useCallback(
    (
      nextSortBy: LeaderboardSortBy,
      nextOrder: LeaderboardOrder,
      nextAccountValueFilter: MinAccountValueFilter,
      nextVolumeFilter: MinVolumeFilter,
      nextWindow: PnlWindow,
      options?: { syncUrl?: boolean },
    ) => {
      const nextView: LeaderboardView = {
        pnlWindow: nextWindow,
        sortBy: nextSortBy,
        order: nextOrder,
        minAccountValueFilter: nextAccountValueFilter,
        minVolumeFilter: nextVolumeFilter,
      };
      setSortBy(nextSortBy);
      setSortOrder(nextOrder);
      setMinAccountValueFilter(nextAccountValueFilter);
      setMinVolumeFilter(nextVolumeFilter);
      setPnlWindow(nextWindow);
      if (options?.syncUrl !== false) {
        router.replace(leaderboardHref(nextView), { scroll: false });
      }
      if (matchesPreloadedView(nextView, initialView)) {
        setQueriedPage(null);
        return;
      }
      void refetch(leaderboardListArgsFromView(nextView));
    },
    [initialView, refetch, router],
  );

  useLayoutEffect(() => {
    const fromUrl = viewFromLocation();
    if (matchesPreloadedView(fromUrl, initialView)) return;
    applyView(
      fromUrl.sortBy,
      fromUrl.order,
      fromUrl.minAccountValueFilter,
      fromUrl.minVolumeFilter,
      fromUrl.pnlWindow,
      { syncUrl: false },
    );
  }, [applyView, initialView]);

  const handlePnlWindowChange = useCallback(
    (window: PnlWindow) => {
      applyView(
        PNL_WINDOW_TO_SORT[window],
        "desc",
        minAccountValueFilter,
        minVolumeFilter,
        window,
      );
    },
    [applyView, minAccountValueFilter, minVolumeFilter],
  );

  const handleSort = useCallback(
    (key: LeaderboardSortBy) => {
      const nextOrder: LeaderboardOrder =
        sortBy === key && sortOrder === "desc" ? "asc" : "desc";
      let nextWindow = pnlWindow;
      if (key === "pnlDay" || key === "vlmDay") nextWindow = "day";
      if (key === "pnlWeek" || key === "vlmWeek") nextWindow = "week";
      if (key === "pnlMonth" || key === "vlmMonth") nextWindow = "month";
      if (key === "pnlAllTime" || key === "vlmAllTime") nextWindow = "allTime";
      applyView(
        key,
        nextOrder,
        minAccountValueFilter,
        minVolumeFilter,
        nextWindow,
      );
    },
    [
      applyView,
      minAccountValueFilter,
      minVolumeFilter,
      pnlWindow,
      sortBy,
      sortOrder,
    ],
  );

  const handleMinAccountValueFilterChange = useCallback(
    (filter: MinAccountValueFilter) => {
      applyView(sortBy, sortOrder, filter, minVolumeFilter, pnlWindow);
    },
    [applyView, minVolumeFilter, pnlWindow, sortBy, sortOrder],
  );

  const handleMinVolumeFilterChange = useCallback(
    (filter: MinVolumeFilter) => {
      applyView(sortBy, sortOrder, minAccountValueFilter, filter, pnlWindow);
    },
    [applyView, minAccountValueFilter, pnlWindow, sortBy, sortOrder],
  );

  return (
    <div className="relative flex min-w-0 flex-col gap-4">
      {querying ? (
        <p className="text-muted-foreground absolute top-0 right-0 text-xs">
          Updating…
        </p>
      ) : null}
      {snapshotAt !== null ? (
        <p className="text-muted-foreground -mt-2 text-xs">
          Snapshot as of {formatTimestamp(snapshotAt)}
        </p>
      ) : null}
      <LeaderboardControls
        pnlWindow={pnlWindow}
        onPnlWindowChange={handlePnlWindowChange}
        minAccountValueFilter={minAccountValueFilter}
        onMinAccountValueFilterChange={handleMinAccountValueFilterChange}
        minVolumeFilter={minVolumeFilter}
        onMinVolumeFilterChange={handleMinVolumeFilterChange}
      />
      <LeaderboardListTail
        key={remountKey}
        firstPage={firstPage}
        listArgs={listArgs}
        pnlWindow={pnlWindow}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
}
