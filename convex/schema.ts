import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import {
  accountSummaryValidator,
  fillValidator,
  openOrderValidator,
  positionValidator,
} from "./lib/hyperliquidTypes";

export default defineSchema({
  watchedAddresses: defineTable({
    address: v.string(),
    lastRequestedAt: v.number(),
  }).index("by_address", ["address"]),

  walletSnapshots: defineTable({
    address: v.string(),
    fetchedAt: v.number(),
    account: accountSummaryValidator,
    positions: v.array(positionValidator),
    openOrders: v.array(openOrderValidator),
    recentFills: v.array(fillValidator),
    updatedAt: v.number(),
  }).index("by_address", ["address"]),
});
