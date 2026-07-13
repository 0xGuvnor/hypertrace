export type PositionSide = "long" | "short";

export type FillForOpenedAt = {
  coin: string;
  time: number;
  side: "B" | "A";
  sz: string;
  startPosition?: string;
  dir?: string;
};

const FLAT_EPSILON = 1e-10;

function isNearZero(value: number): boolean {
  return Math.abs(value) < FLAT_EPSILON;
}

function fillSignedDelta(fill: Pick<FillForOpenedAt, "side" | "sz">): number | null {
  const size = Number.parseFloat(fill.sz);
  if (!Number.isFinite(size)) return null;
  return fill.side === "B" ? size : -size;
}

/**
 * Best-effort open time for the current continuous position on `coin`.
 * Walks fills newest → oldest within the provided window only.
 */
export function resolvePositionOpenedAt(
  coin: string,
  side: PositionSide,
  fills: readonly FillForOpenedAt[],
): number | null {
  const sideSign = side === "long" ? 1 : -1;
  const openDir = side === "long" ? "Open Long" : "Open Short";

  const coinFills = fills
    .filter((fill) => fill.coin === coin)
    .sort((a, b) => b.time - a.time);

  for (const fill of coinFills) {
    if (fill.dir === "Buy" || fill.dir === "Sell") continue;

    if (fill.dir === openDir) {
      return fill.time;
    }

    if (fill.startPosition === undefined) continue;
    const start = Number.parseFloat(fill.startPosition);
    if (!Number.isFinite(start)) continue;

    const delta = fillSignedDelta(fill);
    if (delta === null) continue;
    const end = start + delta;

    if (isNearZero(start) && Math.sign(end) === sideSign) {
      return fill.time;
    }
    if (Math.sign(start) === -sideSign && Math.sign(end) === sideSign) {
      return fill.time;
    }
  }

  return null;
}

export function attachOpenedAtToPositions<
  T extends { coin: string; side: PositionSide },
>(
  positions: T[],
  fills: readonly FillForOpenedAt[],
): Array<T & { openedAt: number | null }> {
  return positions.map((position) => ({
    ...position,
    openedAt: resolvePositionOpenedAt(position.coin, position.side, fills),
  }));
}
