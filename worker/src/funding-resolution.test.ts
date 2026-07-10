import { describe, expect, test } from "bun:test";

import { pickFundingSource } from "./funding-resolution";
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
): AlchemyTransfer {
  return {
    from,
    to: WALLET,
    value: 100,
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

describe("pickFundingSource", () => {
  test("skips CEX and picks next most recent EOA", () => {
    const source = pickFundingSource(WALLET, 200, [
      transfer(EOA_A, 100, "0xaaa"),
      transfer(BINANCE, 150, "0xbbb"),
      transfer(EOA_B, 120, "0xccc"),
    ]);
    expect(source).toBe(EOA_B);
  });

  test("skips Bridge2 infra", () => {
    const source = pickFundingSource(WALLET, 200, [
      transfer(BRIDGE2, 180, "0xddd"),
      transfer(EOA_A, 100, "0xeee"),
    ]);
    expect(source).toBe(EOA_A);
  });

  test("falls back to self when only denylisted funders exist", () => {
    const source = pickFundingSource(WALLET, 200, [
      transfer(BINANCE, 150, "0xfff"),
      transfer(BRIDGE2, 160, "0x111"),
    ]);
    expect(source).toBe(WALLET);
  });

  test("still prefers most recent non-denylisted EOA", () => {
    const source = pickFundingSource(WALLET, 200, [
      transfer(EOA_A, 100, "0x222"),
      transfer(EOA_B, 180, "0x333"),
    ]);
    expect(source).toBe(EOA_B);
  });
});
