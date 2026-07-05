import type { WalletSnapshot } from "./hyperliquidTypes";

const HL_INFO_URL = "https://api.hyperliquid.xyz/info";
const RECENT_FILLS_LIMIT = 20;

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

function parsePositions(
  assetPositions: ClearinghouseState["assetPositions"],
): WalletSnapshot["positions"] {
  return assetPositions
    .map(({ position }) => {
      const sizeNum = Number.parseFloat(position.szi);
      if (sizeNum === 0) return null;

      return {
        coin: position.coin,
        side: sizeNum > 0 ? ("long" as const) : ("short" as const),
        size: Math.abs(sizeNum).toString(),
        entryPrice: position.entryPx,
        unrealizedPnl: position.unrealizedPnl,
        liquidationPrice: position.liquidationPx,
        leverage: position.leverage.value,
        marginUsed: position.marginUsed,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);
}

function parseFills(fills: UserFill[]): WalletSnapshot["recentFills"] {
  return [...fills]
    .sort((a, b) => b.time - a.time)
    .slice(0, RECENT_FILLS_LIMIT)
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
  const clearinghouse = await postInfo<ClearinghouseState>({
    type: "clearinghouseState",
    user: address,
  });
  const fills = await postInfo<UserFill[]>({
    type: "userFills",
    user: address,
  });

  return {
    address,
    fetchedAt: Date.now(),
    account: {
      accountValue: clearinghouse.marginSummary.accountValue,
      totalMarginUsed: clearinghouse.marginSummary.totalMarginUsed,
      withdrawable: clearinghouse.withdrawable,
    },
    positions: parsePositions(clearinghouse.assetPositions),
    recentFills: parseFills(fills),
  };
}
