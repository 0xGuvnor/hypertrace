const BASIS_LABELS: Record<string, string> = {
  shared_deposit_source: "Shared deposit source",
};

export function formatBasis(basis: string): string {
  return BASIS_LABELS[basis] ?? basis.replaceAll("_", " ");
}

export function formatConfidence(score: number): string {
  const pct = Math.round(score * 100);
  return `${pct}%`;
}
