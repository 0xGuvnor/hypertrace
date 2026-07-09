export const LEADERBOARD_LIST_PAGE_SIZE = 20;

export type LeaderboardSortBy =
  | "accountValue"
  | "pnlDay"
  | "pnlWeek"
  | "pnlMonth"
  | "pnlAllTime"
  | "lastActivityTimestamp";

export type LeaderboardOrder = "asc" | "desc";

export type PnlWindow = "day" | "week" | "month" | "allTime";

export type ActivityWindow = "any" | "24h" | "7d" | "30d";

export const DEFAULT_LEADERBOARD_SORT_BY: LeaderboardSortBy = "pnlDay";
export const DEFAULT_LEADERBOARD_ORDER: LeaderboardOrder = "desc";
export const DEFAULT_PNL_WINDOW: PnlWindow = "day";

export const PNL_WINDOW_TO_SORT: Record<PnlWindow, LeaderboardSortBy> = {
  day: "pnlDay",
  week: "pnlWeek",
  month: "pnlMonth",
  allTime: "pnlAllTime",
};

export const PNL_WINDOW_LABELS: Record<PnlWindow, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  allTime: "All",
};

export const ACTIVITY_WINDOW_MS: Record<
  Exclude<ActivityWindow, "any">,
  number
> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export type LeaderboardRow = {
  address: string;
  accountValue: number;
  pnlDay: number;
  pnlWeek: number;
  pnlMonth: number;
  pnlAllTime: number;
  lastActivityTimestamp: number | null;
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

export function activeSinceFromWindow(
  window: ActivityWindow,
  now: number,
): number | undefined {
  if (window === "any") return undefined;
  return now - ACTIVITY_WINDOW_MS[window];
}
