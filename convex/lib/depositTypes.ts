import { v } from "convex/values";

const depositFields = {
  hlAddress: v.string(),
  sourceAddress: v.string(),
  amount: v.number(),
  timestamp: v.number(),
  arbTxHash: v.string(),
  logIndex: v.number(),
  depositKey: v.string(),
};

export const depositRecordValidator = v.object({
  ...depositFields,
  blockNumber: v.optional(v.number()),
});

export const depositRowValidator = v.object({
  ...depositFields,
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

export const depositValidator = depositRecordValidator;

export const walletDepositsResultValidator = v.object({
  deposits: v.array(depositValidator),
  hasMore: v.boolean(),
});
