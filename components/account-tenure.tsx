"use client";

import { Hourglass } from "lucide-react";

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
        <span className="text-foreground/80 inline-flex items-center gap-1 text-sm font-medium tabular-nums">
          <Hourglass
            aria-hidden
            className="text-muted-foreground size-3.5 shrink-0"
          />
          {age}
        </span>
      }
      content={
        <span>
          First activity {formatFirstActivityTimestamp(firstActivityAt)}
        </span>
      }
      triggerClassName="w-fit shrink-0"
    />
  );
}
