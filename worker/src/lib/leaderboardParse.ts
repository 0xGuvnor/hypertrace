import { isValidAddress, normalizeAddress } from "./address";

export type LeaderboardUpsertRow = {
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
};

type WindowKey = "day" | "week" | "month" | "allTime";

const WINDOW_TO_PNL = {
  day: "pnlDay",
  week: "pnlWeek",
  month: "pnlMonth",
  allTime: "pnlAllTime",
} as const satisfies Record<WindowKey, keyof LeaderboardUpsertRow>;

const WINDOW_TO_VLM = {
  day: "vlmDay",
  week: "vlmWeek",
  month: "vlmMonth",
  allTime: "vlmAllTime",
} as const satisfies Record<WindowKey, keyof LeaderboardUpsertRow>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

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
  return (
    value === "day" ||
    value === "week" ||
    value === "month" ||
    value === "allTime"
  );
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
): Pick<
  LeaderboardUpsertRow,
  | "pnlDay"
  | "pnlWeek"
  | "pnlMonth"
  | "pnlAllTime"
  | "vlmDay"
  | "vlmWeek"
  | "vlmMonth"
  | "vlmAllTime"
> | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const fields: Partial<
    Record<
      | "pnlDay"
      | "pnlWeek"
      | "pnlMonth"
      | "pnlAllTime"
      | "vlmDay"
      | "vlmWeek"
      | "vlmMonth"
      | "vlmAllTime",
      number
    >
  > = {};

  for (const entry of value) {
    if (!Array.isArray(entry) || entry.length < 2) {
      continue;
    }
    const [window, perf] = entry;
    if (!isWindowKey(window) || !isRecord(perf)) {
      continue;
    }
    const pnl = parseFiniteNumber(perf.pnl);
    const vlm = parseFiniteNumber(perf.vlm);
    if (pnl === null || vlm === null) {
      continue;
    }
    fields[WINDOW_TO_PNL[window]] = pnl;
    fields[WINDOW_TO_VLM[window]] = vlm;
  }

  if (
    fields.pnlDay === undefined ||
    fields.pnlWeek === undefined ||
    fields.pnlMonth === undefined ||
    fields.pnlAllTime === undefined ||
    fields.vlmDay === undefined ||
    fields.vlmWeek === undefined ||
    fields.vlmMonth === undefined ||
    fields.vlmAllTime === undefined
  ) {
    return null;
  }

  return {
    pnlDay: fields.pnlDay,
    pnlWeek: fields.pnlWeek,
    pnlMonth: fields.pnlMonth,
    pnlAllTime: fields.pnlAllTime,
    vlmDay: fields.vlmDay,
    vlmWeek: fields.vlmWeek,
    vlmMonth: fields.vlmMonth,
    vlmAllTime: fields.vlmAllTime,
  };
}

function parseLeaderboardRow(raw: unknown): LeaderboardUpsertRow | null {
  if (!isRecord(raw)) {
    return null;
  }

  const ethAddress =
    typeof raw.ethAddress === "string"
      ? raw.ethAddress
      : typeof raw.eth_address === "string"
        ? raw.eth_address
        : null;

  if (ethAddress === null) {
    return null;
  }

  const address = normalizeAddress(ethAddress.trim());
  if (!isValidAddress(address)) {
    return null;
  }

  const accountValue = parseFiniteNumber(raw.accountValue ?? raw.account_value);
  if (accountValue === null) {
    return null;
  }

  const windows = parseWindowPerformances(
    raw.windowPerformances ?? raw.window_performances,
  );
  if (windows === null) {
    return null;
  }

  return {
    address,
    accountValue,
    ...windows,
    displayName: parseDisplayName(raw.displayName ?? raw.display_name),
  };
}

export type ParseLeaderboardResult = {
  rows: LeaderboardUpsertRow[];
  skipped: number;
};

export function parseLeaderboardResponse(data: unknown): ParseLeaderboardResult {
  if (!isRecord(data)) {
    return { rows: [], skipped: 0 };
  }

  const list = data.leaderboardRows ?? data.leaderboard_rows;
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
    byAddress.set(parsed.address, parsed);
  }

  return { rows: [...byAddress.values()], skipped };
}
