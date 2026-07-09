import { describe, expect, test } from "bun:test";

import { summarizeOpenPositions } from "./positions-summary";

describe("summarizeOpenPositions", () => {
  test("sums mixed long and short positions", () => {
    expect(
      summarizeOpenPositions([
        {
          side: "long",
          value: "1000.5",
          fundingFee: "-10.25",
          unrealizedPnl: "50",
        },
        {
          side: "short",
          value: "400",
          fundingFee: "5.5",
          unrealizedPnl: "-20",
        },
        {
          side: "long",
          value: "200",
          fundingFee: "-1",
          unrealizedPnl: "-5",
        },
      ]),
    ).toEqual({
      longValue: 1200.5,
      shortValue: 400,
      totalValue: 1600.5,
      fundingFee: -5.75,
      unrealizedPnl: 25,
    });
  });

  test("long-only leaves shortValue at zero", () => {
    expect(
      summarizeOpenPositions([
        {
          side: "long",
          value: "500",
          fundingFee: "2",
          unrealizedPnl: "-3",
        },
      ]),
    ).toEqual({
      longValue: 500,
      shortValue: 0,
      totalValue: 500,
      fundingFee: 2,
      unrealizedPnl: -3,
    });
  });

  test("empty positions yield zeros", () => {
    expect(summarizeOpenPositions([])).toEqual({
      longValue: 0,
      shortValue: 0,
      totalValue: 0,
      fundingFee: 0,
      unrealizedPnl: 0,
    });
  });

  test("treats non-finite strings as zero", () => {
    expect(
      summarizeOpenPositions([
        {
          side: "long",
          value: "not-a-number",
          fundingFee: "",
          unrealizedPnl: "Infinity",
        },
        {
          side: "short",
          value: "100",
          fundingFee: "-4",
          unrealizedPnl: "1",
        },
      ]),
    ).toEqual({
      longValue: 0,
      shortValue: 100,
      totalValue: 100,
      fundingFee: -4,
      unrealizedPnl: 1,
    });
  });
});
