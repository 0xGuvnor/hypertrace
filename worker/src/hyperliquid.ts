import type { WalletSnapshot } from "./types";

const HL_INFO_URL = "https://api.hyperliquid.xyz/info";

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
      leverage: { value: number };
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

async function postInfo<T>(body: Record<string, unknown>, attempt = 0): Promise<T> {
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

function classifyPositionTpsl(order: FrontendOpenOrder): "tp" | "sl" | null {
  if (!order.isPositionTpsl) return null;
  const orderType = order.orderType.toLowerCase();
  if (orderType.includes("take profit")) return "tp";
  if (orderType.includes("stop")) return "sl";
  return null;
}

export async function fetchWalletSnapshot(address: string): Promise<WalletSnapshot> {
  const [clearinghouse, fills, rawOpenOrders] = await Promise.all([
    postInfo<ClearinghouseState>({ type: "clearinghouseState", user: address }),
    postInfo<UserFill[]>({ type: "userFills", user: address }),
    postInfo<FrontendOpenOrder[]>({ type: "frontendOpenOrders", user: address }),
  ]);

  const positions = clearinghouse.assetPositions
    .map(({ position }) => {
      const sizeNum = Number.parseFloat(position.szi);
      if (!Number.isFinite(sizeNum) || sizeNum === 0) return null;

      return {
        coin: position.coin,
        side: sizeNum > 0 ? ("long" as const) : ("short" as const),
        size: Math.abs(sizeNum).toString(),
        entryPrice: position.entryPx,
        unrealizedPnl: position.unrealizedPnl,
        liquidationPrice: position.liquidationPx,
        leverage: position.leverage.value,
        marginUsed: position.marginUsed,
        value: position.positionValue,
        fundingFee: fundingFeeFromCumFunding(position.cumFunding.sinceOpen),
        takeProfitPrice: null as string | null,
        stopLossPrice: null as string | null,
      };
    })
    .filter((position): position is NonNullable<typeof position> => position !== null);

  const tpslByCoin = new Map<
    string,
    { takeProfitPrice?: string; stopLossPrice?: string }
  >();

  for (const order of rawOpenOrders) {
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

  const positionsWithTpsl = positions.map((position) => {
    const tpsl = tpslByCoin.get(position.coin);
    return {
      ...position,
      takeProfitPrice: tpsl?.takeProfitPrice ?? null,
      stopLossPrice: tpsl?.stopLossPrice ?? null,
    };
  });

  const openOrders = rawOpenOrders.map((order) => ({
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

  const recentFills = [...fills]
    .sort((a, b) => b.time - a.time)
    .map((fill) => ({
      coin: fill.coin,
      side: fill.side === "B" ? ("buy" as const) : ("sell" as const),
      size: fill.sz,
      price: fill.px,
      timestamp: fill.time,
      hash: fill.hash,
    }));

  return {
    address,
    fetchedAt: Date.now(),
    account: {
      accountValue: clearinghouse.marginSummary.accountValue,
      totalMarginUsed: clearinghouse.marginSummary.totalMarginUsed,
      withdrawable: clearinghouse.withdrawable,
    },
    positions: positionsWithTpsl,
    openOrders,
    recentFills,
  };
}
