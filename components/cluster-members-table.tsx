import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateAddress } from "@/lib/address";
import type { Cluster } from "@/lib/cluster-types";

export function ClusterMembersTable({
  cluster,
  highlightAddress,
}: {
  cluster: Cluster;
  highlightAddress?: string;
}) {
  const normalizedHighlight = highlightAddress?.toLowerCase();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wallet</TableHead>
          <TableHead className="text-right">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cluster.memberAddresses.map((address) => {
          const isHighlighted =
            normalizedHighlight !== undefined &&
            address.toLowerCase() === normalizedHighlight;

          return (
            <TableRow
              key={address}
              className={isHighlighted ? "bg-[var(--brand-cyan)]/5" : undefined}
            >
              <TableCell>
                <Link
                  href={`/address/${address}`}
                  className="font-mono text-xs underline-offset-4 hover:text-[var(--brand-cyan)] hover:underline [text-decoration-thickness:from-font] [text-underline-position:from-font]"
                >
                  {truncateAddress(address, 6)}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {isHighlighted ? (
                  <Badge variant="default" className="text-xs">
                    This wallet
                  </Badge>
                ) : null}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
