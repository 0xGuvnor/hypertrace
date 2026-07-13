const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** Relative age for an open position. Caller maps null/missing to "—". */
export function formatPositionAge(openedAt: number, now: number): string {
  const elapsed = Math.max(0, now - openedAt);

  if (elapsed < MINUTE_MS) return "<1m";

  if (elapsed < HOUR_MS) {
    return `${Math.floor(elapsed / MINUTE_MS)}m`;
  }

  if (elapsed < DAY_MS) {
    return `${Math.floor(elapsed / HOUR_MS)}h`;
  }

  return `${Math.floor(elapsed / DAY_MS)}d`;
}
