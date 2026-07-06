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
  blockNumber?: number;
};

export type WalletClusters = {
  primaryClusterId: string | null;
  clusters: Cluster[];
};
