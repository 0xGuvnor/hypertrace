import { v } from "convex/values";

export const SHARED_DEPOSIT_SOURCE_BASIS = "shared_deposit_source" as const;

export const clusterRecordValidator = v.object({
  clusterKey: v.string(),
  sourceAddress: v.string(),
  memberAddresses: v.array(v.string()),
  confidenceScore: v.number(),
  basis: v.array(v.string()),
  lastUpdated: v.number(),
});

export const clusterValidator = v.object({
  clusterKey: v.string(),
  sourceAddress: v.string(),
  memberAddresses: v.array(v.string()),
  confidenceScore: v.number(),
  basis: v.array(v.string()),
  lastUpdated: v.number(),
});

export const rebuildDepositSourceResultValidator = v.object({
  clustersCreated: v.number(),
  clustersUpdated: v.number(),
  clustersDissolved: v.number(),
  walletsLinked: v.number(),
  walletsUnlinked: v.number(),
});

export const walletClustersResultValidator = v.object({
  primaryClusterId: v.union(v.string(), v.null()),
  clusters: v.array(clusterValidator),
});
