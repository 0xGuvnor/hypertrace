import { describe, expect, test } from "bun:test";

import {
  DEFAULT_LEADERBOARD_VIEW,
  leaderboardHref,
  leaderboardListArgsFromView,
  parseLeaderboardSearchParams,
  serializeLeaderboardSearchParams,
  type LeaderboardView,
} from "./leaderboard-list";

describe("parseLeaderboardSearchParams", () => {
  test("returns defaults for empty params", () => {
    expect(parseLeaderboardSearchParams({})).toEqual(DEFAULT_LEADERBOARD_VIEW);
    expect(parseLeaderboardSearchParams(new URLSearchParams())).toEqual(
      DEFAULT_LEADERBOARD_VIEW,
    );
  });

  test("parses a full filtered view", () => {
    expect(
      parseLeaderboardSearchParams({
        window: "month",
        sort: "pnlMonth",
        order: "asc",
        minAv: "100k",
        minVol: "positive",
      }),
    ).toEqual({
      pnlWindow: "month",
      sortBy: "pnlMonth",
      order: "asc",
      minAccountValueFilter: "100k",
      minVolumeFilter: "positive",
    });
  });

  test("falls back to defaults for invalid values", () => {
    expect(
      parseLeaderboardSearchParams({
        window: "year",
        sort: "notASort",
        order: "sideways",
        minAv: "50k",
        minVol: "zero",
      }),
    ).toEqual(DEFAULT_LEADERBOARD_VIEW);
  });

  test("uses the first value when a param is an array", () => {
    expect(
      parseLeaderboardSearchParams({
        window: ["week", "month"],
        sort: ["vlmWeek"],
      }),
    ).toEqual({
      ...DEFAULT_LEADERBOARD_VIEW,
      pnlWindow: "week",
      sortBy: "vlmWeek",
    });
  });
});

describe("serializeLeaderboardSearchParams", () => {
  test("omits defaults", () => {
    expect(serializeLeaderboardSearchParams(DEFAULT_LEADERBOARD_VIEW).toString()).toBe(
      "",
    );
  });

  test("writes only non-default fields", () => {
    const view: LeaderboardView = {
      pnlWindow: "month",
      sortBy: "pnlMonth",
      order: "desc",
      minAccountValueFilter: "100k",
      minVolumeFilter: "positive",
    };
    expect(serializeLeaderboardSearchParams(view).toString()).toBe(
      "window=month&sort=pnlMonth&minAv=100k&minVol=positive",
    );
  });

  test("includes order when ascending", () => {
    const view: LeaderboardView = {
      ...DEFAULT_LEADERBOARD_VIEW,
      order: "asc",
    };
    expect(serializeLeaderboardSearchParams(view).toString()).toBe("order=asc");
  });
});

describe("parse/serialize round-trip", () => {
  test("round-trips a non-default view", () => {
    const view: LeaderboardView = {
      pnlWindow: "allTime",
      sortBy: "accountValue",
      order: "asc",
      minAccountValueFilter: "1m",
      minVolumeFilter: "10m",
    };
    const params = serializeLeaderboardSearchParams(view);
    expect(parseLeaderboardSearchParams(params)).toEqual(view);
  });

  test("leaderboardHref uses clean path for defaults", () => {
    expect(leaderboardHref(DEFAULT_LEADERBOARD_VIEW)).toBe("/leaderboard");
    expect(
      leaderboardHref({
        ...DEFAULT_LEADERBOARD_VIEW,
        minAccountValueFilter: "100k",
      }),
    ).toBe("/leaderboard?minAv=100k");
  });
});

describe("leaderboardListArgsFromView", () => {
  test("omits volumeWindow when min volume is any", () => {
    expect(leaderboardListArgsFromView(DEFAULT_LEADERBOARD_VIEW)).toEqual({
      sortBy: "pnlDay",
      order: "desc",
    });
  });

  test("includes volumeWindow and thresholds for volume filters", () => {
    expect(
      leaderboardListArgsFromView({
        pnlWindow: "week",
        sortBy: "vlmWeek",
        order: "desc",
        minAccountValueFilter: "100k",
        minVolumeFilter: "positive",
      }),
    ).toEqual({
      sortBy: "vlmWeek",
      order: "desc",
      minAccountValue: 1e5,
      requirePositiveVolume: true,
      volumeWindow: "week",
    });
  });
});
