import { describe, expect, test } from "bun:test";

import {
  DEFAULT_WALLET_VIEW,
  parseWalletSearchParams,
  serializeWalletSearchParams,
  walletHref,
  type WalletView,
} from "./wallet-view";

describe("parseWalletSearchParams", () => {
  test("returns defaults for empty params", () => {
    expect(parseWalletSearchParams({})).toEqual(DEFAULT_WALLET_VIEW);
    expect(parseWalletSearchParams(new URLSearchParams())).toEqual(
      DEFAULT_WALLET_VIEW,
    );
  });

  test("parses a full view", () => {
    expect(
      parseWalletSearchParams({
        tab: "transfers",
        sort: "fundingFee",
        order: "asc",
        spotOrder: "asc",
      }),
    ).toEqual({
      tab: "transfers",
      positionsSortKey: "fundingFee",
      positionsOrder: "asc",
      spotOrder: "asc",
    });
  });

  test("falls back to defaults for invalid values", () => {
    expect(
      parseWalletSearchParams({
        tab: "portfolio",
        sort: "size",
        order: "sideways",
        spotOrder: "random",
      }),
    ).toEqual(DEFAULT_WALLET_VIEW);
  });

  test("uses the first value when a param is an array", () => {
    expect(
      parseWalletSearchParams({
        tab: ["spot", "fills"],
        sort: ["unrealizedPnl"],
      }),
    ).toEqual({
      ...DEFAULT_WALLET_VIEW,
      tab: "spot",
      positionsSortKey: "unrealizedPnl",
    });
  });
});

describe("serializeWalletSearchParams", () => {
  test("omits defaults", () => {
    expect(serializeWalletSearchParams(DEFAULT_WALLET_VIEW).toString()).toBe(
      "",
    );
  });

  test("writes only non-default fields", () => {
    const view: WalletView = {
      tab: "transfers",
      positionsSortKey: "fundingFee",
      positionsOrder: "desc",
      spotOrder: "asc",
    };
    expect(serializeWalletSearchParams(view).toString()).toBe(
      "tab=transfers&sort=fundingFee&spotOrder=asc",
    );
  });

  test("includes positions order when ascending", () => {
    const view: WalletView = {
      ...DEFAULT_WALLET_VIEW,
      positionsOrder: "asc",
    };
    expect(serializeWalletSearchParams(view).toString()).toBe("order=asc");
  });
});

describe("parse/serialize round-trip", () => {
  test("round-trips a non-default view", () => {
    const view: WalletView = {
      tab: "spot",
      positionsSortKey: "unrealizedPnl",
      positionsOrder: "asc",
      spotOrder: "asc",
    };
    const params = serializeWalletSearchParams(view);
    expect(parseWalletSearchParams(params)).toEqual(view);
  });

  test("walletHref uses clean path for defaults", () => {
    const address = "0xabc123";
    expect(walletHref(address, DEFAULT_WALLET_VIEW)).toBe(
      `/address/${address}`,
    );
    expect(
      walletHref(address, {
        ...DEFAULT_WALLET_VIEW,
        tab: "fills",
      }),
    ).toBe(`/address/${address}?tab=fills`);
  });
});
