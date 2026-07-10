import { describe, expect, test } from "bun:test";

import { buildDepositSourceClusters } from "./depositClustering";
import {
  CLUSTER_SOURCE_FANOUT_CAP,
  isFundingDenylisted,
  MIN_CLUSTER_FUNDER_WEIGHT,
} from "./knownAddresses";

const BINANCE = "0x28c6c06298d514db089934071355e5743bf21d60";
const EOA = "0xcccccccccccccccccccccccccccccccccccccccc";
const EOA_A = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const EOA_B = "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const WALLET_1 = "0x1111111111111111111111111111111111111111";
const WALLET_2 = "0x2222222222222222222222222222222222222222";

describe("buildDepositSourceClusters denylist", () => {
  test("does not cluster on CEX sourceAddress", () => {
    expect(isFundingDenylisted(BINANCE)).toBe(true);
    const clusters = buildDepositSourceClusters([
      { hlAddress: WALLET_1, sourceAddress: BINANCE },
      { hlAddress: WALLET_2, sourceAddress: BINANCE },
    ]);
    expect(clusters).toEqual([]);
  });

  test("still clusters shared EOA funders", () => {
    const clusters = buildDepositSourceClusters([
      { hlAddress: WALLET_1, sourceAddress: EOA },
      { hlAddress: WALLET_2, sourceAddress: EOA },
    ]);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]?.sourceAddress).toBe(EOA);
    expect(clusters[0]?.memberAddresses).toHaveLength(2);
  });

  test("drops sources above fan-out cap", () => {
    const deposits = Array.from({ length: CLUSTER_SOURCE_FANOUT_CAP + 1 }, (_, i) => {
      const n = (i + 1).toString(16).padStart(40, "0");
      return {
        hlAddress: `0x${n}`,
        sourceAddress: EOA,
      };
    });
    expect(buildDepositSourceClusters(deposits)).toEqual([]);
  });

  test("skips self-sourced rows", () => {
    const wallet = "0xdddddddddddddddddddddddddddddddddddddddd";
    const clusters = buildDepositSourceClusters([
      { hlAddress: wallet, sourceAddress: wallet },
      { hlAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", sourceAddress: wallet },
    ]);
    expect(clusters).toEqual([]);
  });
});

describe("buildDepositSourceClusters multi-funder", () => {
  test("emits edges for each funder above weight floor", () => {
    const clusters = buildDepositSourceClusters([
      {
        hlAddress: WALLET_1,
        sourceAddress: EOA_B,
        funders: [
          { address: EOA_B, amount: 200, weight: 0.57 },
          { address: EOA_A, amount: 150, weight: 0.43 },
        ],
      },
      {
        hlAddress: WALLET_2,
        sourceAddress: EOA_A,
        funders: [
          { address: EOA_A, amount: 100, weight: 1 },
        ],
      },
      {
        hlAddress: "0x3333333333333333333333333333333333333333",
        sourceAddress: EOA_B,
        funders: [
          { address: EOA_B, amount: 80, weight: 1 },
        ],
      },
    ]);
    const keys = clusters.map((c) => c.sourceAddress).sort();
    expect(keys).toEqual([EOA_A, EOA_B].sort());
  });

  test("ignores funders below MIN_CLUSTER_FUNDER_WEIGHT", () => {
    expect(MIN_CLUSTER_FUNDER_WEIGHT).toBe(0.15);
    const clusters = buildDepositSourceClusters([
      {
        hlAddress: WALLET_1,
        sourceAddress: EOA_A,
        funders: [
          { address: EOA_A, amount: 90, weight: 0.9 },
          { address: EOA_B, amount: 10, weight: 0.1 },
        ],
      },
      {
        hlAddress: WALLET_2,
        sourceAddress: EOA_B,
        funders: [{ address: EOA_B, amount: 50, weight: 1 }],
      },
    ]);
    expect(clusters.map((c) => c.sourceAddress)).toEqual([]);
  });

  test("falls back to sourceAddress when funders missing", () => {
    const clusters = buildDepositSourceClusters([
      { hlAddress: WALLET_1, sourceAddress: EOA },
      { hlAddress: WALLET_2, sourceAddress: EOA },
    ]);
    expect(clusters).toHaveLength(1);
  });
});
