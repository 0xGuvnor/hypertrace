"use client";

import {
  Preloaded,
  useConvex,
  usePreloadedQuery,
} from "convex/react";
import { useCallback, useMemo, useState } from "react";

import { LeaderboardControls } from "@/components/leaderboard-controls";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { api } from "@/convex/_generated/api";
import { formatTimestamp } from "@/lib/format";
import {
  activeSinceFromWindow,
  DEFAULT_LEADERBOARD_ORDER,
  DEFAULT_LEADERBOARD_SORT_BY,
  DEFAULT_PNL_WINDOW,
  LEADERBOARD_LIST_PAGE_SIZE,
  type ActivityWindow,
  type LeaderboardOrder,
  type LeaderboardRow,
  type LeaderboardSortBy,
  type PnlWindow,
  PNL_WINDOW_TO_SORT,
} from "@/lib/leaderboard-list";

type LeaderboardListLiveProps = {
  preloadedLeaderboard: Preloaded<typeof api.leaderboard.list>;
};

type ListArgs = {
  sortBy: LeaderboardSortBy;
  order: LeaderboardOrder;
  minAccountValue?: number;
  activeSince?: number;
};

type PageResult = {
  page: LeaderboardRow[];
  continueCursor: string | null;
  isDone: boolean;
};

function parseMinAccountValue(draft: string): number | undefined {
  const trimmed = draft.trim();
  if (trimmed === "") return undefined;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return value;
}

function buildListArgs(
  sortBy: LeaderboardSortBy,
  order: LeaderboardOrder,
  minAccountValue: number | undefined,
  activityWindow: ActivityWindow,
): ListArgs {
  return {
    sortBy,
    order,
    ...(minAccountValue !== undefined ? { minAccountValue } : {}),
    ...(activityWindow !== "any"
      ? { activeSince: activeSinceFromWindow(activityWindow, Date.now()) }
      : {}),
  };
}

function isDefaultArgs(
  sortBy: LeaderboardSortBy,
  order: LeaderboardOrder,
  minAccountValue: number | undefined,
  activityWindow: ActivityWindow,
): boolean {
  return (
    sortBy === DEFAULT_LEADERBOARD_SORT_BY &&
    order === DEFAULT_LEADERBOARD_ORDER &&
    minAccountValue === undefined &&
    activityWindow === "any"
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
  listArgs: ListArgs;
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
    (additionalRows.length > 0 ? nextCursor !== null : !firstPage.isDone);

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

  return (
    <LeaderboardTable
      rows={rows}
      pnlWindow={pnlWindow}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      canLoadMore={canLoadMore}
      isLoadingMore={loadingMore}
      onLoadMore={() => void handleLoadMore()}
    />
  );
}

export function LeaderboardListLive({
  preloadedLeaderboard,
}: LeaderboardListLiveProps) {
  const preloadedPage = usePreloadedQuery(preloadedLeaderboard);
  const convex = useConvex();

  const [pnlWindow, setPnlWindow] = useState<PnlWindow>(DEFAULT_PNL_WINDOW);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>(
    DEFAULT_LEADERBOARD_SORT_BY,
  );
  const [sortOrder, setSortOrder] = useState<LeaderboardOrder>(
    DEFAULT_LEADERBOARD_ORDER,
  );
  const [minAccountValueDraft, setMinAccountValueDraft] = useState("");
  const [minAccountValue, setMinAccountValue] = useState<number | undefined>();
  const [activityWindow, setActivityWindow] = useState<ActivityWindow>("any");
  const [queriedPage, setQueriedPage] = useState<PageResult | null>(null);
  const [querying, setQuerying] = useState(false);

  const listArgs = useMemo(
    () => buildListArgs(sortBy, sortOrder, minAccountValue, activityWindow),
    [activityWindow, minAccountValue, sortBy, sortOrder],
  );

  const usePreloaded = isDefaultArgs(
    sortBy,
    sortOrder,
    minAccountValue,
    activityWindow,
  );

  const firstPage = usePreloaded
    ? preloadedPage
    : (queriedPage ?? { page: [], continueCursor: null, isDone: true });

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
        minAccountValue ?? "",
        activityWindow,
        firstPage.page.map((row) => row.address).join(","),
      ].join("|"),
    [activityWindow, firstPage.page, minAccountValue, sortBy, sortOrder],
  );

  const refetch = useCallback(
    async (nextArgs: ListArgs) => {
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
      nextMin: number | undefined,
      nextActivity: ActivityWindow,
    ) => {
      setSortBy(nextSortBy);
      setSortOrder(nextOrder);
      setMinAccountValue(nextMin);
      setActivityWindow(nextActivity);
      if (isDefaultArgs(nextSortBy, nextOrder, nextMin, nextActivity)) {
        setQueriedPage(null);
        return;
      }
      void refetch(buildListArgs(nextSortBy, nextOrder, nextMin, nextActivity));
    },
    [refetch],
  );

  const handlePnlWindowChange = useCallback(
    (window: PnlWindow) => {
      setPnlWindow(window);
      applyView(PNL_WINDOW_TO_SORT[window], "desc", minAccountValue, activityWindow);
    },
    [activityWindow, applyView, minAccountValue],
  );

  const handleSort = useCallback(
    (key: LeaderboardSortBy) => {
      const nextOrder: LeaderboardOrder =
        sortBy === key && sortOrder === "desc" ? "asc" : "desc";
      if (key === "pnlDay") setPnlWindow("day");
      if (key === "pnlWeek") setPnlWindow("week");
      if (key === "pnlMonth") setPnlWindow("month");
      if (key === "pnlAllTime") setPnlWindow("allTime");
      applyView(key, nextOrder, minAccountValue, activityWindow);
    },
    [activityWindow, applyView, minAccountValue, sortBy, sortOrder],
  );

  const handleApplyMinAccountValue = useCallback(() => {
    applyView(
      sortBy,
      sortOrder,
      parseMinAccountValue(minAccountValueDraft),
      activityWindow,
    );
  }, [activityWindow, applyView, minAccountValueDraft, sortBy, sortOrder]);

  const handleActivityWindowChange = useCallback(
    (window: ActivityWindow) => {
      applyView(sortBy, sortOrder, minAccountValue, window);
    },
    [applyView, minAccountValue, sortBy, sortOrder],
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
        minAccountValueDraft={minAccountValueDraft}
        onMinAccountValueDraftChange={setMinAccountValueDraft}
        onApplyMinAccountValue={handleApplyMinAccountValue}
        activityWindow={activityWindow}
        onActivityWindowChange={handleActivityWindowChange}
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
