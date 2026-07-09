import { describe, expect, test } from "bun:test";

import { snapshotTradingEqual } from "./snapshotEqual";

const base = {
  account: {
    accountValue: "1000",
    totalMarginUsed: "100",
    withdrawable: "900",
  },
  positions: [
    {
      coin: "ETH",
      side: "long" as const,
      size: "1",
      entryPrice: "2000",
      markPrice: "2100",
      unrealizedPnl: "100",
      liquidationPrice: null,
      leverage: 5,
      marginMode: "cross" as const,
      marginUsed: "400",
      value: "2100",
      fundingFee: "0",
      takeProfitPrice: null,
      stopLossPrice: null,
    },
  ],
  openOrders: [] as unknown[],
  recentFills: [
    {
      coin: "ETH",
      side: "buy" as const,
      size: "1",
      price: "2000",
      timestamp: 1,
    },
  ],
};

describe("snapshotTradingEqual", () => {
  test("returns true when trading fields match", () => {
    expect(snapshotTradingEqual(base, structuredClone(base))).toBe(true);
  });

  test("returns false when a trading field differs", () => {
    const next = structuredClone(base);
    next.account.accountValue = "1001";
    expect(snapshotTradingEqual(base, next)).toBe(false);

    const fillsChanged = structuredClone(base);
    fillsChanged.recentFills[0]!.price = "2001";
    expect(snapshotTradingEqual(base, fillsChanged)).toBe(false);
  });
});
