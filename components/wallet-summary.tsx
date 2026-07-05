import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
    { label: "Margin used", value: formatUsd(account.totalMarginUsed) },
    { label: "Withdrawable", value: formatUsd(account.withdrawable) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-xs font-normal">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium tabular-nums">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
