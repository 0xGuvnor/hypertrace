import { v, type Infer } from "convex/values";

export const walletSnapshotValidator = v.object({
  address: v.string(),
  fetchedAt: v.number(),
  account: v.object({
    accountValue: v.string(),
    totalMarginUsed: v.string(),
    withdrawable: v.string(),
  }),
  positions: v.array(
    v.object({
      coin: v.string(),
      side: v.union(v.literal("long"), v.literal("short")),
      size: v.string(),
      entryPrice: v.string(),
      unrealizedPnl: v.string(),
      liquidationPrice: v.union(v.string(), v.null()),
      leverage: v.number(),
      marginUsed: v.string(),
    }),
  ),
  recentFills: v.array(
    v.object({
      coin: v.string(),
      side: v.union(v.literal("buy"), v.literal("sell")),
      size: v.string(),
      price: v.string(),
      timestamp: v.number(),
      hash: v.optional(v.string()),
    }),
  ),
});

export type WalletSnapshot = Infer<typeof walletSnapshotValidator>;
