"use client";

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

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

function FilterSegmentGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex w-full overflow-hidden rounded-lg border border-border bg-card"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "min-w-0 flex-1 px-2 py-2 font-mono text-[11px] tracking-wide transition-colors duration-150 sm:text-xs",
                "outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50",
                "motion-reduce:transition-none",
                active
                  ? "bg-[var(--brand-cyan)] font-medium text-black"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-3">
      <FilterSegmentGroup
        label="Performance window"
        options={PNL_WINDOWS.map((window) => ({
          value: window,
          label: PNL_WINDOW_LABELS[window],
        }))}
        value={pnlWindow}
        onChange={onPnlWindowChange}
      />
      <FilterSegmentGroup
        label="Minimum account value"
        options={MIN_ACCOUNT_VALUE_FILTERS.map((filter) => ({
          value: filter,
          label: MIN_ACCOUNT_VALUE_LABELS[filter],
        }))}
        value={minAccountValueFilter}
        onChange={onMinAccountValueFilterChange}
      />
      <FilterSegmentGroup
        label="Minimum volume"
        options={MIN_VOLUME_FILTERS.map((filter) => ({
          value: filter,
          label: MIN_VOLUME_LABELS[filter],
        }))}
        value={minVolumeFilter}
        onChange={onMinVolumeFilterChange}
      />
    </div>
  );
}
