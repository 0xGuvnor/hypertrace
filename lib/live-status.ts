import type { LiveWalletSnapshot } from "@/lib/wallet-types";

export const LIVE_STALE_AFTER_MS = 90_000;

export type LiveFeedStatus =
  | { kind: "connecting" }
  | { kind: "snapshot"; fetchedAt: number }
  | { kind: "live"; updatedAt: number; fetchedAt: number }
  | { kind: "stale"; updatedAt: number; fetchedAt: number };

export function deriveLiveFeedStatus(
  liveSnapshot: LiveWalletSnapshot | null | undefined,
  now: number,
  fallbackFetchedAt: number,
): LiveFeedStatus {
  if (liveSnapshot === undefined) {
    return { kind: "connecting" };
  }

  if (liveSnapshot === null) {
    return { kind: "snapshot", fetchedAt: fallbackFetchedAt };
  }

  const ageMs = now - liveSnapshot.updatedAt;
  if (ageMs > LIVE_STALE_AFTER_MS) {
    return {
      kind: "stale",
      updatedAt: liveSnapshot.updatedAt,
      fetchedAt: liveSnapshot.fetchedAt,
    };
  }

  return {
    kind: "live",
    updatedAt: liveSnapshot.updatedAt,
    fetchedAt: liveSnapshot.fetchedAt,
  };
}

export function formatRelativeUpdate(ms: number, now: number): string {
  const diffSec = Math.max(0, Math.floor((now - ms) / 1000));

  if (diffSec < 10) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}
