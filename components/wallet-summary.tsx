import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { formatUsd } from "@/lib/format";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletSummary({
  account,
}: {
  account: WalletSnapshot["account"];
}) {
  const stats = [
    { label: "Account value", value: formatUsd(account.accountValue) },
    { label: "Spot", value: formatUsd(account.spotValue ?? "0") },
    { label: "Margin used", value: formatUsd(account.totalMarginUsed) },
    { label: "Withdrawable", value: formatUsd(account.withdrawable) },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg font-medium tabular-nums">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
