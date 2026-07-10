import { paginationOptsValidator } from "convex/server";
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
  depositSourceClusterKey,
  memberAddressesEqual,
  pickPrimaryClusterKey,
  type DepositRow,
} from "./lib/depositClustering";

type ClusterDoc = {
  clusterKey: string;
  sourceAddress: string;
  memberAddresses: string[];
  confidenceScore: number;
  basis: string[];
  lastUpdated: number;
};

function toCluster(row: ClusterDoc) {
  return {
    clusterKey: row.clusterKey,
    sourceAddress: row.sourceAddress,
    memberAddresses: row.memberAddresses,
    confidenceScore: row.confidenceScore,
    basis: row.basis,
    lastUpdated: row.lastUpdated,
  };
}

function sortClusters(clusters: ReturnType<typeof toCluster>[]) {
  return clusters.sort(
    (a, b) =>
      (b.memberAddresses?.length ?? 0) - (a.memberAddresses?.length ?? 0) ||
      a.clusterKey.localeCompare(b.clusterKey),
  );
}

async function collectAllDeposits(ctx: MutationCtx): Promise<DepositRow[]> {
  const rows = await ctx.db.query("deposits").collect();
  return rows.map((row) => ({
    hlAddress: row.hlAddress,
    sourceAddress: row.sourceAddress,
    direction: row.direction,
  }));
}

export const rebuildDepositSource = internalMutation({
  args: {},
  returns: rebuildDepositSourceResultValidator,
  handler: async (ctx) => {
    const now = Date.now();

    for (const existing of await ctx.db.query("clusters").collect()) {
      const memberCount = existing.memberAddresses.length;
      if ((existing.memberCount ?? -1) !== memberCount) {
        await ctx.db.patch(existing._id, { memberCount });
      }
    }

    const deposits = await collectAllDeposits(ctx);
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
          clusterKey: cluster.clusterKey,
          sourceAddress: cluster.sourceAddress,
          memberAddresses: cluster.memberAddresses,
          memberCount: cluster.memberAddresses.length,
          confidenceScore: cluster.confidenceScore,
          basis: cluster.basis,
          lastUpdated: now,
        });
        clustersCreated += 1;
        console.log("cluster created", {
          clusterKey: cluster.clusterKey,
          memberCount: cluster.memberAddresses.length,
        });
        continue;
      }

      const nextMemberCount = cluster.memberAddresses.length;
      const changed =
        !memberAddressesEqual(existing.memberAddresses, cluster.memberAddresses) ||
        existing.confidenceScore !== cluster.confidenceScore ||
        existing.sourceAddress !== cluster.sourceAddress ||
        existing.memberCount !== nextMemberCount;

      if (changed) {
        await ctx.db.patch(existing._id, {
          sourceAddress: cluster.sourceAddress,
          memberAddresses: cluster.memberAddresses,
          memberCount: nextMemberCount,
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

    for (const existing of await ctx.db.query("clusters").collect()) {
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

    const hlSourceCounts = buildHlAddressSourceCounts(deposits);
    let walletsLinked = 0;
    let walletsUnlinked = 0;

    for (const wallet of await ctx.db.query("wallets").collect()) {
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
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(clusterValidator),
    continueCursor: v.union(v.string(), v.null()),
    isDone: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("clusters")
      .withIndex("by_memberCount")
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      page: result.page.map(toCluster),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
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

    return toCluster(row);
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

    const depositRows = await ctx.db
      .query("deposits")
      .withIndex("by_hlAddress", (q) => q.eq("hlAddress", hlAddress))
      .collect();

    const sourceAddresses = [
      ...new Set(
        depositRows
          .filter((row) => row.direction !== "withdrawal")
          .map((row) => row.sourceAddress),
      ),
    ];
    const seenKeys = new Set<string>();
    const clusters: ReturnType<typeof toCluster>[] = [];

    for (const sourceAddress of sourceAddresses) {
      const clusterKey = depositSourceClusterKey(sourceAddress);
      if (seenKeys.has(clusterKey)) {
        continue;
      }
      seenKeys.add(clusterKey);

      const row = await ctx.db
        .query("clusters")
        .withIndex("by_clusterKey", (q) => q.eq("clusterKey", clusterKey))
        .unique();

      if (!row?.memberAddresses?.includes(hlAddress)) {
        continue;
      }

      clusters.push(toCluster(row));
    }

    return {
      primaryClusterId: wallet?.clusterId ?? null,
      clusters: sortClusters(clusters),
    };
  },
});
