import type { WalletSnapshot } from "./types";
import { HlRequestQueue } from "./hl-request-queue";
import {
  computeAccountValue,
  parseUserAbstraction,
  priceSpotBalances,
  sumPerpUnrealizedPnl,
  sumUsdStrings,
  type SpotBalance,
  type SpotMetaAndAssetCtxs,
} from "./spotAccountValue";

const HL_INFO_URL = "https://api.hyperliquid.xyz/info";
const XYZ_DEX = "xyz";
export const RECENT_FILLS_CAP = 100;

type ClearinghouseState = {
  marginSummary: {
    accountValue: string;
    totalMarginUsed: string;
  };
  withdrawable: string;
  assetPositions: Array<{
    position: {
      coin: string;
      szi: string;
      entryPx: string;
      unrealizedPnl: string;
      liquidationPx: string | null;
      leverage: {
        type: "cross" | "isolated";
        value: number;
        rawUsd?: string;
      };
      marginUsed: string;
      positionValue: string;
      cumFunding: { sinceOpen: string };
    };
  }>;
};

type UserFill = {
  coin: string;
  px: string;
  sz: string;
  side: "B" | "A";
  time: number;
  hash?: string;
  liquidation?: {
    liquidatedUser: string;
    markPx: string;
    method: "market" | "backstop";
  };
};

type FrontendOpenOrder = {
  coin: string;
  side: "B" | "A";
  limitPx: string;
  sz: string;
  oid: number;
  timestamp: number;
  triggerCondition: string;
  isTrigger: boolean;
  triggerPx: string;
  isPositionTpsl: boolean;
  reduceOnly: boolean;
  orderType: string;
};

type MetaAndAssetCtxs = [
  { universe: Array<{ name: string }> },
  Array<{ markPx: string }>,
];

type SpotClearinghouseState = {
  balances: SpotBalance[];
};

type HyperliquidClientConfig = {
  metaCacheTtlMs: number;
  hlMaxConcurrency: number;
  hlMinRequestIntervalMs: number;
};

let hlQueue: HlRequestQueue | null = null;
let metaCacheTtlMs = 30_000;
let metaCache: {
  fetchedAt: number;
  default: MetaAndAssetCtxs;
  xyz: MetaAndAssetCtxs;
  spot: SpotMetaAndAssetCtxs;
} | null = null;

export function configureHyperliquid(config: HyperliquidClientConfig): void {
  hlQueue = new HlRequestQueue({
    maxConcurrency: config.hlMaxConcurrency,
    minIntervalMs: config.hlMinRequestIntervalMs,
  });
  metaCacheTtlMs = config.metaCacheTtlMs;
}

function getQueue(): HlRequestQueue {
  if (!hlQueue) {
    throw new Error("configureHyperliquid must be called before fetching snapshots");
  }
  return hlQueue;
}

async function postInfoOnce<T>(
  body: Record<string, unknown>,
  attempt = 0,
): Promise<T> {
  const response = await fetch(HL_INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429 && attempt < 3) {
    const backoffMs = 1000 * (attempt + 1);
    getQueue().notifyRateLimited(backoffMs);
    await new Promise((resolve) => setTimeout(resolve, backoffMs));
    return postInfoOnce(body, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`Hyperliquid API error (${response.status})`);
  }

  return (await response.json()) as T;
}

async function postInfo<T>(body: Record<string, unknown>): Promise<T> {
  return getQueue().run(() => postInfoOnce<T>(body));
}

async function fetchMetaAndAssetCtxs(): Promise<{
  default: MetaAndAssetCtxs;
  xyz: MetaAndAssetCtxs;
  spot: SpotMetaAndAssetCtxs;
}> {
  const now = Date.now();
  if (metaCache && now - metaCache.fetchedAt < metaCacheTtlMs) {
    return {
      default: metaCache.default,
      xyz: metaCache.xyz,
      spot: metaCache.spot,
    };
  }

  const [defaultMeta, xyzMeta, spotMeta] = await Promise.all([
    postInfo<MetaAndAssetCtxs>({ type: "metaAndAssetCtxs", dex: "" }),
    postInfo<MetaAndAssetCtxs>({ type: "metaAndAssetCtxs", dex: XYZ_DEX }),
    postInfo<SpotMetaAndAssetCtxs>({ type: "spotMetaAndAssetCtxs" }),
  ]);

  metaCache = {
    fetchedAt: now,
    default: defaultMeta,
    xyz: xyzMeta,
    spot: spotMeta,
  };

  return { default: defaultMeta, xyz: xyzMeta, spot: spotMeta };
}

function fundingFeeFromCumFunding(sinceOpen: string): string {
  const num = Number.parseFloat(sinceOpen);
  if (!Number.isFinite(num) || num === 0) return sinceOpen;
  return (-num).toString();
}

function parseTriggerPrice(triggerPx: string): string | null {
  const num = Number.parseFloat(triggerPx);
  if (Number.isNaN(num) || num === 0) return null;
  return triggerPx;
}

function classifyPositionTpsl(order: FrontendOpenOrder): "tp" | "sl" | null {
  if (!order.isPositionTpsl) return null;
  const orderType = order.orderType.toLowerCase();
  if (orderType.includes("take profit")) return "tp";
  if (orderType.includes("stop")) return "sl";
  return null;
}

function parseOpenOrders(
  orders: FrontendOpenOrder[],
): WalletSnapshot["openOrders"] {
  return orders.map((order) => ({
    coin: order.coin,
    side: order.side === "B" ? ("buy" as const) : ("sell" as const),
    orderType: order.orderType,
    size: order.sz,
    limitPrice: order.limitPx,
    triggerPrice: parseTriggerPrice(order.triggerPx),
    triggerCondition: order.triggerCondition,
    isTrigger: order.isTrigger,
    isPositionTpsl: order.isPositionTpsl,
    reduceOnly: order.reduceOnly,
    timestamp: order.timestamp,
    orderId: order.oid,
  }));
}

function attachTpslToPositions(
  positions: Array<Omit<WalletSnapshot["positions"][number], "takeProfitPrice" | "stopLossPrice">>,
  rawOrders: FrontendOpenOrder[],
): WalletSnapshot["positions"] {
  const tpslByCoin = new Map<
    string,
    { takeProfitPrice?: string; stopLossPrice?: string }
  >();

  for (const order of rawOrders) {
    const kind = classifyPositionTpsl(order);
    if (!kind) continue;

    const triggerPrice = parseTriggerPrice(order.triggerPx);
    if (!triggerPrice) continue;

    const entry = tpslByCoin.get(order.coin) ?? {};
    if (kind === "tp" && entry.takeProfitPrice === undefined) {
      entry.takeProfitPrice = triggerPrice;
    }
    if (kind === "sl" && entry.stopLossPrice === undefined) {
      entry.stopLossPrice = triggerPrice;
    }
    tpslByCoin.set(order.coin, entry);
  }

  return positions.map((position) => {
    const tpsl = tpslByCoin.get(position.coin);
    return {
      ...position,
      takeProfitPrice: tpsl?.takeProfitPrice ?? null,
      stopLossPrice: tpsl?.stopLossPrice ?? null,
    };
  });
}

function parseMarginMode(type: string): WalletSnapshot["positions"][number]["marginMode"] {
  if (type === "cross" || type === "isolated") return type;
  throw new Error(`Unknown Hyperliquid margin mode: ${type}`);
}

function buildMarkPriceByCoin(metaAndCtxs: MetaAndAssetCtxs): Map<string, string> {
  const [meta, ctxs] = metaAndCtxs;
  const markByCoin = new Map<string, string>();

  for (let i = 0; i < meta.universe.length; i++) {
    const name = meta.universe[i]?.name;
    const markPx = ctxs[i]?.markPx;
    if (name && markPx) {
      markByCoin.set(name, markPx);
    }
  }

  return markByCoin;
}

function mergeMarkPriceMaps(...maps: Map<string, string>[]): Map<string, string> {
  const merged = new Map<string, string>();
  for (const map of maps) {
    for (const [coin, mark] of map) {
      merged.set(coin, mark);
    }
  }
  return merged;
}

function parsePositions(
  assetPositions: ClearinghouseState["assetPositions"],
  markByCoin: Map<string, string>,
): Array<Omit<WalletSnapshot["positions"][number], "takeProfitPrice" | "stopLossPrice">> {
  return assetPositions
    .map(({ position }) => {
      const sizeNum = Number.parseFloat(position.szi);
      if (!Number.isFinite(sizeNum) || sizeNum === 0) return null;

      return {
        coin: position.coin,
        side: sizeNum > 0 ? ("long" as const) : ("short" as const),
        size: Math.abs(sizeNum).toString(),
        entryPrice: position.entryPx,
        markPrice: markByCoin.get(position.coin) ?? null,
        unrealizedPnl: position.unrealizedPnl,
        liquidationPrice: position.liquidationPx,
        leverage: position.leverage.value,
        marginMode: parseMarginMode(position.leverage.type),
        marginUsed: position.marginUsed,
        value: position.positionValue,
        fundingFee: fundingFeeFromCumFunding(position.cumFunding.sinceOpen),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

function isWalletLiquidationFill(fill: UserFill, walletAddress: string): boolean {
  if (!fill.liquidation) return false;
  return (
    fill.liquidation.liquidatedUser.toLowerCase() === walletAddress.toLowerCase()
  );
}

function parseFills(
  fills: UserFill[],
  walletAddress: string,
): WalletSnapshot["recentFills"] {
  return [...fills]
    .sort((a, b) => b.time - a.time)
    .slice(0, RECENT_FILLS_CAP)
    .map((fill) => {
      const parsed = {
        coin: fill.coin,
        side: fill.side === "B" ? ("buy" as const) : ("sell" as const),
        size: fill.sz,
        price: fill.px,
        timestamp: fill.time,
        hash: fill.hash,
      };
      if (isWalletLiquidationFill(fill, walletAddress)) {
        return { ...parsed, isLiquidation: true as const };
      }
      return parsed;
    });
}

export async function fetchWalletSnapshot(address: string): Promise<WalletSnapshot> {
  const [
    clearinghouseDefault,
    clearinghouseXyz,
    fills,
    ordersDefault,
    ordersXyz,
    meta,
    spotState,
    userAbstractionRaw,
  ] = await Promise.all([
    postInfo<ClearinghouseState>({
      type: "clearinghouseState",
      user: address,
      dex: "",
    }),
    postInfo<ClearinghouseState>({
      type: "clearinghouseState",
      user: address,
      dex: XYZ_DEX,
    }),
    postInfo<UserFill[]>({ type: "userFills", user: address }),
    postInfo<FrontendOpenOrder[]>({
      type: "frontendOpenOrders",
      user: address,
      dex: "",
    }),
    postInfo<FrontendOpenOrder[]>({
      type: "frontendOpenOrders",
      user: address,
      dex: XYZ_DEX,
    }),
    fetchMetaAndAssetCtxs(),
    postInfo<SpotClearinghouseState>({
      type: "spotClearinghouseState",
      user: address,
    }),
    postInfo<unknown>({
      type: "userAbstraction",
      user: address,
    }),
  ]);

  const markByCoin = mergeMarkPriceMaps(
    buildMarkPriceByCoin(meta.default),
    buildMarkPriceByCoin(meta.xyz),
  );
  const positions = [
    ...parsePositions(clearinghouseDefault.assetPositions, markByCoin),
    ...parsePositions(clearinghouseXyz.assetPositions, markByCoin),
  ];
  const rawOpenOrders = [...ordersDefault, ...ordersXyz];
  const openOrders = parseOpenOrders(rawOpenOrders);

  const spotValue = priceSpotBalances(spotState.balances, meta.spot);
  const perpAccountValueSum = sumUsdStrings(
    clearinghouseDefault.marginSummary.accountValue,
    clearinghouseXyz.marginSummary.accountValue,
  );
  const perpUnrealizedPnlSum = sumPerpUnrealizedPnl(
    clearinghouseDefault,
    clearinghouseXyz,
  );
  const accountValue = computeAccountValue({
    userAbstraction: parseUserAbstraction(userAbstractionRaw),
    spotValue,
    perpAccountValueSum,
    perpUnrealizedPnlSum,
  });

  return {
    address,
    fetchedAt: Date.now(),
    account: {
      accountValue,
      spotValue,
      totalMarginUsed: sumUsdStrings(
        clearinghouseDefault.marginSummary.totalMarginUsed,
        clearinghouseXyz.marginSummary.totalMarginUsed,
      ),
      withdrawable: sumUsdStrings(
        clearinghouseDefault.withdrawable,
        clearinghouseXyz.withdrawable,
      ),
    },
    positions: attachTpslToPositions(positions, rawOpenOrders),
    openOrders,
    recentFills: parseFills(fills, address),
  };
}
