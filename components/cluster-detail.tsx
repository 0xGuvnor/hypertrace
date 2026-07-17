import Link from "next/link";

import { ClusterMembersTable } from "@/components/cluster-members-table";
import { CopyAddressButton } from "@/components/copy-address-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { truncateAddress } from "@/lib/address";
import { formatBasis, formatConfidence } from "@/lib/cluster-labels";
import { arbiscanAddressUrl } from "@/lib/cluster-routes";
import type { Cluster } from "@/lib/cluster-types";
import { formatTimestamp } from "@/lib/format";

export function ClusterDetail({
  cluster,
  highlightAddress,
}: {
  cluster: Cluster;
  highlightAddress?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/clusters"
          className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
        >
          ← Back to clusters
        </Link>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Wallet cluster
        </h1>
        <p className="text-muted-foreground text-pretty text-sm leading-relaxed">
          {cluster.memberAddresses.length} wallets linked by shared funding
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground">Funding source</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex min-w-0 items-center gap-1">
              <Link
                href={arbiscanAddressUrl(cluster.sourceAddress)}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono text-sm underline-offset-4 hover:text-[var(--brand-cyan)] hover:underline [text-decoration-thickness:from-font] [text-underline-position:from-font]"
              >
                {truncateAddress(cluster.sourceAddress, 8)}
              </Link>
              <CopyAddressButton address={cluster.sourceAddress} />
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="font-mono text-lg font-medium tabular-nums">
              {formatConfidence(cluster.confidenceScore)}
            </p>
            <div className="flex flex-wrap gap-1">
              {cluster.basis.map((signal) => (
                <Badge key={signal} variant="secondary" className="text-xs">
                  {formatBasis(signal)}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground text-xs">
              Updated {formatTimestamp(cluster.lastUpdated)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="min-w-0">
        <h2 className="mb-3 text-sm font-medium">Member wallets</h2>
        <ClusterMembersTable
          cluster={cluster}
          highlightAddress={highlightAddress}
        />
      </div>
    </div>
  );
}
