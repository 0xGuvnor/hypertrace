import { v, type Infer } from "convex/values";

export const accountSummaryValidator = v.object({
  accountValue: v.string(),
  spotValue: v.optional(v.string()),
  totalMarginUsed: v.string(),
  withdrawable: v.string(),
});

export const marginModeValidator = v.union(
  v.literal("cross"),
  v.literal("isolated"),
);

export const positionValidator = v.object({
  coin: v.string(),
  side: v.union(v.literal("long"), v.literal("short")),
  size: v.string(),
  entryPrice: v.string(),
  markPrice: v.union(v.string(), v.null()),
  unrealizedPnl: v.string(),
  liquidationPrice: v.union(v.string(), v.null()),
  leverage: v.number(),
  marginMode: marginModeValidator,
  marginUsed: v.string(),
  value: v.string(),
  fundingFee: v.string(),
  takeProfitPrice: v.union(v.string(), v.null()),
  stopLossPrice: v.union(v.string(), v.null()),
  /** Unix ms when the current continuous position opened; null if outside fill window. */
  openedAt: v.optional(v.union(v.number(), v.null())),
});

export const openOrderValidator = v.object({
  coin: v.string(),
  side: v.union(v.literal("buy"), v.literal("sell")),
  orderType: v.string(),
  size: v.string(),
  limitPrice: v.string(),
  triggerPrice: v.union(v.string(), v.null()),
  triggerCondition: v.string(),
  isTrigger: v.boolean(),
  isPositionTpsl: v.boolean(),
  reduceOnly: v.boolean(),
  timestamp: v.number(),
  orderId: v.number(),
});

export const fillValidator = v.object({
  coin: v.string(),
  side: v.union(v.literal("buy"), v.literal("sell")),
  size: v.string(),
  price: v.string(),
  timestamp: v.number(),
  hash: v.optional(v.string()),
  isLiquidation: v.optional(v.literal(true)),
});

export const spotBalanceValidator = v.object({
  coin: v.string(),
  size: v.string(),
  hold: v.string(),
  markPrice: v.union(v.string(), v.null()),
  value: v.string(),
});

export const walletSnapshotValidator = v.object({
  address: v.string(),
  fetchedAt: v.number(),
  account: accountSummaryValidator,
  positions: v.array(positionValidator),
  openOrders: v.array(openOrderValidator),
  recentFills: v.array(fillValidator),
  spotBalances: v.optional(v.array(spotBalanceValidator)),
});

export const liveWalletSnapshotValidator = v.object({
  ...walletSnapshotValidator.fields,
  updatedAt: v.number(),
});

export type WalletSnapshot = Infer<typeof walletSnapshotValidator>;
export type LiveWalletSnapshot = Infer<typeof liveWalletSnapshotValidator>;
