export type WalletTab =
  | "positions"
  | "spot"
  | "orders"
  | "fills"
  | "transfers";

export type PositionsSortKey = "value" | "fundingFee" | "unrealizedPnl";

export type WalletSortOrder = "asc" | "desc";

export type WalletView = {
  tab: WalletTab;
  positionsSortKey: PositionsSortKey;
  positionsOrder: WalletSortOrder;
  spotOrder: WalletSortOrder;
};

export const DEFAULT_WALLET_TAB: WalletTab = "positions";
export const DEFAULT_POSITIONS_SORT_KEY: PositionsSortKey = "value";
export const DEFAULT_POSITIONS_ORDER: WalletSortOrder = "desc";
export const DEFAULT_SPOT_ORDER: WalletSortOrder = "desc";

export const DEFAULT_WALLET_VIEW: WalletView = {
  tab: DEFAULT_WALLET_TAB,
  positionsSortKey: DEFAULT_POSITIONS_SORT_KEY,
  positionsOrder: DEFAULT_POSITIONS_ORDER,
  spotOrder: DEFAULT_SPOT_ORDER,
};

export const WALLET_TAB_VALUES = [
  "positions",
  "spot",
  "orders",
  "fills",
  "transfers",
] as const satisfies readonly WalletTab[];

export function isWalletTab(value: unknown): value is WalletTab {
  return (
    typeof value === "string" &&
    (WALLET_TAB_VALUES as readonly string[]).includes(value)
  );
}

const POSITIONS_SORT_KEY_VALUES = [
  "value",
  "fundingFee",
  "unrealizedPnl",
] as const satisfies readonly PositionsSortKey[];

const ORDER_VALUES = [
  "asc",
  "desc",
] as const satisfies readonly WalletSortOrder[];

function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseEnum<T extends string>(
  raw: string | undefined,
  allowed: readonly T[],
): T | undefined {
  if (raw === undefined) return undefined;
  return (allowed as readonly string[]).includes(raw)
    ? (raw as T)
    : undefined;
}

export function parseWalletSearchParams(
  searchParams: Record<string, string | string[] | undefined> | URLSearchParams,
): WalletView {
  const get = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }
    return firstParam(searchParams[key]);
  };

  return {
    tab: parseEnum(get("tab"), WALLET_TAB_VALUES) ?? DEFAULT_WALLET_TAB,
    positionsSortKey:
      parseEnum(get("sort"), POSITIONS_SORT_KEY_VALUES) ??
      DEFAULT_POSITIONS_SORT_KEY,
    positionsOrder:
      parseEnum(get("order"), ORDER_VALUES) ?? DEFAULT_POSITIONS_ORDER,
    spotOrder: parseEnum(get("spotOrder"), ORDER_VALUES) ?? DEFAULT_SPOT_ORDER,
  };
}

export function serializeWalletSearchParams(
  view: WalletView,
): URLSearchParams {
  const params = new URLSearchParams();
  if (view.tab !== DEFAULT_WALLET_TAB) {
    params.set("tab", view.tab);
  }
  if (view.positionsSortKey !== DEFAULT_POSITIONS_SORT_KEY) {
    params.set("sort", view.positionsSortKey);
  }
  if (view.positionsOrder !== DEFAULT_POSITIONS_ORDER) {
    params.set("order", view.positionsOrder);
  }
  if (view.spotOrder !== DEFAULT_SPOT_ORDER) {
    params.set("spotOrder", view.spotOrder);
  }
  return params;
}

export function walletHref(address: string, view: WalletView): string {
  const params = serializeWalletSearchParams(view);
  const query = params.toString();
  const path = `/address/${address}`;
  return query.length > 0 ? `${path}?${query}` : path;
}
