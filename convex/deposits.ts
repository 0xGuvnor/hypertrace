import { v } from "convex/values";

import { internalMutation, internalQuery, query } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import {
  depositCursorValidator,
  depositRowValidator,
  depositSourceUpdateValidator,
  depositValidator,
  walletDepositsResultValidator,
} from "./lib/depositTypes";

const SELF_SOURCED_LIMIT_PER_ADDRESS = 100;
const DEPOSIT_LIST_LIMIT = 100;

function isImprovedSource(
  hlAddress: string,
  existingSource: string,
  nextSource: string,
): boolean {
  return existingSource === hlAddress && nextSource !== hlAddress;
}

export const upsertBatch = internalMutation({
  args: {
    deposits: v.array(depositRowValidator),
    cursors: v.array(depositCursorValidator),
  },
  returns: v.object({
    inserted: v.number(),
    skipped: v.number(),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    let inserted = 0;
    let skipped = 0;
    let updated = 0;

    for (const deposit of args.deposits) {
      const hlAddress = normalizeAddress(deposit.hlAddress);
      const sourceAddress = normalizeAddress(deposit.sourceAddress);

      if (!isValidAddress(hlAddress) || !isValidAddress(sourceAddress)) {
        skipped += 1;
        continue;
      }

      const existing = await ctx.db
        .query("deposits")
        .withIndex("by_depositKey", (q) => q.eq("depositKey", deposit.depositKey))
        .unique();

      if (existing) {
        if (isImprovedSource(hlAddress, existing.sourceAddress, sourceAddress)) {
          await ctx.db.patch(existing._id, {
            sourceAddress,
            blockNumber: existing.blockNumber ?? deposit.blockNumber,
          });
          updated += 1;
        } else {
          skipped += 1;
        }
        continue;
      }

      await ctx.db.insert("deposits", {
        hlAddress,
        sourceAddress,
        amount: deposit.amount,
        timestamp: deposit.timestamp,
        arbTxHash: deposit.arbTxHash.toLowerCase(),
        logIndex: deposit.logIndex,
        depositKey: deposit.depositKey,
        blockNumber: deposit.blockNumber,
      });
      inserted += 1;

      const wallet = await ctx.db
        .query("wallets")
        .withIndex("by_address", (q) => q.eq("address", hlAddress))
        .unique();

      if (wallet) {
        if (deposit.timestamp < wallet.firstSeen) {
          await ctx.db.patch(wallet._id, { firstSeen: deposit.timestamp });
        }
      } else {
        await ctx.db.insert("wallets", {
          address: hlAddress,
          firstSeen: deposit.timestamp,
          tags: [],
          clusterId: null,
        });
      }
    }

    const now = Date.now();
    for (const cursor of args.cursors) {
      const hlAddress = normalizeAddress(cursor.hlAddress);
      if (!isValidAddress(hlAddress)) continue;

      const existing = await ctx.db
        .query("depositScanCursors")
        .withIndex("by_hlAddress", (q) => q.eq("hlAddress", hlAddress))
        .unique();

      if (existing) {
        if (cursor.lastScannedBlock > existing.lastScannedBlock) {
          await ctx.db.patch(existing._id, {
            lastScannedBlock: cursor.lastScannedBlock,
            updatedAt: now,
          });
        }
      } else {
        await ctx.db.insert("depositScanCursors", {
          hlAddress,
          lastScannedBlock: cursor.lastScannedBlock,
          updatedAt: now,
        });
      }
    }

    return { inserted, skipped, updated };
  },
});

export const listSelfSourced = internalQuery({
  args: { addresses: v.array(v.string()) },
  returns: v.array(depositValidator),
  handler: async (ctx, args) => {
    const results: Array<{
      hlAddress: string;
      sourceAddress: string;
      amount: number;
      timestamp: number;
      arbTxHash: string;
      logIndex: number;
      depositKey: string;
      blockNumber?: number;
    }> = [];

    for (const raw of args.addresses) {
      const trimmed = raw.trim();
      if (!isValidAddress(trimmed)) continue;

      const hlAddress = normalizeAddress(trimmed);
      const rows = await ctx.db
        .query("deposits")
        .withIndex("by_hlAddress", (q) => q.eq("hlAddress", hlAddress))
        .collect();

      const selfSourced = rows
        .filter((row) => row.sourceAddress === hlAddress)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, SELF_SOURCED_LIMIT_PER_ADDRESS);

      for (const row of selfSourced) {
        results.push({
          hlAddress: row.hlAddress,
          sourceAddress: row.sourceAddress,
          amount: row.amount,
          timestamp: row.timestamp,
          arbTxHash: row.arbTxHash,
          logIndex: row.logIndex,
          depositKey: row.depositKey,
          blockNumber: row.blockNumber,
        });
      }
    }

    return results;
  },
});

export const patchSourceBatch = internalMutation({
  args: { updates: v.array(depositSourceUpdateValidator) },
  returns: v.object({ updated: v.number(), skipped: v.number() }),
  handler: async (ctx, args) => {
    let updated = 0;
    let skipped = 0;

    for (const update of args.updates) {
      const sourceAddress = normalizeAddress(update.sourceAddress);
      if (!isValidAddress(sourceAddress)) {
        skipped += 1;
        continue;
      }

      const existing = await ctx.db
        .query("deposits")
        .withIndex("by_depositKey", (q) => q.eq("depositKey", update.depositKey))
        .unique();

      if (!existing) {
        skipped += 1;
        continue;
      }

      if (!isImprovedSource(existing.hlAddress, existing.sourceAddress, sourceAddress)) {
        skipped += 1;
        continue;
      }

      await ctx.db.patch(existing._id, { sourceAddress });
      updated += 1;
    }

    return { updated, skipped };
  },
});

export const getCursors = internalQuery({
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

      const hlAddress = normalizeAddress(trimmed);
      const cursor = await ctx.db
        .query("depositScanCursors")
        .withIndex("by_hlAddress", (q) => q.eq("hlAddress", hlAddress))
        .unique();

      result[hlAddress] = cursor?.lastScannedBlock ?? null;
    }

    return result;
  },
});

export const setCursors = internalMutation({
  args: { cursors: v.array(depositCursorValidator) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const cursor of args.cursors) {
      const hlAddress = normalizeAddress(cursor.hlAddress);
      if (!isValidAddress(hlAddress)) continue;

      const existing = await ctx.db
        .query("depositScanCursors")
        .withIndex("by_hlAddress", (q) => q.eq("hlAddress", hlAddress))
        .unique();

      if (existing) {
        if (cursor.lastScannedBlock > existing.lastScannedBlock) {
          await ctx.db.patch(existing._id, {
            lastScannedBlock: cursor.lastScannedBlock,
            updatedAt: now,
          });
        }
      } else {
        await ctx.db.insert("depositScanCursors", {
          hlAddress,
          lastScannedBlock: cursor.lastScannedBlock,
          updatedAt: now,
        });
      }
    }

    return null;
  },
});

export const resetAllScanCursors = internalMutation({
  args: {},
  returns: v.object({ deleted: v.number() }),
  handler: async (ctx) => {
    const cursors = await ctx.db.query("depositScanCursors").collect();
    for (const cursor of cursors) {
      await ctx.db.delete(cursor._id);
    }
    return { deleted: cursors.length };
  },
});

export const listByWallet = query({
  args: { address: v.string() },
  returns: walletDepositsResultValidator,
  handler: async (ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      return { deposits: [], hasMore: false };
    }

    const hlAddress = normalizeAddress(trimmed);
    const rows = await ctx.db
      .query("deposits")
      .withIndex("by_hlAddress_timestamp", (q) => q.eq("hlAddress", hlAddress))
      .order("desc")
      .take(DEPOSIT_LIST_LIMIT + 1);

    const hasMore = rows.length > DEPOSIT_LIST_LIMIT;
    const deposits = rows.slice(0, DEPOSIT_LIST_LIMIT).map((row) => ({
      hlAddress: row.hlAddress,
      sourceAddress: row.sourceAddress,
      amount: row.amount,
      timestamp: row.timestamp,
      arbTxHash: row.arbTxHash,
      logIndex: row.logIndex,
      depositKey: row.depositKey,
      blockNumber: row.blockNumber,
    }));

    return { deposits, hasMore };
  },
});
