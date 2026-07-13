import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";

const favoriteValidator = v.object({
  address: v.string(),
  createdAt: v.number(),
});

async function requireIdentityToken(ctx: {
  auth: { getUserIdentity: () => Promise<{ tokenIdentifier: string } | null> };
}): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.tokenIdentifier;
}

export const list = query({
  args: {},
  returns: v.union(v.array(favoriteValidator), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const rows = await ctx.db
      .query("walletFavorites")
      .withIndex("by_user", (q) =>
        q.eq("userTokenIdentifier", identity.tokenIdentifier),
      )
      .collect();

    return rows
      .map((row) => ({
        address: row.address,
        createdAt: row.createdAt,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const isFavorited = query({
  args: { address: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      return false;
    }
    const address = normalizeAddress(trimmed);

    const existing = await ctx.db
      .query("walletFavorites")
      .withIndex("by_user_and_address", (q) =>
        q
          .eq("userTokenIdentifier", identity.tokenIdentifier)
          .eq("address", address),
      )
      .unique();

    return existing !== null;
  },
});

export const toggle = mutation({
  args: { address: v.string() },
  returns: v.object({
    favorited: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const userTokenIdentifier = await requireIdentityToken(ctx);

    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      throw new Error("Invalid address");
    }
    const address = normalizeAddress(trimmed);

    const existing = await ctx.db
      .query("walletFavorites")
      .withIndex("by_user_and_address", (q) =>
        q
          .eq("userTokenIdentifier", userTokenIdentifier)
          .eq("address", address),
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { favorited: false };
    }

    await ctx.db.insert("walletFavorites", {
      userTokenIdentifier,
      address,
      createdAt: Date.now(),
    });
    return { favorited: true };
  },
});
