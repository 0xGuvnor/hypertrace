import { describe, expect, test } from "bun:test";

import {
  computeAccountValue,
  priceSpotBalances,
  sumPerpUnrealizedPnl,
  type SpotBalance,
  type SpotMetaAndAssetCtxs,
} from "./spotAccountValue";

const emptySpotMeta: SpotMetaAndAssetCtxs = [
  {
    tokens: [
      { name: "USDC", index: 0 },
      { name: "ETH", index: 1 },
      { name: "PURR", index: 2 },
    ],
    universe: [
      { name: "ETH/USDC", tokens: [1, 0] },
      { name: "PURR/USDC", tokens: [2, 0] },
    ],
  },
  [{ markPx: "2000" }, { markPx: "0.5" }],
];

function bal(
  partial: Pick<SpotBalance, "coin" | "token" | "total">,
): SpotBalance {
  return {
    hold: "0",
    entryNtl: "0",
    ...partial,
  };
}

describe("priceSpotBalances", () => {
  test("USDC-only balance prices to total", () => {
    expect(
      priceSpotBalances(
        [bal({ coin: "USDC", token: 0, total: "1500.5" })],
        emptySpotMeta,
      ),
    ).toBe("1500.5");
  });

  test("non-USDC with mark prices correctly", () => {
    expect(
      priceSpotBalances(
        [
          bal({ coin: "USDC", token: 0, total: "100" }),
          bal({ coin: "ETH", token: 1, total: "2" }),
          bal({ coin: "PURR", token: 2, total: "10" }),
        ],
        emptySpotMeta,
      ),
    ).toBe("4105");
  });

  test("dust / zero total skipped", () => {
    expect(
      priceSpotBalances(
        [
          bal({ coin: "USDC", token: 0, total: "0" }),
          bal({ coin: "ETH", token: 1, total: "-1" }),
          bal({ coin: "PURR", token: 2, total: "0.0" }),
        ],
        emptySpotMeta,
      ),
    ).toBe("0");
  });

  test("unpriceable token contributes 0 without throwing", () => {
    expect(
      priceSpotBalances(
        [
          bal({ coin: "USDC", token: 0, total: "50" }),
          bal({ coin: "UNKNOWN", token: 99, total: "1000" }),
        ],
        emptySpotMeta,
      ),
    ).toBe("50");
  });
});

describe("sumPerpUnrealizedPnl", () => {
  test("sums unrealized PnL across clearinghouses", () => {
    expect(
      sumPerpUnrealizedPnl(
        {
          assetPositions: [
            { position: { unrealizedPnl: "10" } },
            { position: { unrealizedPnl: "-3" } },
          ],
        },
        {
          assetPositions: [{ position: { unrealizedPnl: "5.5" } }],
        },
      ),
    ).toBe("12.5");
  });
});

describe("computeAccountValue", () => {
  test("unifiedAccount: spot + uPnL, not perp accountValue", () => {
    expect(
      computeAccountValue({
        userAbstraction: "unifiedAccount",
        spotValue: "1000",
        perpAccountValueSum: "99999",
        perpUnrealizedPnlSum: "250",
      }),
    ).toBe("1250");
  });

  test("portfolioMargin: same as unified", () => {
    expect(
      computeAccountValue({
        userAbstraction: "portfolioMargin",
        spotValue: "1000",
        perpAccountValueSum: "99999",
        perpUnrealizedPnlSum: "250",
      }),
    ).toBe("1250");
  });

  test("default: perp accountValue + spot", () => {
    expect(
      computeAccountValue({
        userAbstraction: "default",
        spotValue: "100",
        perpAccountValueSum: "500",
        perpUnrealizedPnlSum: "999",
      }),
    ).toBe("600");
  });

  test("disabled: perp accountValue + spot", () => {
    expect(
      computeAccountValue({
        userAbstraction: "disabled",
        spotValue: "100",
        perpAccountValueSum: "500",
        perpUnrealizedPnlSum: "999",
      }),
    ).toBe("600");
  });
});
