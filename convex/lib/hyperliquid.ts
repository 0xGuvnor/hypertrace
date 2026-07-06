import type { WalletSnapshot } from "./hyperliquidTypes";

const HL_INFO_URL = "https://api.hyperliquid.xyz/info";
const XYZ_DEX = "xyz";

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
      cumFunding: {
        sinceOpen: string;
      };
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

async function postInfo<T>(
  body: Record<string, unknown>,
  attempt = 0,
): Promise<T> {
  const response = await fetch(HL_INFO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (response.status === 429 && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    return postInfo(body, attempt + 1);
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Hyperliquid rate limit reached. Wait a moment and try again.",
      );
    }
    throw new Error(`Hyperliquid API error (${response.status})`);
  }

  return (await response.json()) as T;
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

function classifyPositionTpsl(
  order: FrontendOpenOrder,
): "tp" | "sl" | null {
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

function sumUsdStrings(...values: string[]): string {
  let sum = 0;
  for (const value of values) {
    const num = Number.parseFloat(value);
    if (Number.isFinite(num)) sum += num;
  }
  return sum.toString();
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

function parseFills(fills: UserFill[]): WalletSnapshot["recentFills"] {
  return [...fills]
    .sort((a, b) => b.time - a.time)
    .map((fill) => ({
      coin: fill.coin,
      side: fill.side === "B" ? ("buy" as const) : ("sell" as const),
      size: fill.sz,
      price: fill.px,
      timestamp: fill.time,
      hash: fill.hash,
    }));
}

export async function fetchWalletSnapshot(
  address: string,
): Promise<WalletSnapshot> {
  const [
    clearinghouseDefault,
    clearinghouseXyz,
    fills,
    ordersDefault,
    ordersXyz,
    metaDefault,
    metaXyz,
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
    postInfo<UserFill[]>({
      type: "userFills",
      user: address,
    }),
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
    postInfo<MetaAndAssetCtxs>({
      type: "metaAndAssetCtxs",
      dex: "",
    }),
    postInfo<MetaAndAssetCtxs>({
      type: "metaAndAssetCtxs",
      dex: XYZ_DEX,
    }),
  ]);

  const markByCoin = mergeMarkPriceMaps(
    buildMarkPriceByCoin(metaDefault),
    buildMarkPriceByCoin(metaXyz),
  );
  const positions = [
    ...parsePositions(clearinghouseDefault.assetPositions, markByCoin),
    ...parsePositions(clearinghouseXyz.assetPositions, markByCoin),
  ];
  const rawOpenOrders = [...ordersDefault, ...ordersXyz];
  const openOrders = parseOpenOrders(rawOpenOrders);

  return {
    address,
    fetchedAt: Date.now(),
    account: {
      accountValue: sumUsdStrings(
        clearinghouseDefault.marginSummary.accountValue,
        clearinghouseXyz.marginSummary.accountValue,
      ),
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
    recentFills: parseFills(fills),
  };
}
