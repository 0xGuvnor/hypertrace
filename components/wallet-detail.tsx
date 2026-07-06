import Link from "next/link";

import { AddressWithTooltip } from "@/components/address-with-tooltip";
import { CopyAddressButton } from "@/components/copy-address-button";
import { LiveStatusBadge } from "@/components/live-status-badge";
import { WalletClusterCard } from "@/components/wallet-cluster-card";
import { WalletSummary } from "@/components/wallet-summary";
import { WalletTabs } from "@/components/wallet-tabs";
import type { WalletClusters, WalletDeposits } from "@/lib/cluster-types";
import type { LiveFeedStatus } from "@/lib/live-status";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletDetail({
  snapshot,
  feedStatus,
  statusNow,
  walletClusters,
  walletDeposits,
}: {
  snapshot: WalletSnapshot;
  feedStatus?: LiveFeedStatus;
  statusNow?: number;
  walletClusters: WalletClusters;
  walletDeposits: WalletDeposits;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
        >
          ← Back to search
        </Link>
        <div className="flex min-w-0 items-center gap-1">
          <AddressWithTooltip address={snapshot.address} />
          <CopyAddressButton address={snapshot.address} />
        </div>
        {feedStatus && statusNow !== undefined ? (
          <LiveStatusBadge status={feedStatus} now={statusNow} />
        ) : null}
      </div>

      {walletClusters.clusters.length > 0 ? (
        <WalletClusterCard
          walletClusters={walletClusters}
          walletAddress={snapshot.address}
        />
      ) : null}

      <WalletSummary account={snapshot.account} />
      <WalletTabs snapshot={snapshot} walletDeposits={walletDeposits} />
    </div>
  );
}
