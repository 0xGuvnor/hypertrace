import { describe, expect, test } from "bun:test";

import {
  formatAccountAge,
  formatFirstActivityTimestamp,
} from "./account-age";

const NOW = Date.UTC(2026, 6, 9, 12, 0, 0);

describe("formatAccountAge", () => {
  test("formats under one hour", () => {
    expect(formatAccountAge(NOW - 30 * 60 * 1000, NOW)).toBe("<1h");
  });

  test("formats hours", () => {
    expect(formatAccountAge(NOW - 12 * 60 * 60 * 1000, NOW)).toBe("12h");
  });

  test("formats days", () => {
    expect(formatAccountAge(NOW - 3 * 24 * 60 * 60 * 1000, NOW)).toBe("3d");
  });

  test("formats months", () => {
    expect(formatAccountAge(NOW - 11 * 30 * 24 * 60 * 60 * 1000, NOW)).toBe(
      "11mo",
    );
  });

  test("formats years with months", () => {
    const elapsed =
      2 * 365 * 24 * 60 * 60 * 1000 + 4 * 30 * 24 * 60 * 60 * 1000;
    expect(formatAccountAge(NOW - elapsed, NOW)).toBe("2y 4mo");
  });

  test("formats whole years", () => {
    expect(formatAccountAge(NOW - 365 * 24 * 60 * 60 * 1000, NOW)).toBe("1y");
  });
});

describe("formatFirstActivityTimestamp", () => {
  test("includes year", () => {
    const formatted = formatFirstActivityTimestamp(
      Date.UTC(2024, 2, 12, 15, 41, 0),
    );
    expect(formatted).toContain("2024");
    expect(formatted).toContain("Mar");
  });
});
