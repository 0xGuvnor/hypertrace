import { v } from "convex/values";

import { internal } from "./_generated/api";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import {
  fetchFirstActivityAt,
  fetchWalletSnapshot,
} from "./lib/hyperliquid";
import {
  liveWalletSnapshotValidator,
  walletSnapshotValidator,
} from "./lib/hyperliquidTypes";
import { snapshotTradingEqual } from "./lib/snapshotEqual";

export const getSnapshot = action({
  args: { address: v.string() },
  returns: walletSnapshotValidator,
  handler: async (_ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      throw new Error("Invalid wallet address");
    }

    return await fetchWalletSnapshot(normalizeAddress(trimmed));
  },
});

export const getCachedFirstActivity = internalQuery({
  args: { address: v.string() },
  returns: v.union(v.number(), v.null()),
  handler: async (ctx, args) => {
    const address = normalizeAddress(args.address);
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    return wallet?.firstActivityAt ?? null;
  },
});

export const setFirstActivityAt = internalMutation({
  args: {
    address: v.string(),
    firstActivityAt: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const address = normalizeAddress(args.address);
    const existing = await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    if (existing) {
      if (existing.firstActivityAt === undefined) {
        await ctx.db.patch(existing._id, {
          firstActivityAt: args.firstActivityAt,
        });
      }
      return null;
    }

    await ctx.db.insert("wallets", {
      address,
      firstSeen: args.firstActivityAt,
      firstActivityAt: args.firstActivityAt,
      tags: [],
      clusterId: null,
    });
    return null;
  },
});

export const getFirstActivity = action({
  args: { address: v.string() },
  returns: v.union(v.number(), v.null()),
  handler: async (ctx, args): Promise<number | null> => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      return null;
    }

    const address = normalizeAddress(trimmed);
    const cached: number | null = await ctx.runQuery(
      internal.wallets.getCachedFirstActivity,
      { address },
    );
    if (cached !== null) {
      return cached;
    }

    try {
      const firstActivityAt = await fetchFirstActivityAt(address);
      if (firstActivityAt === null) {
        return null;
      }

      await ctx.runMutation(internal.wallets.setFirstActivityAt, {
        address,
        firstActivityAt,
      });
      return firstActivityAt;
    } catch {
      return null;
    }
  },
});

export const getLiveSnapshot = query({
  args: { address: v.string() },
  returns: v.union(liveWalletSnapshotValidator, v.null()),
  handler: async (ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      return null;
    }

    const address = normalizeAddress(trimmed);
    const row = await ctx.db
      .query("walletSnapshots")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    if (!row) {
      return null;
    }

    return {
      address: row.address,
      fetchedAt: row.fetchedAt,
      account: {
        ...row.account,
        spotValue: row.account.spotValue ?? "0",
      },
      positions: row.positions,
      openOrders: row.openOrders,
      recentFills: row.recentFills,
      spotBalances: row.spotBalances ?? [],
      updatedAt: row.updatedAt,
    };
  },
});

export const getSnapshotTimestamps = internalQuery({
  args: { addresses: v.array(v.string()) },
  returns: v.record(v.string(), v.union(v.number(), v.null())),
  handler: async (ctx, args) => {
    const result: Record<string, number | null> = {};

    for (const raw of args.addresses) {
      const trimmed = raw.trim();
      if (!isValidAddress(trimmed)) {
        result[trimmed] = null;
        continue;
      }

      const address = normalizeAddress(trimmed);
      const row = await ctx.db
        .query("walletSnapshots")
        .withIndex("by_address", (q) => q.eq("address", address))
        .unique();

      result[address] = row?.updatedAt ?? null;
    }

    return result;
  },
});

export const upsertSnapshot = internalMutation({
  args: { snapshot: walletSnapshotValidator },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { snapshot } = args;
    const address = normalizeAddress(snapshot.address);
    const now = Date.now();
    const existing = await ctx.db
      .query("walletSnapshots")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    if (existing && snapshotTradingEqual(existing, snapshot)) {
      await ctx.db.patch(existing._id, {
        fetchedAt: snapshot.fetchedAt,
        updatedAt: now,
      });
      return null;
    }

    const record = {
      address,
      fetchedAt: snapshot.fetchedAt,
      account: snapshot.account,
      positions: snapshot.positions,
      openOrders: snapshot.openOrders,
      recentFills: snapshot.recentFills,
      spotBalances: snapshot.spotBalances ?? [],
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
      return null;
    }

    await ctx.db.insert("walletSnapshots", record);
    return null;
  },
});
