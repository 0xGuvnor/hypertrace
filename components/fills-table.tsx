"use client";

import { useEffect, useState } from "react";

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
import { formatSize, formatTimestamp, formatUsd } from "@/lib/format";
import type { WalletSnapshot } from "@/lib/wallet-types";

const PAGE_SIZE = 20;
const HYPERLIQUID_FILLS_CAP = 2000;

export function FillsTable({
  fills,
}: {
  fills: WalletSnapshot["recentFills"];
}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [fills]);

  if (fills.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No recent fills on record.
      </p>
    );
  }

  const pageCount = Math.ceil(fills.length / PAGE_SIZE);
  const pageStart = page * PAGE_SIZE;
  const pageFills = fills.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = pageStart + 1;
  const rangeEnd = pageStart + pageFills.length;
  const showPagination = fills.length > PAGE_SIZE;

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Side</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageFills.map((fill, index) => (
            <TableRow key={`${fill.timestamp}-${fill.coin}-${pageStart + index}`}>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {formatTimestamp(fill.timestamp)}
              </TableCell>
              <TableCell className="font-medium">{fill.coin}</TableCell>
              <TableCell>
                <Badge variant={fill.side === "buy" ? "default" : "secondary"}>
                  {fill.side}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatSize(fill.size)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatUsd(fill.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showPagination && (
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-muted-foreground text-xs">
            Showing {rangeStart}–{rangeEnd} of {fills.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <span className="text-muted-foreground text-xs">
              Page {page + 1} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {fills.length === HYPERLIQUID_FILLS_CAP && (
        <p className="text-muted-foreground text-center text-xs">
          Showing the 2,000 most recent fills from Hyperliquid.
        </p>
      )}
    </div>
  );
}
