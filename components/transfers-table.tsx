"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
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
import { TRANSFER_SCAN_START_DATE_LABEL } from "@/lib/deposit-scan";
import type { Deposit, DepositFunder } from "@/lib/cluster-types";
import { formatTimestamp, formatUsd } from "@/lib/format";

function formatWeightPercent(weight: number): string {
  return `${Math.round(weight * 100)}%`;
}

function CounterpartyLink({
  address,
  suffix,
}: {
  address: string;
  suffix?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="cursor-default font-mono text-xs underline decoration-dotted decoration-muted-foreground underline-offset-4"
        render={
          <Link
            href={arbiscanAddressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--brand-cyan)]"
          />
        }
      >
        {truncateAddress(address, 4)}
        {suffix ? (
          <span className="text-muted-foreground ml-1 no-underline">
            {suffix}
          </span>
        ) : null}
      </TooltipTrigger>
      <TooltipContent className="max-w-none font-mono break-all">
        {address}
      </TooltipContent>
    </Tooltip>
  );
}

function CounterpartyCell({ transfer }: { transfer: Deposit }) {
  const funders = transfer.funders;
  if (funders && funders.length > 1) {
    return (
      <div className="flex flex-col gap-0.5">
        {funders.map((funder: DepositFunder) => (
          <CounterpartyLink
            key={funder.address}
            address={funder.address}
            suffix={formatWeightPercent(funder.weight)}
          />
        ))}
      </div>
    );
  }

  return <CounterpartyLink address={transfer.sourceAddress} />;
}

export function TransfersTable({
  transfers,
  hasMore = false,
}: {
  transfers: Deposit[];
  hasMore?: boolean;
}) {
  if (transfers.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm leading-relaxed">
        No bridge transfers on record for this wallet. Hypertrace scans Arbitrum
        bridge deposits and withdrawals from {TRANSFER_SCAN_START_DATE_LABEL}{" "}
        onward. Transfers appear once the wallet is watched and indexing
        completes.
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
              <TableHead>Direction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Counterparty</TableHead>
              <TableHead>Tx</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((transfer) => {
              const isDeposit = transfer.direction === "deposit";
              return (
                <TableRow key={transfer.depositKey}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {formatTimestamp(transfer.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={isDeposit ? "default" : "secondary"}
                      className={
                        isDeposit
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/15 text-red-400 border-red-500/20"
                      }
                    >
                      {isDeposit ? "In" : "Out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    {formatUsd(transfer.amount)}
                  </TableCell>
                  <TableCell>
                    <CounterpartyCell transfer={transfer} />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={arbiscanTxUrl(transfer.arbTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[var(--brand-cyan)] hover:underline"
                    >
                      {truncateAddress(transfer.arbTxHash, 4)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TooltipProvider>
      {hasMore ? (
        <p className="text-muted-foreground text-center text-xs">
          Showing 100 most recent transfers.
        </p>
      ) : null}
    </div>
  );
}
