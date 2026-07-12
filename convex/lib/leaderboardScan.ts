/** DB page size when post-filtering can empty a page of `requested` rows. */
export function leaderboardScanPageSize(
  requested: number,
  needsPostFilter: boolean,
): number {
  if (!needsPostFilter) return requested;
  return Math.min(Math.max(requested * 50, 100), 500);
}
