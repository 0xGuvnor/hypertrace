import { describe, expect, test } from "bun:test";

import {
  attachOpenedAtToPositions,
  resolvePositionOpenedAt,
  type FillForOpenedAt,
} from "./positionOpenedAt";

const OPEN_TIME = 1_700_000_000_000;
const ADD_TIME = 1_700_000_100_000;
const FLIP_TIME = 1_700_000_200_000;

function fill(
  partial: Partial<FillForOpenedAt> &
    Pick<FillForOpenedAt, "time" | "side" | "sz">,
): FillForOpenedAt {
  return {
    coin: "BTC",
    ...partial,
  };
}

describe("resolvePositionOpenedAt", () => {
  test("finds Open Long via dir among later adds", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        time: ADD_TIME,
        side: "B",
        sz: "0.1",
        startPosition: "1",
        dir: "Add Long",
      }),
      fill({
        time: OPEN_TIME,
        side: "B",
        sz: "1",
        startPosition: "0",
        dir: "Open Long",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "long", fills)).toBe(OPEN_TIME);
  });

  test("finds open from flat via startPosition without dir", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        time: ADD_TIME,
        side: "B",
        sz: "0.2",
        startPosition: "1",
      }),
      fill({
        time: OPEN_TIME,
        side: "B",
        sz: "1",
        startPosition: "0",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "long", fills)).toBe(OPEN_TIME);
  });

  test("finds flip into long as open", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        time: ADD_TIME,
        side: "B",
        sz: "0.1",
        startPosition: "0.5",
        dir: "Add Long",
      }),
      fill({
        time: FLIP_TIME,
        side: "B",
        sz: "1.5",
        startPosition: "-1",
        dir: "Close Short",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "long", fills)).toBe(FLIP_TIME);
  });

  test("returns null when open is outside the fill window", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        time: ADD_TIME,
        side: "B",
        sz: "0.1",
        startPosition: "2",
        dir: "Add Long",
      }),
      fill({
        time: OPEN_TIME,
        side: "B",
        sz: "0.2",
        startPosition: "1.8",
        dir: "Add Long",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "long", fills)).toBeNull();
  });

  test("ignores spot Buy/Sell fills", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        coin: "BTC",
        time: ADD_TIME,
        side: "B",
        sz: "1",
        dir: "Buy",
        startPosition: "0",
      }),
      fill({
        time: OPEN_TIME,
        side: "A",
        sz: "1",
        startPosition: "0",
        dir: "Open Short",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "short", fills)).toBe(OPEN_TIME);
  });

  test("uses the newest open when a prior cycle is also present", () => {
    const priorOpen = OPEN_TIME - 1_000_000;
    const fills: FillForOpenedAt[] = [
      fill({
        time: ADD_TIME,
        side: "B",
        sz: "0.1",
        startPosition: "1",
        dir: "Add Long",
      }),
      fill({
        time: OPEN_TIME,
        side: "B",
        sz: "1",
        startPosition: "0",
        dir: "Open Long",
      }),
      fill({
        time: OPEN_TIME - 500_000,
        side: "A",
        sz: "2",
        startPosition: "2",
        dir: "Close Long",
      }),
      fill({
        time: priorOpen,
        side: "B",
        sz: "2",
        startPosition: "0",
        dir: "Open Long",
      }),
    ];

    expect(resolvePositionOpenedAt("BTC", "long", fills)).toBe(OPEN_TIME);
  });
});

describe("attachOpenedAtToPositions", () => {
  test("attaches openedAt per coin", () => {
    const fills: FillForOpenedAt[] = [
      fill({
        time: OPEN_TIME,
        side: "B",
        sz: "1",
        startPosition: "0",
        dir: "Open Long",
      }),
      fill({
        coin: "ETH",
        time: FLIP_TIME,
        side: "A",
        sz: "2",
        startPosition: "0",
        dir: "Open Short",
      }),
    ];

    const attached = attachOpenedAtToPositions(
      [
        { coin: "BTC", side: "long" as const },
        { coin: "ETH", side: "short" as const },
        { coin: "SOL", side: "long" as const },
      ],
      fills,
    );

    expect(attached).toEqual([
      { coin: "BTC", side: "long", openedAt: OPEN_TIME },
      { coin: "ETH", side: "short", openedAt: FLIP_TIME },
      { coin: "SOL", side: "long", openedAt: null },
    ]);
  });
});
