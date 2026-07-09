import { describe, expect, test } from "bun:test";

import { parseLeaderboardResponse } from "./leaderboardParse";

const SAMPLE_ROW = {
  ethAddress: "0x85Ecf584F25dB6f146718b86d493e33C5AF72052",
  accountValue: "53766664.0309550017",
  displayName: "HyperTrader42",
  prize: 0,
  windowPerformances: [
    ["day", { pnl: "-213440.98", roi: "-0.0039", vlm: "1608229542.38" }],
    ["week", { pnl: "-1311185.49", roi: "-0.018", vlm: "13287851598.78" }],
    ["month", { pnl: "2974025.26", roi: "0.034", vlm: "37254845181.99" }],
    ["allTime", { pnl: "1234567.89", roi: "0.45", vlm: "98765432.10" }],
  ],
};

describe("parseLeaderboardResponse", () => {
  test("flattens camelCase leaderboardRows into typed upsert rows", () => {
    const { rows, skipped } = parseLeaderboardResponse({
      leaderboardRows: [SAMPLE_ROW],
    });

    expect(skipped).toBe(0);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual({
      address: "0x85ecf584f25db6f146718b86d493e33c5af72052",
      accountValue: 53766664.0309550017,
      pnlDay: -213440.98,
      pnlWeek: -1311185.49,
      pnlMonth: 2974025.26,
      pnlAllTime: 1234567.89,
      lastActivityTimestamp: null,
      displayName: "HyperTrader42",
    });
  });

  test("accepts snake_case keys from community SDKs", () => {
    const { rows, skipped } = parseLeaderboardResponse({
      leaderboard_rows: [
        {
          eth_address: "0xb6db1b4dc6244f86e482d834739d949d799e4da5",
          account_value: "100.5",
          display_name: null,
          window_performances: [
            ["day", { pnl: "1", roi: "0", vlm: "0" }],
            ["week", { pnl: "2", roi: "0", vlm: "0" }],
            ["month", { pnl: "3", roi: "0", vlm: "0" }],
            ["allTime", { pnl: "4", roi: "0", vlm: "0" }],
          ],
        },
      ],
    });

    expect(skipped).toBe(0);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.address).toBe(
      "0xb6db1b4dc6244f86e482d834739d949d799e4da5",
    );
    expect(rows[0]?.accountValue).toBe(100.5);
    expect(rows[0]?.pnlAllTime).toBe(4);
    expect(rows[0]?.displayName).toBeNull();
  });

  test("skips invalid rows and returns empty for bad payloads", () => {
    expect(parseLeaderboardResponse(null)).toEqual({ rows: [], skipped: 0 });
    expect(parseLeaderboardResponse({})).toEqual({ rows: [], skipped: 0 });

    const { rows, skipped } = parseLeaderboardResponse({
      leaderboardRows: [
        SAMPLE_ROW,
        { ethAddress: "not-an-address", accountValue: "1" },
        {
          ethAddress: "0x0000000000000000000000000000000000000001",
          accountValue: "1",
          windowPerformances: [["day", { pnl: "1" }]],
        },
      ],
    });

    expect(rows).toHaveLength(1);
    expect(skipped).toBe(2);
  });

  test("dedupes duplicate addresses keeping the last row", () => {
    const { rows, skipped } = parseLeaderboardResponse({
      leaderboardRows: [
        SAMPLE_ROW,
        {
          ...SAMPLE_ROW,
          accountValue: "999",
          displayName: null,
        },
      ],
    });

    expect(skipped).toBe(0);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.accountValue).toBe(999);
    expect(rows[0]?.displayName).toBeNull();
  });
});
