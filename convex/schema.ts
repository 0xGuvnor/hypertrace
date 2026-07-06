import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { clusterRecordValidator } from "./lib/clusterTypes";
import { depositRecordValidator } from "./lib/depositTypes";
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

  deposits: defineTable(depositRecordValidator)
    .index("by_depositKey", ["depositKey"])
    .index("by_hlAddress", ["hlAddress"])
    .index("by_hlAddress_timestamp", ["hlAddress", "timestamp"])
    .index("by_sourceAddress", ["sourceAddress"]),

  depositScanCursors: defineTable({
    hlAddress: v.string(),
    lastScannedBlock: v.number(),
    updatedAt: v.number(),
  }).index("by_hlAddress", ["hlAddress"]),

  wallets: defineTable({
    address: v.string(),
    firstSeen: v.number(),
    tags: v.array(v.string()),
    clusterId: v.union(v.string(), v.null()),
  }).index("by_address", ["address"]),

  clusters: defineTable(clusterRecordValidator)
    .index("by_clusterKey", ["clusterKey"])
    .index("by_memberCount", ["memberCount", "clusterKey"]),
});
