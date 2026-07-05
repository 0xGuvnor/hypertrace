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

export function FillsTable({
  fills,
}: {
  fills: WalletSnapshot["recentFills"];
}) {
  if (fills.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No recent fills on record.
      </p>
    );
  }

  return (
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
        {fills.map((fill, index) => (
          <TableRow key={`${fill.timestamp}-${fill.coin}-${index}`}>
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
  );
}
