import { describe, expect, test } from "bun:test";

import { formatPositionAge } from "./position-age";

const NOW = Date.UTC(2026, 6, 13, 12, 0, 0);

describe("formatPositionAge", () => {
  test("formats under one minute", () => {
    expect(formatPositionAge(NOW - 20_000, NOW)).toBe("<1m");
  });

  test("formats minutes", () => {
    expect(formatPositionAge(NOW - 45 * 60 * 1000, NOW)).toBe("45m");
  });

  test("formats hours", () => {
    expect(formatPositionAge(NOW - 3 * 60 * 60 * 1000, NOW)).toBe("3h");
  });

  test("formats days", () => {
    expect(formatPositionAge(NOW - 2 * 24 * 60 * 60 * 1000, NOW)).toBe("2d");
  });
});
