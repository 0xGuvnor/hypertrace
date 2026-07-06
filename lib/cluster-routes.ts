import { isValidAddress } from "@/lib/address";

const DEPOSIT_SOURCE_CLUSTER_PREFIX = "deposit-source:";

export function clusterPath(clusterKey: string): string {
  return `/clusters/${encodeURIComponent(clusterKey)}`;
}

export function parseClusterKey(param: string): string {
  return decodeURIComponent(param);
}

export function isValidClusterKey(clusterKey: string): boolean {
  if (!clusterKey.startsWith(DEPOSIT_SOURCE_CLUSTER_PREFIX)) {
    return false;
  }
  return isValidAddress(clusterKey.slice(DEPOSIT_SOURCE_CLUSTER_PREFIX.length));
}

export function sourceAddressFromClusterKey(clusterKey: string): string {
  return clusterKey.slice(DEPOSIT_SOURCE_CLUSTER_PREFIX.length);
}

export function arbiscanAddressUrl(address: string): string {
  return `https://arbiscan.io/address/${address}`;
}

export function arbiscanTxUrl(txHash: string): string {
  return `https://arbiscan.io/tx/${txHash}`;
}
