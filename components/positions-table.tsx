"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

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
import { formatUsd, formatSize } from "@/lib/format";
import {
  summarizeOpenPositions,
  type PositionsOpenSummary,
} from "@/lib/positions-summary";
import type { WalletSnapshot } from "@/lib/wallet-types";

type SortKey = "value" | "fundingFee" | "unrealizedPnl";
type SortDir = "asc" | "desc";

type Position = WalletSnapshot["positions"][number];

function parseHlNumeric(value: string): number {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : Number.NEGATIVE_INFINITY;
}

function comparePositions(
  a: Position,
  b: Position,
  sortKey: SortKey,
  sortDir: SortDir,
): number {
  const aVal = parseHlNumeric(a[sortKey]);
  const bVal = parseHlNumeric(b[sortKey]);
  const diff = sortDir === "asc" ? aVal - bVal : bVal - aVal;
  if (diff !== 0) return diff;
  return a.coin.localeCompare(b.coin);
}

function signedNumberClass(value: number): string {
  if (!Number.isFinite(value) || value === 0) return "";
  if (value < 0) return "text-red-600 dark:text-red-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function unrealizedPnlClass(value: string): string {
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num)) return "";
  if (num > 0) return "text-emerald-600 dark:text-emerald-400";
  if (num < 0) return "text-red-600 dark:text-red-400";
  return "";
}

function fundingFeeClass(value: string): string {
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num) || num === 0) return "";
  if (num < 0) return "text-red-600 dark:text-red-400";
  return "text-emerald-600 dark:text-emerald-400";
}

function PositionsSummaryBar({ summary }: { summary: PositionsOpenSummary }) {
  return (
    <div className="bg-muted/30 mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-1 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Long</span>
          <span className="font-mono text-xs tabular-nums text-emerald-600 dark:text-emerald-400">
            {formatUsd(summary.longValue)}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Short</span>
          <span className="font-mono text-xs tabular-nums text-red-600 dark:text-red-400">
            {formatUsd(summary.shortValue)}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Total</span>
          <span className="font-mono text-xs tabular-nums">
            {formatUsd(summary.totalValue)}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Funding</span>
          <span
            className={`font-mono text-xs tabular-nums ${signedNumberClass(summary.fundingFee)}`}
          >
            {formatUsd(summary.fundingFee)}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">uPnL</span>
          <span
            className={`font-mono text-xs tabular-nums ${signedNumberClass(summary.unrealizedPnl)}`}
          >
            {formatUsd(summary.unrealizedPnl)}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatMarginMode(mode: Position["marginMode"]): string {
  return mode === "cross" ? "Cross" : "Isolated";
}

function SortableTableHead({
  label,
  sortKey,
  activeSortKey,
  sortDir,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSortKey === sortKey;
  const ariaSort = isActive
    ? sortDir === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <TableHead className="text-right" aria-sort={ariaSort}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-mr-2 ml-auto h-7 gap-1 px-2 font-medium"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {isActive ? (
          sortDir === "asc" ? (
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

export function PositionsTable({
  positions,
}: {
  positions: WalletSnapshot["positions"];
}) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedPositions = useMemo(
    () =>
      [...positions].sort((a, b) => comparePositions(a, b, sortKey, sortDir)),
    [positions, sortKey, sortDir],
  );

  const summary = useMemo(
    () => summarizeOpenPositions(positions),
    [positions],
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("desc");
  }

  if (positions.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No open perpetual positions.
      </p>
    );
  }

  return (
    <div className="min-w-0">
      <PositionsSummaryBar summary={summary} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Leverage</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <SortableTableHead
              label="Value"
              sortKey="value"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Mark</TableHead>
            <TableHead className="text-right">Liq. price</TableHead>
            <TableHead className="text-right">TP</TableHead>
            <TableHead className="text-right">SL</TableHead>
            <SortableTableHead
              label="Funding fee"
              sortKey="fundingFee"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortableTableHead
              label="uPnL"
              sortKey="unrealizedPnl"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPositions.map((position) => {
            const isLong = position.side === "long";
            return (
              <TableRow key={position.coin}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      isLong
                        ? "border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
                        : "border-red-500/30 bg-red-500/10 font-medium text-red-700 dark:text-red-400"
                    }
                  >
                    {position.coin}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-xs">{position.leverage}x</span>
                    <span className="text-muted-foreground text-[10px]">
                      {formatMarginMode(position.marginMode)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatSize(position.size)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatUsd(position.value)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatUsd(position.entryPrice)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {position.markPrice ? formatUsd(position.markPrice) : "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {position.liquidationPrice
                    ? formatUsd(position.liquidationPrice)
                    : "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {position.takeProfitPrice
                    ? formatUsd(position.takeProfitPrice)
                    : "—"}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {position.stopLossPrice
                    ? formatUsd(position.stopLossPrice)
                    : "—"}
                </TableCell>
                <TableCell
                  className={`text-right font-mono text-xs ${fundingFeeClass(position.fundingFee)}`}
                >
                  {formatUsd(position.fundingFee)}
                </TableCell>
                <TableCell
                  className={`text-right font-mono text-xs ${unrealizedPnlClass(position.unrealizedPnl)}`}
                >
                  {formatUsd(position.unrealizedPnl)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
