export type WalletSnapshot = {
  address: string;
  fetchedAt: number;
  account: {
    accountValue: string;
    totalMarginUsed: string;
    withdrawable: string;
  };
  positions: Array<{
    coin: string;
    side: "long" | "short";
    size: string;
    entryPrice: string;
    unrealizedPnl: string;
    liquidationPrice: string | null;
    leverage: number;
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
  }>;
};

export type WorkerConfig = {
  convexSiteUrl: string;
  ingestSecret: string;
  hlWsUrl: string;
  watchPollMs: number;
  refreshDebounceMs: number;
  port: number;
};
