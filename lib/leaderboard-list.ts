export const LEADERBOARD_LIST_PAGE_SIZE = 20;

export type LeaderboardTailStatus =
  | "canLoadMore"
  | "loadingMore"
  | "exhausted";

export type LeaderboardSortBy =
  | "accountValue"
  | "pnlDay"
  | "pnlWeek"
  | "pnlMonth"
  | "pnlAllTime"
  | "vlmDay"
  | "vlmWeek"
  | "vlmMonth"
  | "vlmAllTime";

export type LeaderboardOrder = "asc" | "desc";

export type PnlWindow = "day" | "week" | "month" | "allTime";

export type VlmWindow = "day" | "week" | "month" | "allTime";

export type MinVolumeFilter = "any" | "positive" | "1m" | "10m" | "100m";

export type MinAccountValueFilter = "any" | "100k" | "1m" | "10m" | "100m";

export const DEFAULT_LEADERBOARD_SORT_BY: LeaderboardSortBy = "pnlDay";
export const DEFAULT_LEADERBOARD_ORDER: LeaderboardOrder = "desc";
export const DEFAULT_PNL_WINDOW: PnlWindow = "day";
export const DEFAULT_MIN_ACCOUNT_VALUE_FILTER: MinAccountValueFilter = "any";
export const DEFAULT_MIN_VOLUME_FILTER: MinVolumeFilter = "any";

export type LeaderboardView = {
  pnlWindow: PnlWindow;
  sortBy: LeaderboardSortBy;
  order: LeaderboardOrder;
  minAccountValueFilter: MinAccountValueFilter;
  minVolumeFilter: MinVolumeFilter;
};

export const DEFAULT_LEADERBOARD_VIEW: LeaderboardView = {
  pnlWindow: DEFAULT_PNL_WINDOW,
  sortBy: DEFAULT_LEADERBOARD_SORT_BY,
  order: DEFAULT_LEADERBOARD_ORDER,
  minAccountValueFilter: DEFAULT_MIN_ACCOUNT_VALUE_FILTER,
  minVolumeFilter: DEFAULT_MIN_VOLUME_FILTER,
};

const SORT_BY_VALUES = [
  "accountValue",
  "pnlDay",
  "pnlWeek",
  "pnlMonth",
  "pnlAllTime",
  "vlmDay",
  "vlmWeek",
  "vlmMonth",
  "vlmAllTime",
] as const satisfies readonly LeaderboardSortBy[];

const PNL_WINDOW_VALUES = [
  "day",
  "week",
  "month",
  "allTime",
] as const satisfies readonly PnlWindow[];

const ORDER_VALUES = ["asc", "desc"] as const satisfies readonly LeaderboardOrder[];

const MIN_ACCOUNT_VALUE_FILTER_VALUES = [
  "any",
  "100k",
  "1m",
  "10m",
  "100m",
] as const satisfies readonly MinAccountValueFilter[];

const MIN_VOLUME_FILTER_VALUES = [
  "any",
  "positive",
  "1m",
  "10m",
  "100m",
] as const satisfies readonly MinVolumeFilter[];

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseEnum<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
): T | undefined {
  if (raw === undefined) return undefined;
  return (allowed as readonly string[]).includes(raw)
    ? (raw as T)
    : undefined;
}

export const PNL_WINDOW_TO_SORT: Record<PnlWindow, LeaderboardSortBy> = {
  day: "pnlDay",
  week: "pnlWeek",
  month: "pnlMonth",
  allTime: "pnlAllTime",
};

export const VLM_WINDOW_TO_SORT: Record<VlmWindow, LeaderboardSortBy> = {
  day: "vlmDay",
  week: "vlmWeek",
  month: "vlmMonth",
  allTime: "vlmAllTime",
};

export const PNL_WINDOW_LABELS: Record<PnlWindow, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  allTime: "All",
};

export const LEADERBOARD_SORT_LABELS: Record<LeaderboardSortBy, string> = {
  accountValue: "Account value",
  pnlDay: "Day PnL",
  pnlWeek: "Week PnL",
  pnlMonth: "Month PnL",
  pnlAllTime: "All-time PnL",
  vlmDay: "Day Vol",
  vlmWeek: "Week Vol",
  vlmMonth: "Month Vol",
  vlmAllTime: "All-time Vol",
};

export const MIN_VOLUME_THRESHOLDS = {
  "1m": 1e6,
  "10m": 1e7,
  "100m": 1e8,
} as const satisfies Record<Exclude<MinVolumeFilter, "any" | "positive">, number>;

export const MIN_ACCOUNT_VALUE_THRESHOLDS = {
  "100k": 1e5,
  "1m": 1e6,
  "10m": 1e7,
  "100m": 1e8,
} as const satisfies Record<
  Exclude<MinAccountValueFilter, "any">,
  number
>;

export const MIN_ACCOUNT_VALUE_LABELS: Record<MinAccountValueFilter, string> = {
  any: "Any",
  "100k": "$100k",
  "1m": "$1M",
  "10m": "$10M",
  "100m": "$100M",
};

export type LeaderboardRow = {
  address: string;
  accountValue: number;
  pnlDay: number;
  pnlWeek: number;
  pnlMonth: number;
  pnlAllTime: number;
  vlmDay: number;
  vlmWeek: number;
  vlmMonth: number;
  vlmAllTime: number;
  displayName: string | null;
  fetchedAt: number;
};

export function pnlValueForWindow(
  row: LeaderboardRow,
  window: PnlWindow,
): number {
  switch (window) {
    case "day":
      return row.pnlDay;
    case "week":
      return row.pnlWeek;
    case "month":
      return row.pnlMonth;
    case "allTime":
      return row.pnlAllTime;
    default: {
      const _exhaustive: never = window;
      return _exhaustive;
    }
  }
}

export function vlmValueForWindow(
  row: LeaderboardRow,
  window: VlmWindow,
): number {
  switch (window) {
    case "day":
      return row.vlmDay;
    case "week":
      return row.vlmWeek;
    case "month":
      return row.vlmMonth;
    case "allTime":
      return row.vlmAllTime;
    default: {
      const _exhaustive: never = window;
      return _exhaustive;
    }
  }
}

export function minVolumeFilterArgs(
  filter: MinVolumeFilter,
): { minVolume?: number; requirePositiveVolume?: boolean } {
  switch (filter) {
    case "any":
      return {};
    case "positive":
      return { requirePositiveVolume: true };
    case "1m":
      return { minVolume: MIN_VOLUME_THRESHOLDS["1m"] };
    case "10m":
      return { minVolume: MIN_VOLUME_THRESHOLDS["10m"] };
    case "100m":
      return { minVolume: MIN_VOLUME_THRESHOLDS["100m"] };
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

export function minAccountValueFilterArgs(
  filter: MinAccountValueFilter,
): { minAccountValue?: number } {
  switch (filter) {
    case "any":
      return {};
    case "100k":
      return { minAccountValue: MIN_ACCOUNT_VALUE_THRESHOLDS["100k"] };
    case "1m":
      return { minAccountValue: MIN_ACCOUNT_VALUE_THRESHOLDS["1m"] };
    case "10m":
      return { minAccountValue: MIN_ACCOUNT_VALUE_THRESHOLDS["10m"] };
    case "100m":
      return { minAccountValue: MIN_ACCOUNT_VALUE_THRESHOLDS["100m"] };
    default: {
      const _exhaustive: never = filter;
      return _exhaustive;
    }
  }
}

export type LeaderboardListArgs = {
  sortBy: LeaderboardSortBy;
  order: LeaderboardOrder;
  minAccountValue?: number;
  minVolume?: number;
  requirePositiveVolume?: boolean;
  volumeWindow?: PnlWindow;
};

export function leaderboardListArgsFromView(
  view: LeaderboardView,
): LeaderboardListArgs {
  const accountValueArgs = minAccountValueFilterArgs(
    view.minAccountValueFilter,
  );
  const volumeArgs = minVolumeFilterArgs(view.minVolumeFilter);
  return {
    sortBy: view.sortBy,
    order: view.order,
    ...accountValueArgs,
    ...volumeArgs,
    ...(view.minVolumeFilter !== "any"
      ? { volumeWindow: view.pnlWindow }
      : {}),
  };
}

export function parseLeaderboardSearchParams(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams,
): LeaderboardView {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    return firstParam(searchParams[key]);
  };

  return {
    pnlWindow:
      parseEnum(get("window"), PNL_WINDOW_VALUES) ?? DEFAULT_PNL_WINDOW,
    sortBy:
      parseEnum(get("sort"), SORT_BY_VALUES) ?? DEFAULT_LEADERBOARD_SORT_BY,
    order:
      parseEnum(get("order"), ORDER_VALUES) ?? DEFAULT_LEADERBOARD_ORDER,
    minAccountValueFilter:
      parseEnum(get("minAv"), MIN_ACCOUNT_VALUE_FILTER_VALUES) ??
      DEFAULT_MIN_ACCOUNT_VALUE_FILTER,
    minVolumeFilter:
      parseEnum(get("minVol"), MIN_VOLUME_FILTER_VALUES) ??
      DEFAULT_MIN_VOLUME_FILTER,
  };
}

export function serializeLeaderboardSearchParams(
  view: LeaderboardView,
): URLSearchParams {
  const params = new URLSearchParams();
  if (view.pnlWindow !== DEFAULT_PNL_WINDOW) {
    params.set("window", view.pnlWindow);
  }
  if (view.sortBy !== DEFAULT_LEADERBOARD_SORT_BY) {
    params.set("sort", view.sortBy);
  }
  if (view.order !== DEFAULT_LEADERBOARD_ORDER) {
    params.set("order", view.order);
  }
  if (view.minAccountValueFilter !== DEFAULT_MIN_ACCOUNT_VALUE_FILTER) {
    params.set("minAv", view.minAccountValueFilter);
  }
  if (view.minVolumeFilter !== DEFAULT_MIN_VOLUME_FILTER) {
    params.set("minVol", view.minVolumeFilter);
  }
  return params;
}

export function leaderboardHref(view: LeaderboardView): string {
  const params = serializeLeaderboardSearchParams(view);
  const query = params.toString();
  return query.length > 0 ? `/leaderboard?${query}` : "/leaderboard";
}
