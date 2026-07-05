import { Badge } from "@/components/ui/badge";
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

export function PositionsTable({
  positions,
}: {
  positions: WalletSnapshot["positions"];
}) {
  if (positions.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No open perpetual positions.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Side</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead className="text-right">Entry</TableHead>
          <TableHead className="text-right">uPnL</TableHead>
          <TableHead className="text-right">Liq. price</TableHead>
          <TableHead className="text-right">Leverage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
          const pnl = Number.parseFloat(position.unrealizedPnl);
          return (
            <TableRow key={position.coin}>
              <TableCell className="font-medium">{position.coin}</TableCell>
              <TableCell>
                <Badge
                  variant={position.side === "long" ? "default" : "secondary"}
                >
                  {position.side}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatSize(position.size)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {formatUsd(position.entryPrice)}
              </TableCell>
              <TableCell
                className={`text-right font-mono text-xs ${pnl >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatUsd(position.unrealizedPnl)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {position.liquidationPrice
                  ? formatUsd(position.liquidationPrice)
                  : "—"}
              </TableCell>
              <TableCell className="text-right font-mono text-xs">
                {position.leverage}x
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
