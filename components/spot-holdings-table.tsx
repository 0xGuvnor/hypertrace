"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { ResponsiveHint } from "@/components/responsive-hint";
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
import { formatUsd, formatSize } from "@/lib/format";
import { paginateItems } from "@/lib/table-page";
import type { WalletSnapshot } from "@/lib/wallet-types";
import type { WalletSortOrder } from "@/lib/wallet-view";

const HOLD_HINT =
  "Amount locked in open spot orders or pending transactions. Available is Size minus Hold.";

type SpotHolding = NonNullable<WalletSnapshot["spotBalances"]>[number];

function parseHlNumeric(value: string): number {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : Number.NEGATIVE_INFINITY;
}

function compareHoldings(
  a: SpotHolding,
  b: SpotHolding,
  sortDir: WalletSortOrder,
): number {
  const aVal = parseHlNumeric(a.value);
  const bVal = parseHlNumeric(b.value);
  const diff = sortDir === "asc" ? aVal - bVal : bVal - aVal;
  if (diff !== 0) return diff;
  return a.coin.localeCompare(b.coin);
}

function SortableValueHead({
  sortDir,
  onSort,
}: {
  sortDir: WalletSortOrder;
  onSort: () => void;
}) {
  const ariaSort = sortDir === "asc" ? "ascending" : "descending";

  return (
    <TableHead className="text-right" aria-sort={ariaSort}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-mr-2 ml-auto h-7 gap-1 px-2 font-medium"
        onClick={onSort}
      >
        Value
        {sortDir === "asc" ? (
          <ChevronUp className="size-3.5 opacity-70" />
        ) : (
          <ChevronDown className="size-3.5 opacity-70" />
        )}
      </Button>
    </TableHead>
  );
}

function SpotHoldingsTablePaged({
  holdings,
  sortDir,
  onSort,
}: {
  holdings: NonNullable<WalletSnapshot["spotBalances"]>;
  sortDir: WalletSortOrder;
  onSort: () => void;
}) {
  const [page, setPage] = useState(0);

  const sortedHoldings = useMemo(
    () => [...holdings].sort((a, b) => compareHoldings(a, b, sortDir)),
    [holdings, sortDir],
  );

  const {
    page: currentPage,
    pageItems,
    pageCount,
    rangeStart,
    rangeEnd,
    showPagination,
  } = paginateItems(sortedHoldings, page);

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <SortableValueHead sortDir={sortDir} onSort={onSort} />
            <TableHead className="text-right">
              <div className="flex justify-end">
                <ResponsiveHint
                  label="Hold"
                  content={HOLD_HINT}
                  triggerClassName="font-medium"
                  contentClassName="max-w-[16rem] text-left font-normal"
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((holding) => (
            <TableRow key={holding.coin}>
              <TableCell>
                <Badge variant="outline" className="font-medium">
                  {holding.coin}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatSize(holding.size)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {holding.markPrice ? formatUsd(holding.markPrice) : "—"}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatUsd(holding.value)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatSize(holding.hold)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={sortedHoldings.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export function SpotHoldingsTable({
  holdings = [],
  sortDir,
  onSort,
}: {
  holdings?: NonNullable<WalletSnapshot["spotBalances"]>;
  sortDir: WalletSortOrder;
  onSort: () => void;
}) {
  const remountKey = useMemo(
    () => `${holdings.map((h) => h.coin).join("|")}:${sortDir}`,
    [holdings, sortDir],
  );

  if (holdings.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm text-pretty">
        No spot holdings.
      </p>
    );
  }

  return (
    <SpotHoldingsTablePaged
      key={remountKey}
      holdings={holdings}
      sortDir={sortDir}
      onSort={onSort}
    />
  );
}
