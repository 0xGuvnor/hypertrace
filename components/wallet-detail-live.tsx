"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { WalletDetail } from "@/components/wallet-detail";
import { api } from "@/convex/_generated/api";
import { deriveLiveFeedStatus } from "@/lib/live-status";
import type { WalletSnapshot } from "@/lib/wallet-types";

type WalletDetailLiveProps = {
  address: string;
  initialSnapshot: WalletSnapshot;
};

const STATUS_TICK_MS = 10_000;

export function WalletDetailLive({
  address,
  initialSnapshot,
}: WalletDetailLiveProps) {
  const requestWatch = useMutation(api.watches.request);
  const liveSnapshot = useQuery(api.wallets.getLiveSnapshot, { address });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    void requestWatch({ address });
    const heartbeat = setInterval(() => {
      void requestWatch({ address });
    }, 60 * 60 * 1000);
    return () => clearInterval(heartbeat);
  }, [address, requestWatch]);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), STATUS_TICK_MS);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (liveSnapshot?.updatedAt) {
      setNow(Date.now());
    }
  }, [liveSnapshot?.updatedAt]);

  const snapshot = liveSnapshot ?? initialSnapshot;
  const feedStatus = deriveLiveFeedStatus(
    liveSnapshot,
    now,
    initialSnapshot.fetchedAt,
  );

  return (
    <WalletDetail snapshot={snapshot} feedStatus={feedStatus} statusNow={now} />
  );
}
