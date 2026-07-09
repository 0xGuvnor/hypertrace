import { isValidAddress, normalizeAddress } from "./address";

export type LeaderboardUpsertRow = {
  address: string;
  accountValue: number;
  pnlDay: number;
  pnlWeek: number;
  pnlMonth: number;
  pnlAllTime: number;
  lastActivityTimestamp: number | null;
  displayName: string | null;
};

const WINDOW_KEYS = ["day", "week", "month", "allTime"] as const;

type WindowKey = (typeof WINDOW_KEYS)[number];

const WINDOW_TO_FIELD = {
  day: "pnlDay",
  week: "pnlWeek",
  month: "pnlMonth",
  allTime: "pnlAllTime",
} as const satisfies Record<WindowKey, keyof LeaderboardUpsertRow>;

function parseFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function isWindowKey(value: unknown): value is WindowKey {
  return typeof value === "string" && (WINDOW_KEYS as readonly string[]).includes(value);
}

function parseDisplayName(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function parseWindowPerformances(
  value: unknown,
): Pick<LeaderboardUpsertRow, "pnlDay" | "pnlWeek" | "pnlMonth" | "pnlAllTime"> | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const pnls: Partial<
    Record<"pnlDay" | "pnlWeek" | "pnlMonth" | "pnlAllTime", number>
  > = {};

  for (const entry of value) {
    if (!Array.isArray(entry) || entry.length < 2) {
      continue;
    }
    const [window, perf] = entry;
    if (!isWindowKey(window) || typeof perf !== "object" || perf === null) {
      continue;
    }
    const pnl = parseFiniteNumber((perf as { pnl?: unknown }).pnl);
    if (pnl === null) {
      continue;
    }
    pnls[WINDOW_TO_FIELD[window]] = pnl;
  }

  if (
    pnls.pnlDay === undefined ||
    pnls.pnlWeek === undefined ||
    pnls.pnlMonth === undefined ||
    pnls.pnlAllTime === undefined
  ) {
    return null;
  }

  return {
    pnlDay: pnls.pnlDay,
    pnlWeek: pnls.pnlWeek,
    pnlMonth: pnls.pnlMonth,
    pnlAllTime: pnls.pnlAllTime,
  };
}

function parseLeaderboardRow(raw: unknown): LeaderboardUpsertRow | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const row = raw as Record<string, unknown>;
  const ethAddress =
    typeof row.ethAddress === "string"
      ? row.ethAddress
      : typeof row.eth_address === "string"
        ? row.eth_address
        : null;

  if (ethAddress === null) {
    return null;
  }

  const address = normalizeAddress(ethAddress.trim());
  if (!isValidAddress(address)) {
    return null;
  }

  const accountValue = parseFiniteNumber(row.accountValue ?? row.account_value);
  if (accountValue === null) {
    return null;
  }

  const windows = parseWindowPerformances(
    row.windowPerformances ?? row.window_performances,
  );
  if (windows === null) {
    return null;
  }

  return {
    address,
    accountValue,
    ...windows,
    lastActivityTimestamp: null,
    displayName: parseDisplayName(row.displayName ?? row.display_name),
  };
}

export type ParseLeaderboardResult = {
  rows: LeaderboardUpsertRow[];
  skipped: number;
};

/**
 * Defensively parse the undocumented stats-data leaderboard payload.
 * Accepts camelCase (live API) and snake_case (some community SDKs).
 */
export function parseLeaderboardResponse(data: unknown): ParseLeaderboardResult {
  if (typeof data !== "object" || data === null) {
    return { rows: [], skipped: 0 };
  }

  const root = data as Record<string, unknown>;
  const list = root.leaderboardRows ?? root.leaderboard_rows;
  if (!Array.isArray(list)) {
    return { rows: [], skipped: 0 };
  }

  const byAddress = new Map<string, LeaderboardUpsertRow>();
  let skipped = 0;

  for (const item of list) {
    const parsed = parseLeaderboardRow(item);
    if (parsed === null) {
      skipped += 1;
      continue;
    }
    // Last occurrence wins if the API duplicates an address.
    byAddress.set(parsed.address, parsed);
  }

  return { rows: [...byAddress.values()], skipped };
}
