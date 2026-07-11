"use client";

import { useMemo, useState } from "react";

import { TablePagination } from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RECENT_FILLS_CAP } from "@/lib/fills";
import { formatSize, formatTimestamp, formatUsd } from "@/lib/format";
import { paginateItems } from "@/lib/table-page";
import type { WalletSnapshot } from "@/lib/wallet-types";

function FillsTablePaged({
  fills,
}: {
  fills: WalletSnapshot["recentFills"];
}) {
  const [page, setPage] = useState(0);

  if (fills.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No recent fills on record.
      </p>
    );
  }

  const {
    page: currentPage,
    pageItems,
    pageCount,
    pageStart,
    rangeStart,
    rangeEnd,
    showPagination,
  } = paginateItems(fills, page);

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
          {pageItems.map((fill, index) => (
            <TableRow key={`${fill.timestamp}-${fill.coin}-${pageStart + index}`}>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {formatTimestamp(fill.timestamp)}
              </TableCell>
              <TableCell className="font-medium">{fill.coin}</TableCell>
              <TableCell>
                <div className="flex flex-wrap items-center gap-1">
                  <Badge variant={fill.side === "buy" ? "default" : "secondary"}>
                    {fill.side}
                  </Badge>
                  {fill.isLiquidation && (
                    <Badge
                      variant="outline"
                      className="border-red-500/30 bg-red-500/10 font-medium text-red-700 dark:text-red-400"
                    >
                      Liquidated
                    </Badge>
                  )}
                </div>
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
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={fills.length}
          onPageChange={setPage}
        />
      )}

      {fills.length === RECENT_FILLS_CAP && (
        <p className="text-muted-foreground text-center text-xs">
          Showing the 100 most recent fills.
        </p>
      )}
    </div>
  );
}

export function FillsTable({
  fills,
}: {
  fills: WalletSnapshot["recentFills"];
}) {
  const fillsKey = useMemo(
    () => fills.map((fill) => `${fill.timestamp}-${fill.coin}`).join("|"),
    [fills],
  );

  return <FillsTablePaged key={fillsKey} fills={fills} />;
}
