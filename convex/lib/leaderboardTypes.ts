import { v } from "convex/values";

export const leaderboardSnapshotRecordValidator = v.object({
  address: v.string(),
  accountValue: v.number(),
  pnlDay: v.number(),
  pnlWeek: v.number(),
  pnlMonth: v.number(),
  pnlAllTime: v.number(),
  lastActivityTimestamp: v.union(v.number(), v.null()),
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
  lastActivityTimestamp: v.union(v.number(), v.null()),
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
  v.literal("lastActivityTimestamp"),
);

export const leaderboardOrderValidator = v.union(
  v.literal("asc"),
  v.literal("desc"),
);

export const leaderboardListRowValidator = leaderboardSnapshotRecordValidator;

export const leaderboardListResultValidator = v.object({
  page: v.array(leaderboardListRowValidator),
  continueCursor: v.union(v.string(), v.null()),
  isDone: v.boolean(),
});
