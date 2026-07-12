import { describe, expect, test } from "bun:test";

import { leaderboardScanPageSize } from "./leaderboardScan";

describe("leaderboardScanPageSize", () => {
  test("returns requested size when no post-filter", () => {
    expect(leaderboardScanPageSize(20, false)).toBe(20);
    expect(leaderboardScanPageSize(50, false)).toBe(50);
  });

  test("over-fetches with floor 100 and cap 500", () => {
    expect(leaderboardScanPageSize(1, true)).toBe(100);
    expect(leaderboardScanPageSize(2, true)).toBe(100);
    expect(leaderboardScanPageSize(20, true)).toBe(500);
    expect(leaderboardScanPageSize(11, true)).toBe(500);
  });
});
