type SnapshotTradingFields = {
  account: unknown;
  positions: unknown;
  openOrders: unknown;
  recentFills: unknown;
  spotBalances?: unknown;
};

export function snapshotTradingEqual(
  existing: SnapshotTradingFields,
  snapshot: SnapshotTradingFields,
): boolean {
  return (
    JSON.stringify(existing.account) === JSON.stringify(snapshot.account) &&
    JSON.stringify(existing.positions) === JSON.stringify(snapshot.positions) &&
    JSON.stringify(existing.openOrders) === JSON.stringify(snapshot.openOrders) &&
    JSON.stringify(existing.recentFills) === JSON.stringify(snapshot.recentFills) &&
    JSON.stringify(existing.spotBalances ?? []) ===
      JSON.stringify(snapshot.spotBalances ?? [])
  );
}
