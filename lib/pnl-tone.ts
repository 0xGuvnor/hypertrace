/** Semantic PnL / signed-value tone classes (oklch tokens in globals.css). */

export const PNL_POSITIVE_TEXT = "text-[var(--pnl-positive)]";
export const PNL_NEGATIVE_TEXT = "text-[var(--pnl-negative)]";

export const PNL_POSITIVE_BADGE =
  "border-[color-mix(in_oklch,var(--pnl-positive)_30%,transparent)] bg-[color-mix(in_oklch,var(--pnl-positive)_10%,transparent)] font-medium text-[var(--pnl-positive)]";

export const PNL_NEGATIVE_BADGE =
  "border-[color-mix(in_oklch,var(--pnl-negative)_30%,transparent)] bg-[color-mix(in_oklch,var(--pnl-negative)_10%,transparent)] font-medium text-[var(--pnl-negative)]";

export const PNL_POSITIVE_SOFT =
  "border-[color-mix(in_oklch,var(--pnl-positive)_20%,transparent)] bg-[color-mix(in_oklch,var(--pnl-positive)_15%,transparent)] text-[var(--pnl-positive)]";

export const PNL_NEGATIVE_SOFT =
  "border-[color-mix(in_oklch,var(--pnl-negative)_20%,transparent)] bg-[color-mix(in_oklch,var(--pnl-negative)_15%,transparent)] text-[var(--pnl-negative)]";

export function signedNumberClass(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  return value < 0 ? PNL_NEGATIVE_TEXT : PNL_POSITIVE_TEXT;
}

export function signedHlStringClass(value: string): string {
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num) || num === 0) return "";
  return num < 0 ? PNL_NEGATIVE_TEXT : PNL_POSITIVE_TEXT;
}

/** uPnL: treat exact zero as neutral (no color). */
export function unrealizedPnlClass(value: string): string {
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num) || num === 0) return "";
  return num > 0 ? PNL_POSITIVE_TEXT : PNL_NEGATIVE_TEXT;
}

/** Funding fee: negative = paid (red), positive = received (green). */
export function fundingFeeClass(value: string): string {
  return signedHlStringClass(value);
}
