"use client";

import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateAddress } from "@/lib/address";
import { formatUsd } from "@/lib/format";
import {
  type LeaderboardOrder,
  type LeaderboardRow,
  type LeaderboardSortBy,
  type LeaderboardTailStatus,
  type PnlWindow,
  PNL_WINDOW_LABELS,
  PNL_WINDOW_TO_SORT,
  VLM_WINDOW_TO_SORT,
  pnlValueForWindow,
  vlmValueForWindow,
} from "@/lib/leaderboard-list";
import { cn } from "@/lib/utils";

const SIBLING_WINDOWS: PnlWindow[] = ["day", "week", "month", "allTime"];

function pnlClass(value: number, emphasized: boolean): string {
  if (value > 0) {
    return emphasized
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-emerald-600/70 dark:text-emerald-400/70";
  }
  if (value < 0) {
    return emphasized
      ? "text-red-600 dark:text-red-400"
      : "text-red-600/70 dark:text-red-400/70";
  }
  return emphasized ? "text-foreground" : "text-muted-foreground";
}

function SortableTableHead({
  label,
  sortKey,
  activeSortKey,
  sortOrder,
  onSort,
  className,
}: {
  label: string;
  sortKey: LeaderboardSortBy;
  activeSortKey: LeaderboardSortBy;
  sortOrder: LeaderboardOrder;
  onSort: (key: LeaderboardSortBy) => void;
  className?: string;
}) {
  const isActive = activeSortKey === sortKey;
  const ariaSort = isActive
    ? sortOrder === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <TableHead className={cn("text-right", className)} aria-sort={ariaSort}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-mr-2 ml-auto h-7 gap-1 px-2 font-medium"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {isActive ? (
          sortOrder === "asc" ? (
            <ChevronUp className="size-3.5 opacity-70" />
          ) : (
            <ChevronDown className="size-3.5 opacity-70" />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </Button>
    </TableHead>
  );
}

function LeaderboardSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-16" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-14" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-14" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-3 w-12" />
      </TableCell>
    </TableRow>
  );
}

function LeaderboardTableHeader({
  pnlWindow,
  sortBy,
  sortOrder,
  onSort,
}: {
  pnlWindow: PnlWindow;
  sortBy: LeaderboardSortBy;
  sortOrder: LeaderboardOrder;
  onSort: (key: LeaderboardSortBy) => void;
}) {
  const siblingWindows = SIBLING_WINDOWS.filter(
    (window) => window !== pnlWindow,
  );

  return (
    <TableHeader>
      <TableRow>
        <TableHead>Wallet</TableHead>
        <SortableTableHead
          label="Account value"
          sortKey="accountValue"
          activeSortKey={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <SortableTableHead
          label={`${PNL_WINDOW_LABELS[pnlWindow]} PnL`}
          sortKey={PNL_WINDOW_TO_SORT[pnlWindow]}
          activeSortKey={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          className="text-[var(--brand-cyan)]"
        />
        {siblingWindows.map((window) => (
          <TableHead
            key={`pnl-${window}`}
            className="text-muted-foreground text-right text-xs font-normal"
          >
            {PNL_WINDOW_LABELS[window]}
          </TableHead>
        ))}
        <SortableTableHead
          label={`${PNL_WINDOW_LABELS[pnlWindow]} Vol`}
          sortKey={VLM_WINDOW_TO_SORT[pnlWindow]}
          activeSortKey={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
          className="text-[var(--brand-cyan)]"
        />
        {siblingWindows.map((window) => (
          <TableHead
            key={`vlm-${window}`}
            className="text-muted-foreground text-right text-xs font-normal"
          >
            {PNL_WINDOW_LABELS[window]} Vol
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}

export function LeaderboardTable({
  rows,
  pnlWindow,
  sortBy,
  sortOrder,
  onSort,
  tail,
  sentinelRef,
}: {
  rows: LeaderboardRow[];
  pnlWindow: PnlWindow;
  sortBy: LeaderboardSortBy;
  sortOrder: LeaderboardOrder;
  onSort: (key: LeaderboardSortBy) => void;
  tail: LeaderboardTailStatus;
  sentinelRef: (node: Element | null) => void;
}) {
  if (rows.length === 0 && tail === "exhausted") {
    return (
      <p className="text-muted-foreground py-12 text-center text-sm leading-relaxed">
        No wallets match these filters. Lower the min account value or min
        volume.
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {tail === "loadingMore" ? (
          <Table>
            <TableBody>
              {Array.from({ length: 2 }).map((_, index) => (
                <LeaderboardSkeletonRow key={`ghost-${index}`} />
              ))}
            </TableBody>
          </Table>
        ) : null}
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      </div>
    );
  }

  const siblingWindows = SIBLING_WINDOWS.filter(
    (window) => window !== pnlWindow,
  );

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <LeaderboardTableHeader
          pnlWindow={pnlWindow}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <TableBody>
          {rows.map((row) => {
            const activePnl = pnlValueForWindow(row, pnlWindow);
            const activeVlm = vlmValueForWindow(row, pnlWindow);
            return (
              <TableRow key={row.address}>
                <TableCell>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    {row.displayName ? (
                      <span className="truncate text-sm font-medium">
                        {row.displayName}
                      </span>
                    ) : null}
                    <Link
                      href={`/address/${row.address}`}
                      className="font-mono text-xs hover:text-[var(--brand-cyan)] hover:underline"
                    >
                      {truncateAddress(row.address, 6)}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-xs tabular-nums">
                  {formatUsd(row.accountValue)}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono text-sm font-medium tabular-nums transition-opacity duration-150 motion-reduce:transition-none",
                    pnlClass(activePnl, true),
                  )}
                >
                  {formatUsd(activePnl)}
                </TableCell>
                {siblingWindows.map((window) => {
                  const value = pnlValueForWindow(row, window);
                  return (
                    <TableCell
                      key={`pnl-${window}`}
                      className={cn(
                        "text-right font-mono text-[11px] tabular-nums",
                        pnlClass(value, false),
                      )}
                    >
                      {formatUsd(value)}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right font-mono text-sm font-medium tabular-nums">
                  {formatUsd(activeVlm)}
                </TableCell>
                {siblingWindows.map((window) => {
                  const value = vlmValueForWindow(row, window);
                  return (
                    <TableCell
                      key={`vlm-${window}`}
                      className="text-muted-foreground text-right font-mono text-[11px] tabular-nums"
                    >
                      {formatUsd(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {tail === "loadingMore"
            ? Array.from({ length: 2 }).map((_, index) => (
                <LeaderboardSkeletonRow key={`ghost-${index}`} />
              ))
            : null}
        </TableBody>
      </Table>
      {tail !== "exhausted" ? (
        <div ref={sentinelRef} aria-hidden className="h-px w-full" />
      ) : null}
    </div>
  );
}
