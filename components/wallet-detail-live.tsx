"use client";

import { Preloaded, useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { useEffect, useState } from "react";

import { WalletDetail } from "@/components/wallet-detail";
import { api } from "@/convex/_generated/api";
import { deriveLiveFeedStatus } from "@/lib/live-status";
import { normalizeWalletDeposits } from "@/lib/cluster-types";
import type { WalletSnapshot } from "@/lib/wallet-types";

type WalletDetailLiveProps = {
  address: string;
  initialSnapshot: WalletSnapshot;
  preloadedWalletClusters: Preloaded<typeof api.clusters.getForWallet>;
  preloadedDeposits: Preloaded<typeof api.deposits.listByWallet>;
};

const STATUS_TICK_MS = 10_000;

export function WalletDetailLive({
  address,
  initialSnapshot,
  preloadedWalletClusters,
  preloadedDeposits,
}: WalletDetailLiveProps) {
  const requestWatch = useMutation(api.watches.request);
  const liveSnapshot = useQuery(api.wallets.getLiveSnapshot, { address });
  const walletClusters = usePreloadedQuery(preloadedWalletClusters);
  const walletDeposits = normalizeWalletDeposits(usePreloadedQuery(preloadedDeposits));
  const [tick, setTick] = useState(() => Date.now());

  useEffect(() => {
    void requestWatch({ address });
    const heartbeat = setInterval(() => {
      void requestWatch({ address });
    }, 60 * 60 * 1000);
    return () => clearInterval(heartbeat);
  }, [address, requestWatch]);

  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  const statusNow = Math.max(tick, liveSnapshot?.updatedAt ?? 0);
  const snapshot = liveSnapshot ?? initialSnapshot;
  const feedStatus = deriveLiveFeedStatus(
    liveSnapshot,
    statusNow,
    initialSnapshot.fetchedAt,
  );

  return (
    <WalletDetail
      snapshot={snapshot}
      feedStatus={feedStatus}
      statusNow={statusNow}
      walletClusters={walletClusters}
      walletDeposits={walletDeposits}
    />
  );
}
