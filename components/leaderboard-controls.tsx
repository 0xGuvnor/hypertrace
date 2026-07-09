"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type ActivityWindow,
  type PnlWindow,
  PNL_WINDOW_LABELS,
} from "@/lib/leaderboard-list";
import { cn } from "@/lib/utils";

const PNL_WINDOWS: PnlWindow[] = ["day", "week", "month", "allTime"];
const ACTIVITY_WINDOWS: ActivityWindow[] = ["any", "24h", "7d", "30d"];
const ACTIVITY_LABELS: Record<ActivityWindow, string> = {
  any: "Any",
  "24h": "24h",
  "7d": "7d",
  "30d": "30d",
};

type LeaderboardControlsProps = {
  pnlWindow: PnlWindow;
  onPnlWindowChange: (window: PnlWindow) => void;
  minAccountValueDraft: string;
  onMinAccountValueDraftChange: (value: string) => void;
  onApplyMinAccountValue: () => void;
  activityWindow: ActivityWindow;
  onActivityWindowChange: (window: ActivityWindow) => void;
};

export function LeaderboardControls({
  pnlWindow,
  onPnlWindowChange,
  minAccountValueDraft,
  onMinAccountValueDraftChange,
  onApplyMinAccountValue,
  activityWindow,
  onActivityWindowChange,
}: LeaderboardControlsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div
        role="tablist"
        aria-label="PnL window"
        className="flex items-end gap-1 border-b border-border/60"
      >
        {PNL_WINDOWS.map((window) => {
          const active = window === pnlWindow;
          return (
            <button
              key={window}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onPnlWindowChange(window)}
              className={cn(
                "relative px-3 pb-2 pt-1 text-sm transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50",
                "motion-reduce:transition-none",
                active
                  ? "font-medium text-[var(--brand-cyan)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {PNL_WINDOW_LABELS[window]}
              <span
                className={cn(
                  "absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-[var(--brand-cyan)] transition-opacity duration-150 motion-reduce:transition-none",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor="leaderboard-min-value"
            className="text-muted-foreground text-xs"
          >
            Min account value
          </label>
          <div className="flex gap-2">
            <Input
              id="leaderboard-min-value"
              inputMode="decimal"
              placeholder="e.g. 100000"
              value={minAccountValueDraft}
              onChange={(event) =>
                onMinAccountValueDraftChange(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onApplyMinAccountValue();
                }
              }}
              className="h-8 w-36 font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={onApplyMinAccountValue}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-muted-foreground text-xs">Active within</span>
          <div className="flex flex-wrap gap-1">
            {ACTIVITY_WINDOWS.map((window) => {
              const active = window === activityWindow;
              return (
                <Button
                  key={window}
                  type="button"
                  size="sm"
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "h-8 px-2.5 text-xs",
                    active && "text-[var(--brand-cyan)]",
                  )}
                  onClick={() => onActivityWindowChange(window)}
                >
                  {ACTIVITY_LABELS[window]}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
