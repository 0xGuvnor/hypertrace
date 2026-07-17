"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

import { TablePagination } from "@/components/table-pagination";
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
import { formatSignedPercent, formatUsd, formatSize } from "@/lib/format";
import { formatPositionAge } from "@/lib/position-age";
import { positionUnrealizedPnlPercent } from "@/lib/position-roe";
import {
  fundingFeeClass,
  PNL_NEGATIVE_BADGE,
  PNL_NEGATIVE_TEXT,
  PNL_POSITIVE_BADGE,
  PNL_POSITIVE_TEXT,
  signedNumberClass,
  unrealizedPnlClass,
} from "@/lib/pnl-tone";
import {
  summarizeOpenPositions,
  type PositionsOpenSummary,
} from "@/lib/positions-summary";
import { paginateItems } from "@/lib/table-page";
import type { WalletSnapshot } from "@/lib/wallet-types";
import type { PositionsSortKey, WalletSortOrder } from "@/lib/wallet-view";

type Position = WalletSnapshot["positions"][number];

function parseHlNumeric(value: string): number {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : Number.NEGATIVE_INFINITY;
}

function comparePositions(
  a: Position,
  b: Position,
  sortKey: PositionsSortKey,
  sortDir: WalletSortOrder,
): number {
  const aVal = parseHlNumeric(a[sortKey]);
  const bVal = parseHlNumeric(b[sortKey]);
  const diff = sortDir === "asc" ? aVal - bVal : bVal - aVal;
  if (diff !== 0) return diff;
  return a.coin.localeCompare(b.coin);
}

function PositionsSummaryBar({ summary }: { summary: PositionsOpenSummary }) {
  return (
    <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Long</span>
          <span
            className={`font-mono text-xs tabular-nums ${PNL_POSITIVE_TEXT}`}
          >
            {formatUsd(summary.longValue)}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-muted-foreground text-xs">Short</span>
          <span
            className={`font-mono text-xs tabular-nums ${PNL_NEGATIVE_TEXT}`}
          >
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
  sortKey: PositionsSortKey;
  activeSortKey: PositionsSortKey;
  sortDir: WalletSortOrder;
  onSort: (key: PositionsSortKey) => void;
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

function PositionsTablePaged({
  positions,
  sortKey,
  sortDir,
  onSort,
}: {
  positions: WalletSnapshot["positions"];
  sortKey: PositionsSortKey;
  sortDir: WalletSortOrder;
  onSort: (key: PositionsSortKey) => void;
}) {
  const [page, setPage] = useState(0);

  const sortedPositions = useMemo(
    () =>
      [...positions].sort((a, b) => comparePositions(a, b, sortKey, sortDir)),
    [positions, sortKey, sortDir],
  );

  const summary = useMemo(
    () => summarizeOpenPositions(positions),
    [positions],
  );

  const {
    page: currentPage,
    pageItems,
    pageCount,
    rangeStart,
    rangeEnd,
    showPagination,
  } = paginateItems(sortedPositions, page);

  return (
    <div className="flex flex-col gap-3">
      <Table leading={<PositionsSummaryBar summary={summary} />}>
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
              onSort={onSort}
            />
            <TableHead className="text-right">Entry</TableHead>
            <TableHead className="text-right">Age</TableHead>
            <TableHead className="text-right">Mark</TableHead>
            <TableHead className="text-right">Liq. price</TableHead>
            <TableHead className="text-right">TP</TableHead>
            <TableHead className="text-right">SL</TableHead>
            <SortableTableHead
              label="Funding fee"
              sortKey="fundingFee"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortableTableHead
              label="uPnL"
              sortKey="unrealizedPnl"
              activeSortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((position) => {
            const isLong = position.side === "long";
            const pct = positionUnrealizedPnlPercent(
              position.unrealizedPnl,
              position.marginUsed,
            );
            return (
              <TableRow key={position.coin}>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={isLong ? PNL_POSITIVE_BADGE : PNL_NEGATIVE_BADGE}
                  >
                    {position.coin}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-xs">{position.leverage}x</span>
                    <span className="text-muted-foreground text-xs">
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
                <TableCell className="text-muted-foreground text-right font-mono text-xs">
                  {position.openedAt != null
                    ? formatPositionAge(position.openedAt, Date.now())
                    : "—"}
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
                  <div className="flex flex-col items-end gap-0.5">
                    <span>{formatUsd(position.unrealizedPnl)}</span>
                    {pct != null && (
                      <span className="text-xs opacity-80">
                        ({formatSignedPercent(pct)})
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {showPagination && (
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={sortedPositions.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export function PositionsTable({
  positions,
  sortKey,
  sortDir,
  onSort,
}: {
  positions: WalletSnapshot["positions"];
  sortKey: PositionsSortKey;
  sortDir: WalletSortOrder;
  onSort: (key: PositionsSortKey) => void;
}) {
  const remountKey = useMemo(
    () =>
      `${positions.map((p) => p.coin).join("|")}:${sortKey}:${sortDir}`,
    [positions, sortKey, sortDir],
  );

  if (positions.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm text-pretty">
        No open perpetual positions.
      </p>
    );
  }

  return (
    <PositionsTablePaged
      key={remountKey}
      positions={positions}
      sortKey={sortKey}
      sortDir={sortDir}
      onSort={onSort}
    />
  );
}
