export function positionUnrealizedPnlPercent(
  unrealizedPnl: string,
  marginUsed: string,
): number | null {
  const pnl = Number.parseFloat(unrealizedPnl);
  const margin = Number.parseFloat(marginUsed);
  if (!Number.isFinite(pnl) || !Number.isFinite(margin) || margin <= 0) {
    return null;
  }
  return (pnl / margin) * 100;
}
