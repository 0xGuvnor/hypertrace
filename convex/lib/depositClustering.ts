import { SHARED_DEPOSIT_SOURCE_BASIS } from "./clusterTypes";
import {
  CLUSTER_SOURCE_FANOUT_CAP,
  isFundingDenylisted,
} from "./knownAddresses";

export type DepositRow = {
  hlAddress: string;
  sourceAddress: string;
  direction?: "deposit" | "withdrawal";
};

function isDepositRow(deposit: DepositRow): boolean {
  return deposit.direction !== "withdrawal";
}

function isClusterableSource(sourceAddress: string, hlAddress: string): boolean {
  if (sourceAddress === hlAddress) {
    return false;
  }
  if (isFundingDenylisted(sourceAddress)) {
    return false;
  }
  return true;
}

export type DepositSourceCluster = {
  clusterKey: string;
  sourceAddress: string;
  memberAddresses: string[];
  confidenceScore: number;
  basis: string[];
};

const CLUSTER_KEY_PREFIX = "deposit-source:";

export function depositSourceClusterKey(sourceAddress: string): string {
  return `${CLUSTER_KEY_PREFIX}${sourceAddress}`;
}

export function confidenceScoreForMemberCount(memberCount: number): number {
  return Math.min(1, 0.5 + 0.1 * (memberCount - 1));
}

export function buildDepositSourceClusters(
  deposits: DepositRow[],
): DepositSourceCluster[] {
  const bySource = new Map<string, Map<string, number>>();

  for (const deposit of deposits) {
    if (!isDepositRow(deposit)) {
      continue;
    }
    if (!isClusterableSource(deposit.sourceAddress, deposit.hlAddress)) {
      continue;
    }
    let hlCounts = bySource.get(deposit.sourceAddress);
    if (!hlCounts) {
      hlCounts = new Map();
      bySource.set(deposit.sourceAddress, hlCounts);
    }
    hlCounts.set(deposit.hlAddress, (hlCounts.get(deposit.hlAddress) ?? 0) + 1);
  }

  const clusters: DepositSourceCluster[] = [];

  for (const [sourceAddress, hlCounts] of bySource) {
    if (hlCounts.size < 2) {
      continue;
    }
    if (hlCounts.size > CLUSTER_SOURCE_FANOUT_CAP) {
      continue;
    }

    const memberAddresses = [...hlCounts.keys()].sort();
    clusters.push({
      clusterKey: depositSourceClusterKey(sourceAddress),
      sourceAddress,
      memberAddresses,
      confidenceScore: confidenceScoreForMemberCount(memberAddresses.length),
      basis: [SHARED_DEPOSIT_SOURCE_BASIS],
    });
  }

  return clusters.sort((a, b) => a.clusterKey.localeCompare(b.clusterKey));
}

export function pickPrimaryClusterKey(
  _hlAddress: string,
  sourceCounts: Map<string, number>,
  activeClusterKeys: Set<string>,
): string | null {
  let bestKey: string | null = null;
  let bestCount = 0;

  for (const [sourceAddress, count] of sourceCounts) {
    const clusterKey = depositSourceClusterKey(sourceAddress);
    if (!activeClusterKeys.has(clusterKey)) {
      continue;
    }

    if (
      bestKey === null ||
      count > bestCount ||
      (count === bestCount && clusterKey < bestKey)
    ) {
      bestCount = count;
      bestKey = clusterKey;
    }
  }

  return bestKey;
}

export function buildHlAddressSourceCounts(
  deposits: DepositRow[],
): Map<string, Map<string, number>> {
  const byHl = new Map<string, Map<string, number>>();

  for (const deposit of deposits) {
    if (!isDepositRow(deposit)) {
      continue;
    }
    if (!isClusterableSource(deposit.sourceAddress, deposit.hlAddress)) {
      continue;
    }
    let sourceCounts = byHl.get(deposit.hlAddress);
    if (!sourceCounts) {
      sourceCounts = new Map();
      byHl.set(deposit.hlAddress, sourceCounts);
    }
    sourceCounts.set(
      deposit.sourceAddress,
      (sourceCounts.get(deposit.sourceAddress) ?? 0) + 1,
    );
  }

  return byHl;
}

export function memberAddressesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
