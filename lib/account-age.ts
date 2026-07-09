const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

export function formatAccountAge(firstActivityAt: number, now: number): string {
  const elapsed = Math.max(0, now - firstActivityAt);

  if (elapsed < HOUR_MS) {
    return "<1h";
  }

  if (elapsed < DAY_MS) {
    const hours = Math.floor(elapsed / HOUR_MS);
    return `${hours}h`;
  }

  if (elapsed < MONTH_MS) {
    const days = Math.floor(elapsed / DAY_MS);
    return `${days}d`;
  }

  if (elapsed < YEAR_MS) {
    const months = Math.floor(elapsed / MONTH_MS);
    return `${months}mo`;
  }

  const years = Math.floor(elapsed / YEAR_MS);
  const months = Math.floor((elapsed % YEAR_MS) / MONTH_MS);
  if (months === 0) {
    return `${years}y`;
  }
  return `${years}y ${months}mo`;
}

export function formatFirstActivityTimestamp(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
