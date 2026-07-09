import { v } from "convex/values";

import { internalQuery, mutation } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";

const WATCH_TTL_MS = 24 * 60 * 60 * 1000;

export const request = mutation({
  args: { address: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      throw new Error("Invalid wallet address");
    }

    const address = normalizeAddress(trimmed);
    const now = Date.now();
    const existing = await ctx.db
      .query("watchedAddresses")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { lastRequestedAt: now });
      return null;
    }

    await ctx.db.insert("watchedAddresses", {
      address,
      lastRequestedAt: now,
    });
    return null;
  },
});

export const listActive = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const cutoff = Date.now() - WATCH_TTL_MS;
    const watches = await ctx.db.query("watchedAddresses").collect();
    return watches
      .filter((watch) => watch.lastRequestedAt >= cutoff)
      .sort((a, b) => b.lastRequestedAt - a.lastRequestedAt)
      .map((watch) => watch.address);
  },
});
