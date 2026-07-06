import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { truncateAddress } from "@/lib/address";
import { formatBasis, formatConfidence } from "@/lib/cluster-labels";
import { clusterPath } from "@/lib/cluster-routes";
import type { WalletClusters } from "@/lib/cluster-types";

export function WalletClusterCard({
  walletClusters,
  walletAddress,
}: {
  walletClusters: WalletClusters;
  walletAddress: string;
}) {
  const { primaryClusterId, clusters } = walletClusters;
  if (clusters.length === 0) {
    return null;
  }

  const primary =
    clusters.find((cluster) => cluster.clusterKey === primaryClusterId) ??
    clusters[0];

  const secondary = clusters.filter(
    (cluster) => cluster.clusterKey !== primary.clusterKey,
  );

  return (
    <Card
      size="sm"
      className="border-[var(--brand-cyan)]/20 bg-[var(--brand-cyan)]/[0.04]"
    >
      <CardHeader>
        <CardTitle className="text-sm">Cluster membership</CardTitle>
        <CardDescription>
          Linked via shared Arbitrum funding source
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`${clusterPath(primary.clusterKey)}?from=${walletAddress}`}
            className="text-sm font-medium text-[var(--brand-cyan)] hover:underline"
          >
            {primary.memberAddresses.length} wallets share source{" "}
            <span className="font-mono">
              {truncateAddress(primary.sourceAddress, 4)}
            </span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            {formatConfidence(primary.confidenceScore)}
          </Badge>
          {primary.basis.map((signal) => (
            <Badge key={signal} variant="outline" className="text-xs">
              {formatBasis(signal)}
            </Badge>
          ))}
        </div>

        {secondary.length > 0 ? (
          <p className="text-muted-foreground text-xs">
            Also in {secondary.length} other cluster
            {secondary.length === 1 ? "" : "s"}:{" "}
            {secondary.map((cluster, index) => (
              <span key={cluster.clusterKey}>
                {index > 0 ? ", " : null}
                <Link
                  href={clusterPath(cluster.clusterKey)}
                  className="text-[var(--brand-cyan)] hover:underline"
                >
                  {cluster.memberAddresses.length} wallets
                </Link>
              </span>
            ))}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
