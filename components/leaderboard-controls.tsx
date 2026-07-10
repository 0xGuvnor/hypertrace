"use client";

import { Button } from "@/components/ui/button";
import {
  type MinAccountValueFilter,
  type MinVolumeFilter,
  type PnlWindow,
  MIN_ACCOUNT_VALUE_LABELS,
  PNL_WINDOW_LABELS,
} from "@/lib/leaderboard-list";
import { cn } from "@/lib/utils";

const PNL_WINDOWS: PnlWindow[] = ["day", "week", "month", "allTime"];
const MIN_ACCOUNT_VALUE_FILTERS: MinAccountValueFilter[] = [
  "any",
  "100k",
  "1m",
  "10m",
  "100m",
];
const MIN_VOLUME_FILTERS: MinVolumeFilter[] = [
  "any",
  "positive",
  "1m",
  "10m",
  "100m",
];
const MIN_VOLUME_LABELS: Record<MinVolumeFilter, string> = {
  any: "Any",
  positive: ">0",
  "1m": "$1M",
  "10m": "$10M",
  "100m": "$100M",
};

type LeaderboardControlsProps = {
  pnlWindow: PnlWindow;
  onPnlWindowChange: (window: PnlWindow) => void;
  minAccountValueFilter: MinAccountValueFilter;
  onMinAccountValueFilterChange: (filter: MinAccountValueFilter) => void;
  minVolumeFilter: MinVolumeFilter;
  onMinVolumeFilterChange: (filter: MinVolumeFilter) => void;
};

export function LeaderboardControls({
  pnlWindow,
  onPnlWindowChange,
  minAccountValueFilter,
  onMinAccountValueFilterChange,
  minVolumeFilter,
  onMinVolumeFilterChange,
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
          <span className="text-muted-foreground text-xs">
            Min account value
          </span>
          <div className="flex flex-wrap gap-1">
            {MIN_ACCOUNT_VALUE_FILTERS.map((filter) => {
              const active = filter === minAccountValueFilter;
              return (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "h-8 px-2.5 text-xs",
                    active && "text-[var(--brand-cyan)]",
                  )}
                  onClick={() => onMinAccountValueFilterChange(filter)}
                >
                  {MIN_ACCOUNT_VALUE_LABELS[filter]}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-muted-foreground text-xs">Min volume</span>
          <div className="flex flex-wrap gap-1">
            {MIN_VOLUME_FILTERS.map((filter) => {
              const active = filter === minVolumeFilter;
              return (
                <Button
                  key={filter}
                  type="button"
                  size="sm"
                  variant={active ? "secondary" : "ghost"}
                  className={cn(
                    "h-8 px-2.5 text-xs",
                    active && "text-[var(--brand-cyan)]",
                  )}
                  onClick={() => onMinVolumeFilterChange(filter)}
                >
                  {MIN_VOLUME_LABELS[filter]}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
