"use client";

import { ResponsiveHint } from "@/components/responsive-hint";
import {
  formatAccountAge,
  formatFirstActivityTimestamp,
} from "@/lib/account-age";

export function AccountTenure({
  firstActivityAt,
  now = Date.now(),
}: {
  firstActivityAt: number;
  now?: number;
}) {
  const age = formatAccountAge(firstActivityAt, now);

  return (
    <ResponsiveHint
      label={
        <span className="inline-flex items-baseline gap-1.5 text-sm">
          <span className="text-foreground/80 font-medium tabular-nums">
            {age}
          </span>
          <span className="text-muted-foreground text-xs">on Hyperliquid</span>
        </span>
      }
      content={
        <span>
          First activity {formatFirstActivityTimestamp(firstActivityAt)}
        </span>
      }
      triggerClassName="w-fit"
    />
  );
}
