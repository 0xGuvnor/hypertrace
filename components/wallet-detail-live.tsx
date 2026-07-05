"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";

import { WalletDetail } from "@/components/wallet-detail";
import { api } from "@/convex/_generated/api";
import type { WalletSnapshot } from "@/lib/wallet-types";

type WalletDetailLiveProps = {
  address: string;
  initialSnapshot: WalletSnapshot;
};

export function WalletDetailLive({
  address,
  initialSnapshot,
}: WalletDetailLiveProps) {
  const requestWatch = useMutation(api.watches.request);
  const liveSnapshot = useQuery(api.wallets.getLiveSnapshot, { address });

  useEffect(() => {
    void requestWatch({ address });
    const heartbeat = setInterval(() => {
      void requestWatch({ address });
    }, 60 * 60 * 1000);
    return () => clearInterval(heartbeat);
  }, [address, requestWatch]);

  const snapshot = liveSnapshot ?? initialSnapshot;
  const isLive = liveSnapshot !== null && liveSnapshot !== undefined;

  return <WalletDetail snapshot={snapshot} isLive={isLive} />;
}
