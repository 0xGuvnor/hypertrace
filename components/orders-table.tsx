import { Badge } from "@/components/ui/badge";
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

export function OrdersTable({
  orders,
}: {
  orders: WalletSnapshot["openOrders"];
}) {
  if (orders.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No open orders.
      </p>
    );
  }

  const sorted = [...orders].sort((a, b) => b.timestamp - a.timestamp);

  return (
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
        {sorted.map((order) => (
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
            <TableCell className="text-right font-mono text-xs">
              {formatSize(order.size)}
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
        ))}
      </TableBody>
    </Table>
  );
}
