const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: string | number): string {
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return usdFormatter.format(num);
}

export function formatSize(value: string): string {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return value;
  return num.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
