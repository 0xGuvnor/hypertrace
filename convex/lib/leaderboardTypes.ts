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

/** Row fields written by upsert (fetchedAt is supplied separately). */
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
