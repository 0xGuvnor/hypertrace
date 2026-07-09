export type SpotBalance = {
  coin: string;
  token: number;
  total: string;
  hold: string;
  entryNtl: string;
};

export type SpotMetaAndAssetCtxs = [
  {
    tokens: Array<{ name: string; index: number }>;
    universe: Array<{ name: string; tokens: number[] }>;
  },
  Array<{ markPx: string; coin?: string }>,
];

export type UserAbstraction =
  | "unifiedAccount"
  | "portfolioMargin"
  | "default"
  | "disabled"
  | "dexAbstraction"
  | string;

export function sumUsdStrings(...values: string[]): string {
  let sum = 0;
  for (const value of values) {
    const num = Number.parseFloat(value);
    if (Number.isFinite(num)) sum += num;
  }
  return sum.toString();
}

export function priceSpotBalances(
  balances: SpotBalance[],
  spotMeta: SpotMetaAndAssetCtxs,
): string {
  const [meta, ctxs] = spotMeta;
  let sum = 0;

  for (const balance of balances) {
    const total = Number.parseFloat(balance.total);
    if (!Number.isFinite(total) || total <= 0) continue;

    if (balance.token === 0 || balance.coin === "USDC") {
      sum += total;
      continue;
    }

    const pairIndex = meta.universe.findIndex(
      (pair) => pair.tokens[0] === balance.token,
    );
    if (pairIndex < 0) continue;

    const markPx = Number.parseFloat(ctxs[pairIndex]?.markPx ?? "");
    if (!Number.isFinite(markPx)) continue;

    sum += total * markPx;
  }

  return sum.toString();
}

export function sumPerpUnrealizedPnl(
  ...clearinghouses: Array<{
    assetPositions: Array<{ position: { unrealizedPnl: string } }>;
  }>
): string {
  const values: string[] = [];
  for (const clearinghouse of clearinghouses) {
    for (const { position } of clearinghouse.assetPositions) {
      values.push(position.unrealizedPnl);
    }
  }
  return sumUsdStrings(...values);
}

export function computeAccountValue(args: {
  userAbstraction: UserAbstraction;
  spotValue: string;
  perpAccountValueSum: string;
  perpUnrealizedPnlSum: string;
}): string {
  const mode = args.userAbstraction;
  if (mode === "unifiedAccount" || mode === "portfolioMargin") {
    return sumUsdStrings(args.spotValue, args.perpUnrealizedPnlSum);
  }
  return sumUsdStrings(args.perpAccountValueSum, args.spotValue);
}

export function parseUserAbstraction(raw: unknown): UserAbstraction {
  if (typeof raw !== "string") return "default";
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (typeof parsed === "string") return parsed;
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}
