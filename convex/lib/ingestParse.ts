import type { Infer } from "convex/values";

import { isValidAddress, normalizeAddress } from "./address";
import {
  depositCursorValidator,
  depositRowValidator,
  depositSourceUpdateValidator,
} from "./depositTypes";
import type { LeaderboardUpsertRow } from "./leaderboardParse";
import { leaderboardUpsertRowValidator } from "./leaderboardTypes";

type DepositRow = Infer<typeof depositRowValidator>;
type DepositCursor = Infer<typeof depositCursorValidator>;
type DepositSourceUpdate = Infer<typeof depositSourceUpdateValidator>;
type LeaderboardRow = Infer<typeof leaderboardUpsertRowValidator>;
type DepositFunder = NonNullable<DepositRow["funders"]>[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFunders(value: unknown): DepositFunder[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  const funders: DepositFunder[] = [];
  for (const row of value) {
    if (!isRecord(row)) {
      return undefined;
    }
    if (
      typeof row.address !== "string" ||
      typeof row.amount !== "number" ||
      typeof row.weight !== "number" ||
      !Number.isFinite(row.amount) ||
      !Number.isFinite(row.weight)
    ) {
      return undefined;
    }
    funders.push({
      address: row.address,
      amount: row.amount,
      weight: row.weight,
    });
  }
  return funders;
}

function parseDepositRow(value: unknown): DepositRow | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.hlAddress !== "string" ||
    typeof value.sourceAddress !== "string" ||
    typeof value.amount !== "number" ||
    typeof value.timestamp !== "number" ||
    typeof value.arbTxHash !== "string" ||
    typeof value.logIndex !== "number" ||
    typeof value.depositKey !== "string" ||
    typeof value.blockNumber !== "number"
  ) {
    return null;
  }
  const direction =
    value.direction === "withdrawal"
      ? "withdrawal"
      : value.direction === "deposit" || value.direction === undefined
        ? "deposit"
        : null;
  if (direction === null) {
    return null;
  }
  const funders = parseFunders(value.funders);
  if (value.funders !== undefined && funders === undefined) {
    return null;
  }
  return {
    hlAddress: value.hlAddress,
    sourceAddress: value.sourceAddress,
    amount: value.amount,
    timestamp: value.timestamp,
    arbTxHash: value.arbTxHash,
    logIndex: value.logIndex,
    depositKey: value.depositKey,
    blockNumber: value.blockNumber,
    direction,
    ...(funders !== undefined ? { funders } : {}),
  };
}

function parseDepositCursor(value: unknown): DepositCursor | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.hlAddress !== "string" ||
    typeof value.lastScannedBlock !== "number"
  ) {
    return null;
  }
  return {
    hlAddress: value.hlAddress,
    lastScannedBlock: value.lastScannedBlock,
  };
}

function parseDepositSourceUpdate(value: unknown): DepositSourceUpdate | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.depositKey !== "string" ||
    typeof value.sourceAddress !== "string"
  ) {
    return null;
  }
  const funders = parseFunders(value.funders);
  if (value.funders !== undefined && funders === undefined) {
    return null;
  }
  return {
    depositKey: value.depositKey,
    sourceAddress: value.sourceAddress,
    ...(funders !== undefined ? { funders } : {}),
  };
}

export function parseIngestDepositsBody(
  body: unknown,
): { deposits: DepositRow[]; cursors: DepositCursor[] } | null {
  if (!isRecord(body)) return null;
  if (!Array.isArray(body.deposits) || !Array.isArray(body.cursors)) {
    return null;
  }

  const deposits: DepositRow[] = [];
  for (const row of body.deposits) {
    const parsed = parseDepositRow(row);
    if (!parsed) return null;
    deposits.push(parsed);
  }

  const cursors: DepositCursor[] = [];
  for (const row of body.cursors) {
    const parsed = parseDepositCursor(row);
    if (!parsed) return null;
    cursors.push(parsed);
  }

  return { deposits, cursors };
}

export function parseIngestCursorsBody(
  body: unknown,
): { cursors: DepositCursor[] } | null {
  if (!isRecord(body) || !Array.isArray(body.cursors)) return null;

  const cursors: DepositCursor[] = [];
  for (const row of body.cursors) {
    const parsed = parseDepositCursor(row);
    if (!parsed) return null;
    cursors.push(parsed);
  }

  return { cursors };
}

export function parseIngestDepositSourcesBody(
  body: unknown,
): { updates: DepositSourceUpdate[] } | null {
  if (!isRecord(body) || !Array.isArray(body.updates)) return null;

  const updates: DepositSourceUpdate[] = [];
  for (const row of body.updates) {
    const parsed = parseDepositSourceUpdate(row);
    if (!parsed) return null;
    updates.push(parsed);
  }

  return { updates };
}

function parseLeaderboardUpsertRow(value: unknown): LeaderboardRow | null {
  if (!isRecord(value)) return null;
  if (
    typeof value.address !== "string" ||
    typeof value.accountValue !== "number" ||
    typeof value.pnlDay !== "number" ||
    typeof value.pnlWeek !== "number" ||
    typeof value.pnlMonth !== "number" ||
    typeof value.pnlAllTime !== "number" ||
    typeof value.vlmDay !== "number" ||
    typeof value.vlmWeek !== "number" ||
    typeof value.vlmMonth !== "number" ||
    typeof value.vlmAllTime !== "number" ||
    !(typeof value.displayName === "string" || value.displayName === null)
  ) {
    return null;
  }
  if (
    !Number.isFinite(value.accountValue) ||
    !Number.isFinite(value.pnlDay) ||
    !Number.isFinite(value.pnlWeek) ||
    !Number.isFinite(value.pnlMonth) ||
    !Number.isFinite(value.pnlAllTime) ||
    !Number.isFinite(value.vlmDay) ||
    !Number.isFinite(value.vlmWeek) ||
    !Number.isFinite(value.vlmMonth) ||
    !Number.isFinite(value.vlmAllTime)
  ) {
    return null;
  }
  const address = normalizeAddress(value.address.trim());
  if (!isValidAddress(address)) {
    return null;
  }
  return {
    address,
    accountValue: value.accountValue,
    pnlDay: value.pnlDay,
    pnlWeek: value.pnlWeek,
    pnlMonth: value.pnlMonth,
    pnlAllTime: value.pnlAllTime,
    vlmDay: value.vlmDay,
    vlmWeek: value.vlmWeek,
    vlmMonth: value.vlmMonth,
    vlmAllTime: value.vlmAllTime,
    displayName: value.displayName,
  };
}

export function parseIngestLeaderboardBody(
  body: unknown,
): {
  rows: LeaderboardUpsertRow[];
  fetchedAt: number;
  prune: boolean;
} | null {
  if (!isRecord(body)) return null;
  if (!Array.isArray(body.rows) || typeof body.fetchedAt !== "number") {
    return null;
  }
  if (!Number.isFinite(body.fetchedAt)) {
    return null;
  }

  const rows: LeaderboardUpsertRow[] = [];
  for (const row of body.rows) {
    const parsed = parseLeaderboardUpsertRow(row);
    if (!parsed) return null;
    rows.push(parsed);
  }

  return {
    rows,
    fetchedAt: body.fetchedAt,
    prune: body.prune === true,
  };
}
