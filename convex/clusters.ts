import { v } from "convex/values";

import { internalMutation, query, type MutationCtx } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import {
  SHARED_DEPOSIT_SOURCE_BASIS,
  clusterValidator,
  rebuildDepositSourceResultValidator,
  walletClustersResultValidator,
} from "./lib/clusterTypes";
import {
  buildDepositSourceClusters,
  buildHlAddressSourceCounts,
  memberAddressesEqual,
  pickPrimaryClusterKey,
  type DepositRow,
} from "./lib/depositClustering";

const DEPOSIT_PAGE_SIZE = 256;
const CLUSTER_PAGE_SIZE = 128;
const WALLET_PAGE_SIZE = 256;

async function paginateAllDeposits(ctx: MutationCtx): Promise<DepositRow[]> {
  const deposits: DepositRow[] = [];
  let cursor: string | null = null;

  while (true) {
    const page = await ctx.db.query("deposits").paginate({
      numItems: DEPOSIT_PAGE_SIZE,
      cursor,
    });

    for (const row of page.page) {
      deposits.push({
        hlAddress: row.hlAddress,
        sourceAddress: row.sourceAddress,
      });
    }

    if (page.isDone) {
      break;
    }
    cursor = page.continueCursor;
  }

  return deposits;
}

export const rebuildDepositSource = internalMutation({
  args: {},
  returns: rebuildDepositSourceResultValidator,
  handler: async (ctx) => {
    const now = Date.now();
    const deposits = await paginateAllDeposits(ctx);
    const desiredClusters = buildDepositSourceClusters(deposits);
    const desiredByKey = new Map(
      desiredClusters.map((cluster) => [cluster.clusterKey, cluster]),
    );
    const activeClusterKeys = new Set(desiredByKey.keys());

    let clustersCreated = 0;
    let clustersUpdated = 0;
    let clustersDissolved = 0;

    for (const cluster of desiredClusters) {
      const existing = await ctx.db
        .query("clusters")
        .withIndex("by_clusterKey", (q) => q.eq("clusterKey", cluster.clusterKey))
        .unique();

      if (!existing) {
        await ctx.db.insert("clusters", {
          ...cluster,
          lastUpdated: now,
        });
        clustersCreated += 1;
        console.log("cluster created", {
          clusterKey: cluster.clusterKey,
          memberCount: cluster.memberAddresses.length,
        });
        continue;
      }

      const changed =
        !memberAddressesEqual(existing.memberAddresses, cluster.memberAddresses) ||
        existing.confidenceScore !== cluster.confidenceScore ||
        existing.sourceAddress !== cluster.sourceAddress;

      if (changed) {
        await ctx.db.patch(existing._id, {
          sourceAddress: cluster.sourceAddress,
          memberAddresses: cluster.memberAddresses,
          confidenceScore: cluster.confidenceScore,
          basis: cluster.basis,
          lastUpdated: now,
        });
        clustersUpdated += 1;
        console.log("cluster updated", {
          clusterKey: cluster.clusterKey,
          previousMembers: existing.memberAddresses,
          nextMembers: cluster.memberAddresses,
        });
      }
    }

    let clusterCursor: string | null = null;
    while (true) {
      const page = await ctx.db.query("clusters").paginate({
        numItems: CLUSTER_PAGE_SIZE,
        cursor: clusterCursor,
      });

      for (const existing of page.page) {
        if (!existing.basis.includes(SHARED_DEPOSIT_SOURCE_BASIS)) {
          continue;
        }
        if (desiredByKey.has(existing.clusterKey)) {
          continue;
        }

        await ctx.db.delete(existing._id);
        clustersDissolved += 1;
        console.log("cluster dissolved", {
          clusterKey: existing.clusterKey,
          previousMembers: existing.memberAddresses,
        });
      }

      if (page.isDone) {
        break;
      }
      clusterCursor = page.continueCursor;
    }

    const hlSourceCounts = buildHlAddressSourceCounts(deposits);
    let walletsLinked = 0;
    let walletsUnlinked = 0;

    let walletCursor: string | null = null;
    while (true) {
      const page = await ctx.db.query("wallets").paginate({
        numItems: WALLET_PAGE_SIZE,
        cursor: walletCursor,
      });

      for (const wallet of page.page) {
        const sourceCounts = hlSourceCounts.get(wallet.address) ?? new Map();
        const nextClusterId = pickPrimaryClusterKey(
          wallet.address,
          sourceCounts,
          activeClusterKeys,
        );

        if (wallet.clusterId === nextClusterId) {
          continue;
        }

        await ctx.db.patch(wallet._id, { clusterId: nextClusterId });

        if (nextClusterId === null) {
          walletsUnlinked += 1;
        } else {
          walletsLinked += 1;
        }
      }

      if (page.isDone) {
        break;
      }
      walletCursor = page.continueCursor;
    }

    const result = {
      clustersCreated,
      clustersUpdated,
      clustersDissolved,
      walletsLinked,
      walletsUnlinked,
    };

    console.log("deposit source cluster rebuild complete", result);
    return result;
  },
});

export const list = query({
  args: {},
  returns: v.array(clusterValidator),
  handler: async (ctx) => {
    const clusters: Array<{
      clusterKey: string;
      sourceAddress: string;
      memberAddresses: string[];
      confidenceScore: number;
      basis: string[];
      lastUpdated: number;
    }> = [];

    let cursor: string | null = null;
    while (true) {
      const page = await ctx.db.query("clusters").paginate({
        numItems: CLUSTER_PAGE_SIZE,
        cursor,
      });

      for (const row of page.page) {
        clusters.push({
          clusterKey: row.clusterKey,
          sourceAddress: row.sourceAddress,
          memberAddresses: row.memberAddresses,
          confidenceScore: row.confidenceScore,
          basis: row.basis,
          lastUpdated: row.lastUpdated,
        });
      }

      if (page.isDone) {
        break;
      }
      cursor = page.continueCursor;
    }

    return clusters.sort(
      (a, b) =>
        b.memberAddresses.length - a.memberAddresses.length ||
        a.clusterKey.localeCompare(b.clusterKey),
    );
  },
});

export const getByKey = query({
  args: { clusterKey: v.string() },
  returns: v.union(clusterValidator, v.null()),
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("clusters")
      .withIndex("by_clusterKey", (q) => q.eq("clusterKey", args.clusterKey))
      .unique();

    if (!row) {
      return null;
    }

    return {
      clusterKey: row.clusterKey,
      sourceAddress: row.sourceAddress,
      memberAddresses: row.memberAddresses,
      confidenceScore: row.confidenceScore,
      basis: row.basis,
      lastUpdated: row.lastUpdated,
    };
  },
});

export const getForWallet = query({
  args: { address: v.string() },
  returns: walletClustersResultValidator,
  handler: async (ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      return { primaryClusterId: null, clusters: [] };
    }

    const hlAddress = normalizeAddress(trimmed);
    const wallet = await ctx.db
      .query("wallets")
      .withIndex("by_address", (q) => q.eq("address", hlAddress))
      .unique();

    const clusters: Array<{
      clusterKey: string;
      sourceAddress: string;
      memberAddresses: string[];
      confidenceScore: number;
      basis: string[];
      lastUpdated: number;
    }> = [];

    let cursor: string | null = null;
    while (true) {
      const page = await ctx.db.query("clusters").paginate({
        numItems: CLUSTER_PAGE_SIZE,
        cursor,
      });

      for (const row of page.page) {
        if (!row.memberAddresses.includes(hlAddress)) {
          continue;
        }

        clusters.push({
          clusterKey: row.clusterKey,
          sourceAddress: row.sourceAddress,
          memberAddresses: row.memberAddresses,
          confidenceScore: row.confidenceScore,
          basis: row.basis,
          lastUpdated: row.lastUpdated,
        });
      }

      if (page.isDone) {
        break;
      }
      cursor = page.continueCursor;
    }

    clusters.sort(
      (a, b) =>
        b.memberAddresses.length - a.memberAddresses.length ||
        a.clusterKey.localeCompare(b.clusterKey),
    );

    return {
      primaryClusterId: wallet?.clusterId ?? null,
      clusters,
    };
  },
});
