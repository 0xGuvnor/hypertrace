const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (!Number.isFinite(num)) return "—";
  return usdFormatter.format(num);
}

export function formatSize(value: string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num)) return "—";
  return num.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function formatOrderSize(
  size: string,
  isPositionTpsl: boolean,
): string {
  if (isPositionTpsl) {
    const num = Number.parseFloat(size);
    if (Number.isFinite(num) && num === 0) {
      return "Close position";
    }
  }
  return formatSize(size);
}

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
