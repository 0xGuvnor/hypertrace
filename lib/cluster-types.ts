export type Cluster = {
  clusterKey: string;
  sourceAddress: string;
  memberAddresses: string[];
  confidenceScore: number;
  basis: string[];
  lastUpdated: number;
};

export type Deposit = {
  hlAddress: string;
  sourceAddress: string;
  amount: number;
  timestamp: number;
  arbTxHash: string;
  logIndex: number;
  depositKey: string;
  direction: "deposit" | "withdrawal";
  blockNumber?: number;
};

export type WalletClusters = {
  primaryClusterId: string | null;
  clusters: Cluster[];
};

export type WalletDeposits = {
  deposits: Deposit[];
  hasMore: boolean;
};

function withDepositDirection(deposit: Omit<Deposit, "direction"> & { direction?: Deposit["direction"] }): Deposit {
  return {
    ...deposit,
    direction: deposit.direction ?? "deposit",
  };
}

/** Accept legacy listByWallet payloads that returned a bare Deposit[]. */
export function normalizeWalletDeposits(
  value: WalletDeposits | Deposit[] | null | undefined,
): WalletDeposits {
  if (value == null) {
    return { deposits: [], hasMore: false };
  }
  if (Array.isArray(value)) {
    return { deposits: value.map(withDepositDirection), hasMore: false };
  }
  return {
    deposits: value.deposits.map(withDepositDirection),
    hasMore: value.hasMore,
  };
}
