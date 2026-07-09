import { v } from "convex/values";

import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import { fetchWalletSnapshot } from "./lib/hyperliquid";
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
