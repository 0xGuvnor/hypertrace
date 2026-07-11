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
import { formatOrderSize, formatTimestamp, formatUsd } from "@/lib/format";
import { paginateItems } from "@/lib/table-page";
import type { WalletSnapshot } from "@/lib/wallet-types";

function OrdersTablePaged({
  orders,
}: {
  orders: WalletSnapshot["openOrders"];
}) {
  const [page, setPage] = useState(0);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => b.timestamp - a.timestamp),
    [orders],
  );

  const {
    page: currentPage,
    pageItems,
    pageCount,
    rangeStart,
    rangeEnd,
    showPagination,
  } = paginateItems(sorted, page);

  return (
    <div className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Asset</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Limit</TableHead>
            <TableHead className="text-right">Trigger</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Flags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((order) => {
            const sizeLabel = formatOrderSize(order.size, order.isPositionTpsl);
            const isClosePosition = sizeLabel === "Close position";

            return (
              <TableRow key={order.orderId}>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {formatTimestamp(order.timestamp)}
                </TableCell>
                <TableCell className="font-medium">{order.coin}</TableCell>
                <TableCell>
                  <Badge variant={order.side === "buy" ? "default" : "secondary"}>
                    {order.side}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{order.orderType}</TableCell>
                <TableCell
                  className={`text-right text-xs ${isClosePosition ? "text-muted-foreground" : "font-mono"}`}
                >
                  {sizeLabel}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatUsd(order.limitPrice)}
                </TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {order.triggerPrice ? formatUsd(order.triggerPrice) : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-48 truncate text-xs">
                  {order.triggerCondition === "N/A"
                    ? "—"
                    : order.triggerCondition}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {order.isPositionTpsl && (
                      <Badge variant="outline" className="text-xs">
                        TP/SL
                      </Badge>
                    )}
                    {order.reduceOnly && (
                      <Badge variant="outline" className="text-xs">
                        Reduce
                      </Badge>
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
          total={sorted.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

export function OrdersTable({
  orders,
}: {
  orders: WalletSnapshot["openOrders"];
}) {
  const remountKey = useMemo(
    () => orders.map((order) => String(order.orderId)).join("|"),
    [orders],
  );

  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No open orders.
      </p>
    );
  }

  return <OrdersTablePaged key={remountKey} orders={orders} />;
}
