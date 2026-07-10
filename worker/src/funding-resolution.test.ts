import { describe, expect, test } from "bun:test";

import {
  buildFundingAttribution,
  pickFundingSource,
} from "./funding-resolution";
import { isFundingDenylisted } from "./known-addresses";
import type { AlchemyTransfer } from "./alchemy-transfers";

const WALLET = "0xb6db1b4dc6244f86e482d834739d949d799e4da5";
const EOA_A = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const EOA_B = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const BINANCE = "0x28c6c06298d514db089934071355e5743bf21d60";
const BRIDGE2 = "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7";

function transfer(
  from: string,
  blockNum: number,
  hash: string,
  value = 100,
): AlchemyTransfer {
  return {
    from,
    to: WALLET,
    value,
    blockNum,
    hash,
    timestampMs: blockNum * 1000,
  };
}

describe("isFundingDenylisted", () => {
  test("flags Bridge2 and Binance hot wallet", () => {
    expect(isFundingDenylisted(BRIDGE2)).toBe(true);
    expect(isFundingDenylisted(BINANCE)).toBe(true);
    expect(isFundingDenylisted(EOA_A)).toBe(false);
  });
});

describe("buildFundingAttribution", () => {
  test("weights A=150 and B=200 with B as primary", () => {
    const attribution = buildFundingAttribution(WALLET, 200, [
      transfer(EOA_A, 100, "0xaaa", 150),
      transfer(EOA_B, 120, "0xbbb", 200),
    ]);
    expect(attribution.sourceAddress).toBe(EOA_B);
    expect(attribution.funders).toHaveLength(2);
    expect(attribution.funders[0]).toEqual({
      address: EOA_B,
      amount: 200,
      weight: 200 / 350,
    });
    expect(attribution.funders[1]).toEqual({
      address: EOA_A,
      amount: 150,
      weight: 150 / 350,
    });
  });

  test("skips CEX and aggregates remaining EOAs by amount", () => {
    const attribution = buildFundingAttribution(WALLET, 200, [
      transfer(EOA_A, 100, "0xaaa", 50),
      transfer(BINANCE, 150, "0xbbb", 10_000),
      transfer(EOA_B, 120, "0xccc", 80),
    ]);
    expect(attribution.sourceAddress).toBe(EOA_B);
    expect(attribution.funders.map((f) => f.address)).toEqual([EOA_B, EOA_A]);
  });

  test("skips Bridge2 infra", () => {
    const attribution = buildFundingAttribution(WALLET, 200, [
      transfer(BRIDGE2, 180, "0xddd", 500),
      transfer(EOA_A, 100, "0xeee", 40),
    ]);
    expect(attribution.sourceAddress).toBe(EOA_A);
    expect(attribution.funders).toEqual([
      { address: EOA_A, amount: 40, weight: 1 },
    ]);
  });

  test("falls back to self when only denylisted funders exist", () => {
    const attribution = buildFundingAttribution(WALLET, 200, [
      transfer(BINANCE, 150, "0xfff", 100),
      transfer(BRIDGE2, 160, "0x111", 100),
    ]);
    expect(attribution.sourceAddress).toBe(WALLET);
    expect(attribution.funders).toEqual([]);
  });

  test("sums multiple transfers from the same from", () => {
    const attribution = buildFundingAttribution(WALLET, 200, [
      transfer(EOA_A, 100, "0x222", 40),
      transfer(EOA_A, 110, "0x333", 60),
      transfer(EOA_B, 120, "0x444", 50),
    ]);
    expect(attribution.sourceAddress).toBe(EOA_A);
    expect(attribution.funders[0]?.amount).toBe(100);
    expect(attribution.funders[0]?.weight).toBeCloseTo(100 / 150);
  });

  test("pickFundingSource matches amount-weighted primary", () => {
    const source = pickFundingSource(WALLET, 200, [
      transfer(EOA_A, 180, "0x555", 10),
      transfer(EOA_B, 100, "0x666", 90),
    ]);
    expect(source).toBe(EOA_B);
  });
});
