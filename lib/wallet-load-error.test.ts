import { describe, expect, test } from "bun:test";

import {
  WALLET_LOAD_DEFAULT_MESSAGE,
  WALLET_RATE_LIMIT_MESSAGE,
  walletLoadUserMessage,
} from "./wallet-load-error";

describe("walletLoadUserMessage", () => {
  test("maps rate limit and 429 messages", () => {
    expect(walletLoadUserMessage(new Error("Hyperliquid rate limit reached"))).toBe(
      WALLET_RATE_LIMIT_MESSAGE,
    );
    expect(walletLoadUserMessage("HTTP 429 Too Many Requests")).toBe(
      WALLET_RATE_LIMIT_MESSAGE,
    );
  });

  test("maps Convex production-sanitized Server Error with Request ID", () => {
    expect(
      walletLoadUserMessage(
        new Error("[Request ID: bd8e794e63b90b93] Server Error"),
      ),
    ).toBe(WALLET_LOAD_DEFAULT_MESSAGE);
    expect(
      walletLoadUserMessage(new Error("Error details omitted in production")),
    ).toBe(WALLET_LOAD_DEFAULT_MESSAGE);
  });

  test("passes through specific messages and defaults empty errors", () => {
    expect(walletLoadUserMessage(new Error("Invalid wallet address"))).toBe(
      "Invalid wallet address",
    );
    expect(walletLoadUserMessage(null)).toBe(WALLET_LOAD_DEFAULT_MESSAGE);
  });
});
