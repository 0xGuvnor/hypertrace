import { describe, expect, test } from "bun:test";

import {
  CCTP_MESSENGER_DEPOSIT_TOPIC,
  dedupeDepositsByKey,
  parseCctpMessengerDepositLog,
  parseFirstUint256,
  parseTransferLog,
  type ParsedDeposit,
} from "./arbitrum-deposits";

const WALLET = "0xb6db1b4dc6244f86e482d834739d949d799e4da5" as const;
const BRIDGE2 = "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7" as const;
const CCTP_EXTENSION = "0xa95d9c1f655341597c94393fddc30cf3c08e4fce" as const;
const MESSENGER = "0x28b5a0e9c621a5badaa536219b3a228c8168cf5d" as const;
const USDC = "0xaf88d065e77c8cc2239327c5edb3a432268e5831" as const;

const blockTimestamps = new Map<bigint, number>([
  [481_333_453n, 1_751_888_761_000],
  [481_234_890n, 1_751_864_433_000],
]);

describe("parseTransferLog", () => {
  test("parses Bridge2 direct deposit transfer", () => {
    const deposit = parseTransferLog(
      {
        blockNumber: 469_154_612n,
        data: "0x000000000000000000000000000000000000000000000000000048c272a0dc0",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          `0x000000000000000000000000${WALLET.slice(2)}`,
          `0x000000000000000000000000${BRIDGE2.slice(2)}`,
        ],
        transactionHash:
          "0x0425f8a608a2351f49ba02100e4a00fa1efe78560db07d8a7747b483f0397eba",
        logIndex: 0,
      },
      new Map([[469_154_612n, 1_750_524_495_000]]),
    );

    expect(deposit).not.toBeNull();
    expect(deposit?.hlAddress).toBe(WALLET);
    expect(deposit?.amount).toBe(4_999_999);
    expect(deposit?.depositKey).toBe(
      "0x0425f8a608a2351f49ba02100e4a00fa1efe78560db07d8a7747b483f0397eba:0",
    );
  });

  test("parses CctpExtension outbound transfer (Jul 3 user tx)", () => {
    const deposit = parseTransferLog(
      {
        blockNumber: 481_234_890n,
        data: "0x000000000000000000000000000000000000000000000000000000001bf15200",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
          `0x000000000000000000000000${WALLET.slice(2)}`,
          `0x000000000000000000000000${CCTP_EXTENSION.slice(2)}`,
        ],
        transactionHash:
          "0x3c3826fec2a48dc2038c216b8d54139bca56af344b587f261c5e6633d1a471b2",
        logIndex: 14,
      },
      blockTimestamps,
    );

    expect(deposit).not.toBeNull();
    expect(deposit?.hlAddress).toBe(WALLET);
    expect(deposit?.amount).toBe(468.8);
    expect(deposit?.depositKey).toBe(
      "0x3c3826fec2a48dc2038c216b8d54139bca56af344b587f261c5e6633d1a471b2:14",
    );
  });
});

describe("parseCctpMessengerDepositLog", () => {
  test("parses direct Token Messenger V2 deposit (Jul 7 user tx)", () => {
    const deposit = parseCctpMessengerDepositLog(
      {
        blockNumber: 481_333_453n,
        data: "0x0000000000000000000000000000000000000000000000000000000000fd24b00000000000000000000000000b21d281dedb17ae5b501f6aa8256fe38c4e45757000000000000000000000000000000000000000000000000000000000000001300000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d000000000000000000000000b21d281dedb17ae5b501f6aa8256fe38c4e457570000000000000000000000000000000000000000000000000000000000030d4000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000038636374702d666f72776172640000000000000000000000000000000000000018b6db1b4dc6244f86e482d834739d949d799e4da5000000000000000000000000",
        topics: [
          CCTP_MESSENGER_DEPOSIT_TOPIC,
          `0x000000000000000000000000${USDC.slice(2)}`,
          `0x000000000000000000000000${WALLET.slice(2)}`,
          "0x00000000000000000000000000000000000000000000000000000000000003e8",
        ],
        transactionHash:
          "0x29b8ba31630fe732761cf1448467f18146ab4b3bba20fc81e8489f82931f065a",
        logIndex: 12,
      },
      blockTimestamps,
      WALLET,
    );

    expect(deposit).not.toBeNull();
    expect(deposit?.hlAddress).toBe(WALLET);
    expect(deposit?.amount).toBe(16.59);
    expect(deposit?.depositKey).toBe(
      "0x29b8ba31630fe732761cf1448467f18146ab4b3bba20fc81e8489f82931f065a:12",
    );
    expect(deposit?.blockNumber).toBe(481_333_453);
  });

  test("rejects messenger log when depositor topic does not match wallet", () => {
    const deposit = parseCctpMessengerDepositLog(
      {
        blockNumber: 481_234_890n,
        data: "0x000000000000000000000000000000000000000000000000000000001bf15200",
        topics: [
          CCTP_MESSENGER_DEPOSIT_TOPIC,
          `0x000000000000000000000000${USDC.slice(2)}`,
          `0x000000000000000000000000${CCTP_EXTENSION.slice(2)}`,
          "0x00000000000000000000000000000000000000000000000000000000000003e8",
        ],
        transactionHash:
          "0x3c3826fec2a48dc2038c216b8d54139bca56af344b587f261c5e6633d1a471b2",
        logIndex: 19,
      },
      blockTimestamps,
      WALLET,
    );

    expect(deposit).toBeNull();
  });
});

describe("parseFirstUint256", () => {
  test("reads first word from messenger event data", () => {
    expect(parseFirstUint256("0x0000000000000000000000000000000000000000000000000000000000fd24b0")).toBe(
      16_590_000n,
    );
  });
});

describe("dedupeDepositsByKey", () => {
  test("keeps first deposit per depositKey", () => {
    const first: ParsedDeposit = {
      hlAddress: WALLET,
      sourceAddress: WALLET,
      amount: 1,
      timestamp: 1,
      arbTxHash: "0xabc",
      logIndex: 0,
      depositKey: "0xabc:0",
      blockNumber: 1,
    };
    const duplicate: ParsedDeposit = { ...first, amount: 2 };

    expect(dedupeDepositsByKey([first, duplicate])).toEqual([first]);
  });
});
