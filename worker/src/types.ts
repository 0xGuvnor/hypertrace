export type WalletSnapshot = {
  address: string;
  fetchedAt: number;
  account: {
    accountValue: string;
    spotValue: string;
    totalMarginUsed: string;
    withdrawable: string;
  };
  positions: Array<{
    coin: string;
    side: "long" | "short";
    size: string;
    entryPrice: string;
    markPrice: string | null;
    unrealizedPnl: string;
    liquidationPrice: string | null;
    leverage: number;
    marginMode: "cross" | "isolated";
    marginUsed: string;
    value: string;
    fundingFee: string;
    takeProfitPrice: string | null;
    stopLossPrice: string | null;
  }>;
  openOrders: Array<{
    coin: string;
    side: "buy" | "sell";
    orderType: string;
    size: string;
    limitPrice: string;
    triggerPrice: string | null;
    triggerCondition: string;
    isTrigger: boolean;
    isPositionTpsl: boolean;
    reduceOnly: boolean;
    timestamp: number;
    orderId: number;
  }>;
  recentFills: Array<{
    coin: string;
    side: "buy" | "sell";
    size: string;
    price: string;
    timestamp: number;
    hash?: string;
    isLiquidation?: true;
  }>;
  spotBalances: Array<{
    coin: string;
    size: string;
    hold: string;
    markPrice: string | null;
    value: string;
  }>;
};

export type LeaderboardUpsertRow = {
  address: string;
  accountValue: number;
  pnlDay: number;
  pnlWeek: number;
  pnlMonth: number;
  pnlAllTime: number;
  vlmDay: number;
  vlmWeek: number;
  vlmMonth: number;
  vlmAllTime: number;
  displayName: string | null;
};

export type WorkerConfig = {
  convexSiteUrl: string;
  ingestSecret: string;
  hlWsUrl: string;
  watchPollMs: number;
  refreshDebounceMs: number;
  port: number;
  arbitrumRpcUrl: string;
  bridge2Address: `0x${string}`;
  cctpExtensionAddress: `0x${string}`;
  cctpTokenMessengerV2: `0x${string}`;
  usdcAddress: `0x${string}`;
  bridge2StartBlock: number;
  arbitrumLogChunkBlocks: number;
  depositScanConcurrency: number;
  fundingLookbackDays: number;
  snapshotStaleMs: number;
  metaCacheTtlMs: number;
  hlMaxConcurrency: number;
  hlMinRequestIntervalMs: number;
  hlWsMaxUsers: number;
  wsRefreshMinIntervalMs: number;
  leaderboardPollMs: number;
};

export const JUNE_1_2026_START_BLOCK = 468_748_168;

export type DepositFunder = {
  address: string;
  amount: number;
  weight: number;
};

export type DepositRow = {
  hlAddress: string;
  sourceAddress: string;
  amount: number;
  timestamp: number;
  arbTxHash: string;
  logIndex: number;
  depositKey: string;
  blockNumber: number;
  direction: "deposit" | "withdrawal";
  funders?: DepositFunder[];
};

export type DepositCursor = {
  hlAddress: string;
  lastScannedBlock: number;
};

export type DepositSourceUpdate = {
  depositKey: string;
  sourceAddress: string;
  funders?: DepositFunder[];
};

export type SelfSourcedDeposit = Omit<DepositRow, "blockNumber"> & {
  blockNumber?: number;
};
