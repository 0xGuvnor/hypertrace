export const LEADERBOARD_LIST_PAGE_SIZE = 20;

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

export const DEFAULT_LEADERBOARD_SORT_BY: LeaderboardSortBy = "pnlDay";
export const DEFAULT_LEADERBOARD_ORDER: LeaderboardOrder = "desc";
export const DEFAULT_PNL_WINDOW: PnlWindow = "day";

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

export const MIN_VOLUME_THRESHOLDS = {
  "1m": 1e6,
  "10m": 1e7,
  "100m": 1e8,
} as const satisfies Record<Exclude<MinVolumeFilter, "any" | "positive">, number>;

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
