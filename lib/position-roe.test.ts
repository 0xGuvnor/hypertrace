import { describe, expect, test } from "bun:test";

import { positionUnrealizedPnlPercent } from "./position-roe";

describe("positionUnrealizedPnlPercent", () => {
  test("positive ROE", () => {
    expect(positionUnrealizedPnlPercent("50", "400")).toBe(12.5);
  });

  test("negative ROE", () => {
    expect(positionUnrealizedPnlPercent("-25", "500")).toBe(-5);
  });

  test("zero margin returns null", () => {
    expect(positionUnrealizedPnlPercent("10", "0")).toBeNull();
  });

  test("invalid strings return null", () => {
    expect(positionUnrealizedPnlPercent("abc", "100")).toBeNull();
    expect(positionUnrealizedPnlPercent("10", "xyz")).toBeNull();
    expect(positionUnrealizedPnlPercent("", "")).toBeNull();
  });

  test("zero pnl returns 0", () => {
    expect(positionUnrealizedPnlPercent("0", "250")).toBe(0);
  });
});
