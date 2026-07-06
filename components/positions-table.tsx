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

function formatMarginMode(mode: WalletSnapshot["positions"][number]["marginMode"]): string {
  return mode === "cross" ? "Cross" : "Isolated";
}

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
          <TableHead className="text-right">Leverage</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Entry</TableHead>
          <TableHead className="text-right">Liq. price</TableHead>
          <TableHead className="text-right">TP</TableHead>
          <TableHead className="text-right">SL</TableHead>
          <TableHead className="text-right">Funding fee</TableHead>
          <TableHead className="text-right">uPnL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => {
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
  );
}
