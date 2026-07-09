import { v } from "convex/values";

export const leaderboardSnapshotRecordValidator = v.object({
  address: v.string(),
  accountValue: v.number(),
  pnlDay: v.number(),
  pnlWeek: v.number(),
  pnlMonth: v.number(),
  pnlAllTime: v.number(),
  // Optional until prod rows are backfilled / rewritten by ingest.
  vlmDay: v.optional(v.number()),
  vlmWeek: v.optional(v.number()),
  vlmMonth: v.optional(v.number()),
  vlmAllTime: v.optional(v.number()),
  // Legacy field still present on pre-volume snapshots; strip on upsert/backfill.
  lastActivityTimestamp: v.optional(v.union(v.number(), v.null())),
  displayName: v.union(v.string(), v.null()),
  fetchedAt: v.number(),
});

export const leaderboardListRowValidator = v.object({
  address: v.string(),
  accountValue: v.number(),
  pnlDay: v.number(),
  pnlWeek: v.number(),
  pnlMonth: v.number(),
  pnlAllTime: v.number(),
  vlmDay: v.number(),
  vlmWeek: v.number(),
  vlmMonth: v.number(),
  vlmAllTime: v.number(),
  displayName: v.union(v.string(), v.null()),
  fetchedAt: v.number(),
});

export const leaderboardUpsertRowValidator = v.object({
  address: v.string(),
  accountValue: v.number(),
  pnlDay: v.number(),
  pnlWeek: v.number(),
  pnlMonth: v.number(),
  pnlAllTime: v.number(),
  vlmDay: v.number(),
  vlmWeek: v.number(),
  vlmMonth: v.number(),
  vlmAllTime: v.number(),
  displayName: v.union(v.string(), v.null()),
});

export const upsertBatchResultValidator = v.object({
  upserted: v.number(),
  walletsCreated: v.number(),
});

export const pruneStaleResultValidator = v.object({
  pruned: v.number(),
  continued: v.boolean(),
});

export const ingestLeaderboardBatchResultValidator = v.object({
  upserted: v.number(),
  walletsCreated: v.number(),
  pruned: v.number(),
  continued: v.boolean(),
});

export const leaderboardSortByValidator = v.union(
  v.literal("accountValue"),
  v.literal("pnlDay"),
  v.literal("pnlWeek"),
  v.literal("pnlMonth"),
  v.literal("pnlAllTime"),
  v.literal("vlmDay"),
  v.literal("vlmWeek"),
  v.literal("vlmMonth"),
  v.literal("vlmAllTime"),
);

export const leaderboardOrderValidator = v.union(
  v.literal("asc"),
  v.literal("desc"),
);

export const leaderboardVolumeWindowValidator = v.union(
  v.literal("day"),
  v.literal("week"),
  v.literal("month"),
  v.literal("allTime"),
);

export const leaderboardListResultValidator = v.object({
  page: v.array(leaderboardListRowValidator),
  continueCursor: v.union(v.string(), v.null()),
  isDone: v.boolean(),
});
