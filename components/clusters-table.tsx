import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateAddress } from "@/lib/address";
import { formatBasis, formatConfidence } from "@/lib/cluster-labels";
import { clusterPath } from "@/lib/cluster-routes";
import type { Cluster } from "@/lib/cluster-types";

export function ClustersTable({
  clusters,
  canLoadMore = false,
  isLoadingMore = false,
  onLoadMore,
}: {
  clusters: Cluster[];
  canLoadMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  if (clusters.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm leading-relaxed">
        No clusters detected yet. Clusters form when the same Arbitrum funding
        source bridges into two or more Hyperliquid wallets. Search a wallet to
        start deposit tracing, then check back after the clustering job runs.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Members</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Signal</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clusters.map((cluster) => (
            <TableRow key={cluster.clusterKey}>
              <TableCell>
                <Link
                  href={clusterPath(cluster.clusterKey)}
                  className="font-medium text-[var(--brand-cyan)] hover:underline"
                >
                  {cluster.memberAddresses.length} wallets
                </Link>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {truncateAddress(cluster.sourceAddress, 6)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {cluster.basis.map((signal) => (
                    <Badge key={signal} variant="secondary" className="text-xs">
                      {formatBasis(signal)}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatConfidence(cluster.confidenceScore)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {canLoadMore && onLoadMore ? (
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isLoadingMore}
          onClick={onLoadMore}
        >
          {isLoadingMore ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
