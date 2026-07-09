"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
import type { WalletSnapshot } from "@/lib/wallet-types";

type SortDir = "asc" | "desc";

type SpotHolding = NonNullable<WalletSnapshot["spotBalances"]>[number];

function parseHlNumeric(value: string): number {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : Number.NEGATIVE_INFINITY;
}

function compareHoldings(
  a: SpotHolding,
  b: SpotHolding,
  sortDir: SortDir,
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
  sortDir: SortDir;
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

export function SpotHoldingsTable({
  holdings = [],
}: {
  holdings?: NonNullable<WalletSnapshot["spotBalances"]>;
}) {
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedHoldings = useMemo(
    () => [...holdings].sort((a, b) => compareHoldings(a, b, sortDir)),
    [holdings, sortDir],
  );

  function handleSort() {
    setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
  }

  if (holdings.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No spot holdings.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <SortableValueHead sortDir={sortDir} onSort={handleSort} />
          <TableHead className="text-right">Hold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedHoldings.map((holding) => (
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
              {formatUsd(holding.value)}
            </TableCell>
            <TableCell className="text-right font-mono text-xs">
              {formatSize(holding.hold)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
