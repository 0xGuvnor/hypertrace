import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import {
  internalMutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import type { LeaderboardUpsertRow } from "./lib/leaderboardParse";
import {
  ingestLeaderboardBatchResultValidator,
  leaderboardListResultValidator,
  leaderboardOrderValidator,
  leaderboardSortByValidator,
  leaderboardUpsertRowValidator,
  leaderboardVolumeWindowValidator,
  pruneStaleResultValidator,
  upsertBatchResultValidator,
} from "./lib/leaderboardTypes";

const PRUNE_BATCH_SIZE = 200;

async function upsertLeaderboardRows(
  ctx: MutationCtx,
  rows: LeaderboardUpsertRow[],
  fetchedAt: number,
): Promise<{ upserted: number; walletsCreated: number }> {
  let upserted = 0;
  let walletsCreated = 0;

  for (const row of rows) {
    const address = normalizeAddress(row.address);
    if (!isValidAddress(address)) {
      continue;
    }

    const existing = await ctx.db
      .query("leaderboardSnapshots")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    const fields = {
      address,
      accountValue: row.accountValue,
      pnlDay: row.pnlDay,
      pnlWeek: row.pnlWeek,
      pnlMonth: row.pnlMonth,
      pnlAllTime: row.pnlAllTime,
      vlmDay: row.vlmDay,
      vlmWeek: row.vlmWeek,
      vlmMonth: row.vlmMonth,
      vlmAllTime: row.vlmAllTime,
      displayName: row.displayName,
      fetchedAt,
    };

    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("leaderboardSnapshots", fields);
    }
    upserted += 1;

    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    if (!wallet) {
      await ctx.db.insert("wallets", {
        address,
        firstSeen: fetchedAt,
        tags: [],
        clusterId: null,
      });
      walletsCreated += 1;
    }
  }

  return { upserted, walletsCreated };
}

async function pruneStaleSnapshots(
  ctx: MutationCtx,
  fetchedAt: number,
): Promise<{ pruned: number; continued: boolean }> {
  const stale = await ctx.db
    .query("leaderboardSnapshots")
    .withIndex("by_fetchedAt", (q) => q.lt("fetchedAt", fetchedAt))
    .take(PRUNE_BATCH_SIZE);

  for (const doc of stale) {
    await ctx.db.delete(doc._id);
  }

  const continued = stale.length === PRUNE_BATCH_SIZE;
  if (continued) {
    await ctx.scheduler.runAfter(0, internal.leaderboard.pruneStale, {
      fetchedAt,
    });
  }

  return { pruned: stale.length, continued };
}

export const upsertBatch = internalMutation({
  args: {
    rows: v.array(leaderboardUpsertRowValidator),
    fetchedAt: v.number(),
  },
  returns: upsertBatchResultValidator,
  handler: async (ctx, args) => {
    return await upsertLeaderboardRows(ctx, args.rows, args.fetchedAt);
  },
});

export const pruneStale = internalMutation({
  args: {
    fetchedAt: v.number(),
  },
  returns: pruneStaleResultValidator,
  handler: async (ctx, args) => {
    return await pruneStaleSnapshots(ctx, args.fetchedAt);
  },
});

export const ingestBatch = internalMutation({
  args: {
    rows: v.array(leaderboardUpsertRowValidator),
    fetchedAt: v.number(),
    prune: v.boolean(),
  },
  returns: ingestLeaderboardBatchResultValidator,
  handler: async (ctx, args) => {
    const upsert = await upsertLeaderboardRows(ctx, args.rows, args.fetchedAt);

    if (!args.prune) {
      return {
        upserted: upsert.upserted,
        walletsCreated: upsert.walletsCreated,
        pruned: 0,
        continued: false,
      };
    }

    const prune = await pruneStaleSnapshots(ctx, args.fetchedAt);

    return {
      upserted: upsert.upserted,
      walletsCreated: upsert.walletsCreated,
      pruned: prune.pruned,
      continued: prune.continued,
    };
  },
});

type LeaderboardSortBy =
  | "accountValue"
  | "pnlDay"
  | "pnlWeek"
  | "pnlMonth"
  | "pnlAllTime"
  | "vlmDay"
  | "vlmWeek"
  | "vlmMonth"
  | "vlmAllTime";

type VolumeWindow = "day" | "week" | "month" | "allTime";

function toListRow(row: {
  address: string;
  accountValue: number;
  pnlDay: number;
  pnlWeek: number;
  pnlMonth: number;
  pnlAllTime: number;
  vlmDay: number;
  vlmWeek: number;
  vlmMonth: number;
  vlmAllTime: number;
  displayName: string | null;
  fetchedAt: number;
}) {
  return {
    address: row.address,
    accountValue: row.accountValue,
    pnlDay: row.pnlDay,
    pnlWeek: row.pnlWeek,
    pnlMonth: row.pnlMonth,
    pnlAllTime: row.pnlAllTime,
    vlmDay: row.vlmDay,
    vlmWeek: row.vlmWeek,
    vlmMonth: row.vlmMonth,
    vlmAllTime: row.vlmAllTime,
    displayName: row.displayName,
    fetchedAt: row.fetchedAt,
  };
}

function volumeForWindow(
  row: ReturnType<typeof toListRow>,
  window: VolumeWindow,
): number {
  switch (window) {
    case "day":
      return row.vlmDay;
    case "week":
      return row.vlmWeek;
    case "month":
      return row.vlmMonth;
    case "allTime":
      return row.vlmAllTime;
    default: {
      const _exhaustive: never = window;
      return _exhaustive;
    }
  }
}

function matchesFilters(
  row: ReturnType<typeof toListRow>,
  minAccountValue: number | undefined,
  minVolume: number | undefined,
  requirePositiveVolume: boolean | undefined,
  volumeWindow: VolumeWindow,
): boolean {
  if (
    minAccountValue !== undefined &&
    row.accountValue < minAccountValue
  ) {
    return false;
  }
  const volume = volumeForWindow(row, volumeWindow);
  if (requirePositiveVolume) {
    if (!(volume > 0)) {
      return false;
    }
  } else if (minVolume !== undefined && volume < minVolume) {
    return false;
  }
  return true;
}

export const list = query({
  args: {
    sortBy: leaderboardSortByValidator,
    order: leaderboardOrderValidator,
    minAccountValue: v.optional(v.number()),
    minVolume: v.optional(v.number()),
    requirePositiveVolume: v.optional(v.boolean()),
    volumeWindow: v.optional(leaderboardVolumeWindowValidator),
    paginationOpts: paginationOptsValidator,
  },
  returns: leaderboardListResultValidator,
  handler: async (ctx, args) => {
    const sortBy = args.sortBy as LeaderboardSortBy;
    const volumeWindow = (args.volumeWindow ?? "day") as VolumeWindow;
    const ordered = (() => {
      switch (sortBy) {
        case "accountValue":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_accountValue")
            .order(args.order);
        case "pnlDay":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_pnlDay")
            .order(args.order);
        case "pnlWeek":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_pnlWeek")
            .order(args.order);
        case "pnlMonth":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_pnlMonth")
            .order(args.order);
        case "pnlAllTime":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_pnlAllTime")
            .order(args.order);
        case "vlmDay":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_vlmDay")
            .order(args.order);
        case "vlmWeek":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_vlmWeek")
            .order(args.order);
        case "vlmMonth":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_vlmMonth")
            .order(args.order);
        case "vlmAllTime":
          return ctx.db
            .query("leaderboardSnapshots")
            .withIndex("by_vlmAllTime")
            .order(args.order);
        default: {
          const _exhaustive: never = sortBy;
          return _exhaustive;
        }
      }
    })();

    const result = await ordered.paginate(args.paginationOpts);
    const page = result.page
      .map(toListRow)
      .filter((row) =>
        matchesFilters(
          row,
          args.minAccountValue,
          args.minVolume,
          args.requirePositiveVolume,
          volumeWindow,
        ),
      );

    return {
      page,
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});
