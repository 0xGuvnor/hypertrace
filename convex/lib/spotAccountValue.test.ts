import { describe, expect, test } from "bun:test";

import {
  buildSpotHoldings,
  computeAccountValue,
  priceSpotBalances,
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

describe("buildSpotHoldings", () => {
  test("USDC row has markPrice 1 and value = total", () => {
    expect(
      buildSpotHoldings(
        [bal({ coin: "USDC", token: 0, total: "1500.5" })],
        emptySpotMeta,
      ),
    ).toEqual([
      {
        coin: "USDC",
        size: "1500.5",
        hold: "0",
        markPrice: "1",
        value: "1500.5",
      },
    ]);
  });

  test("priced ETH row", () => {
    expect(
      buildSpotHoldings(
        [bal({ coin: "ETH", token: 1, total: "2" })],
        emptySpotMeta,
      ),
    ).toEqual([
      {
        coin: "ETH",
        size: "2",
        hold: "0",
        markPrice: "2000",
        value: "4000",
      },
    ]);
  });

  test("unpriceable still listed with value 0", () => {
    expect(
      buildSpotHoldings(
        [bal({ coin: "UNKNOWN", token: 99, total: "1000" })],
        emptySpotMeta,
      ),
    ).toEqual([
      {
        coin: "UNKNOWN",
        size: "1000",
        hold: "0",
        markPrice: null,
        value: "0",
      },
    ]);
  });

  test("dust skipped", () => {
    expect(
      buildSpotHoldings(
        [
          bal({ coin: "USDC", token: 0, total: "0" }),
          bal({ coin: "ETH", token: 1, total: "-1" }),
          bal({ coin: "PURR", token: 2, total: "0.0" }),
        ],
        emptySpotMeta,
      ),
    ).toEqual([]);
  });

  test("sorted by value desc", () => {
    expect(
      buildSpotHoldings(
        [
          bal({ coin: "USDC", token: 0, total: "100" }),
          bal({ coin: "ETH", token: 1, total: "2" }),
          bal({ coin: "PURR", token: 2, total: "10" }),
        ],
        emptySpotMeta,
      ).map((h) => h.coin),
    ).toEqual(["ETH", "USDC", "PURR"]);
  });
});

describe("computeAccountValue", () => {
  test("unifiedAccount: priced spot only (already includes MTM)", () => {
    expect(
      computeAccountValue({
        userAbstraction: "unifiedAccount",
        spotValue: "1000",
        perpAccountValueSum: "99999",
      }),
    ).toBe("1000");
  });

  test("portfolioMargin: same as unified", () => {
    expect(
      computeAccountValue({
        userAbstraction: "portfolioMargin",
        spotValue: "1000",
        perpAccountValueSum: "99999",
      }),
    ).toBe("1000");
  });

  test("default: perp accountValue + spot", () => {
    expect(
      computeAccountValue({
        userAbstraction: "default",
        spotValue: "100",
        perpAccountValueSum: "500",
      }),
    ).toBe("600");
  });

  test("disabled: perp accountValue + spot", () => {
    expect(
      computeAccountValue({
        userAbstraction: "disabled",
        spotValue: "100",
        perpAccountValueSum: "500",
      }),
    ).toBe("600");
  });
});
