import { describe, expect, test } from "bun:test";

import { buildDepositSourceClusters } from "./depositClustering";
import {
  CLUSTER_SOURCE_FANOUT_CAP,
  isFundingDenylisted,
} from "./knownAddresses";

const BINANCE = "0x28c6c06298d514db089934071355e5743bf21d60";
const EOA = "0xcccccccccccccccccccccccccccccccccccccccc";

describe("buildDepositSourceClusters denylist", () => {
  test("does not cluster on CEX sourceAddress", () => {
    expect(isFundingDenylisted(BINANCE)).toBe(true);
    const clusters = buildDepositSourceClusters([
      { hlAddress: "0x1111111111111111111111111111111111111111", sourceAddress: BINANCE },
      { hlAddress: "0x2222222222222222222222222222222222222222", sourceAddress: BINANCE },
    ]);
    expect(clusters).toEqual([]);
  });

  test("still clusters shared EOA funders", () => {
    const clusters = buildDepositSourceClusters([
      { hlAddress: "0x1111111111111111111111111111111111111111", sourceAddress: EOA },
      { hlAddress: "0x2222222222222222222222222222222222222222", sourceAddress: EOA },
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
