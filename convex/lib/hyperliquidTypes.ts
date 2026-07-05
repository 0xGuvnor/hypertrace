import { v, type Infer } from "convex/values";

export const accountSummaryValidator = v.object({
  accountValue: v.string(),
  totalMarginUsed: v.string(),
  withdrawable: v.string(),
});

export const positionValidator = v.object({
  coin: v.string(),
  side: v.union(v.literal("long"), v.literal("short")),
  size: v.string(),
  entryPrice: v.string(),
  unrealizedPnl: v.string(),
  liquidationPrice: v.union(v.string(), v.null()),
  leverage: v.number(),
  marginUsed: v.string(),
  value: v.string(),
  fundingFee: v.string(),
  takeProfitPrice: v.union(v.string(), v.null()),
  stopLossPrice: v.union(v.string(), v.null()),
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
});

export const walletSnapshotValidator = v.object({
  address: v.string(),
  fetchedAt: v.number(),
  account: accountSummaryValidator,
  positions: v.array(positionValidator),
  openOrders: v.array(openOrderValidator),
  recentFills: v.array(fillValidator),
});

export type WalletSnapshot = Infer<typeof walletSnapshotValidator>;
