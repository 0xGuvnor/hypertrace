"use client";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateAddress } from "@/lib/address";
import { arbiscanAddressUrl, arbiscanTxUrl } from "@/lib/cluster-routes";
import { DEPOSIT_SCAN_START_DATE_LABEL } from "@/lib/deposit-scan";
import type { Deposit } from "@/lib/cluster-types";
import { formatTimestamp, formatUsd } from "@/lib/format";

export function DepositsTable({
  deposits,
  hasMore = false,
}: {
  deposits: Deposit[];
  hasMore?: boolean;
}) {
  if (deposits.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm leading-relaxed">
        No bridge deposits on record for this wallet. Hypertrace scans Arbitrum
        bridge transfers from {DEPOSIT_SCAN_START_DATE_LABEL} onward. Deposits
        appear once the wallet is watched and indexing completes.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <TooltipProvider delay={500}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deposits.map((deposit) => (
              <TableRow key={deposit.depositKey}>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {formatTimestamp(deposit.timestamp)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatUsd(deposit.amount)}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger
                      className="cursor-default font-mono text-xs underline decoration-dotted decoration-muted-foreground underline-offset-4"
                      render={
                        <Link
                          href={arbiscanAddressUrl(deposit.sourceAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--brand-cyan)]"
                        />
                      }
                    >
                      {truncateAddress(deposit.sourceAddress, 4)}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-none font-mono break-all">
                      {deposit.sourceAddress}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Link
                    href={arbiscanTxUrl(deposit.arbTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-[var(--brand-cyan)] hover:underline"
                  >
                    {truncateAddress(deposit.arbTxHash, 4)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
      {hasMore ? (
        <p className="text-muted-foreground text-center text-xs">
          Showing 100 most recent deposits.
        </p>
      ) : null}
    </div>
  );
}
