import type { Infer } from "convex/values";

import {
  depositCursorValidator,
  depositRowValidator,
  depositSourceUpdateValidator,
} from "./depositTypes";

type DepositRow = Infer<typeof depositRowValidator>;
type DepositCursor = Infer<typeof depositCursorValidator>;
type DepositSourceUpdate = Infer<typeof depositSourceUpdateValidator>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
  return {
    hlAddress: value.hlAddress,
    sourceAddress: value.sourceAddress,
    amount: value.amount,
    timestamp: value.timestamp,
    arbTxHash: value.arbTxHash,
    logIndex: value.logIndex,
    depositKey: value.depositKey,
    blockNumber: value.blockNumber,
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
  return {
    depositKey: value.depositKey,
    sourceAddress: value.sourceAddress,
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
