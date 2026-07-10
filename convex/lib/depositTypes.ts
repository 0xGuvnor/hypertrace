import { v } from "convex/values";

export const transferDirectionValidator = v.union(
  v.literal("deposit"),
  v.literal("withdrawal"),
);

export type TransferDirection = "deposit" | "withdrawal";

const depositFields = {
  hlAddress: v.string(),
  sourceAddress: v.string(),
  amount: v.number(),
  timestamp: v.number(),
  arbTxHash: v.string(),
  logIndex: v.number(),
  depositKey: v.string(),
};

/** Stored docs may omit direction (legacy deposits). */
export const depositRecordValidator = v.object({
  ...depositFields,
  direction: v.optional(transferDirectionValidator),
  blockNumber: v.optional(v.number()),
});

export const depositRowValidator = v.object({
  ...depositFields,
  direction: transferDirectionValidator,
  blockNumber: v.number(),
});

export const depositCursorValidator = v.object({
  hlAddress: v.string(),
  lastScannedBlock: v.number(),
});

export const depositSourceUpdateValidator = v.object({
  depositKey: v.string(),
  sourceAddress: v.string(),
});

/** Public list/API rows always include direction. */
export const depositValidator = v.object({
  ...depositFields,
  direction: transferDirectionValidator,
  blockNumber: v.optional(v.number()),
});

export const walletDepositsResultValidator = v.object({
  deposits: v.array(depositValidator),
  hasMore: v.boolean(),
});

export function resolveTransferDirection(
  direction: TransferDirection | undefined,
): TransferDirection {
  return direction ?? "deposit";
}

export function isDepositForClustering(
  direction: TransferDirection | undefined,
): boolean {
  return resolveTransferDirection(direction) === "deposit";
}
