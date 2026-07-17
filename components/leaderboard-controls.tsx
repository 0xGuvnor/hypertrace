"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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

type ThumbRect = { left: number; width: number };

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
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<T, HTMLButtonElement>());
  const [thumb, setThumb] = useState<ThumbRect | null>(null);

  const measureThumb = useCallback(() => {
    const button = buttonRefs.current.get(value);
    if (!button) {
      setThumb(null);
      return;
    }
    setThumb({ left: button.offsetLeft, width: button.offsetWidth });
  }, [value]);

  useLayoutEffect(() => {
    measureThumb();
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      measureThumb();
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [measureThumb, options]);

  const thumbStyle: CSSProperties | undefined = thumb
    ? {
        transform: `translateX(${thumb.left}px)`,
        width: thumb.width,
      }
    : undefined;

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="font-mono text-xs tracking-[0.14em] text-[var(--brand-cyan)] uppercase">
        {label}
      </span>
      <div
        ref={trackRef}
        role="radiogroup"
        aria-label={label}
        className="relative flex min-h-9 w-full rounded-full border border-border bg-card p-0.5 md:w-auto"
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-0.5 bottom-0.5 left-0 z-0 rounded-full bg-[var(--brand-cyan-fill)]",
            "transition-[transform,width] duration-200 ease-out motion-reduce:transition-none",
            thumb ? "opacity-100" : "opacity-0",
          )}
          style={thumbStyle}
        />
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              ref={(node) => {
                if (node) {
                  buttonRefs.current.set(option.value, node);
                } else {
                  buttonRefs.current.delete(option.value);
                }
              }}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative z-10 min-w-0 flex-1 rounded-full px-2.5 py-1.5 font-mono text-xs tracking-wide transition-colors duration-150 md:flex-none md:px-3",
                "outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50",
                "motion-reduce:transition-none",
                active
                  ? "font-medium text-[var(--brand-ink)]"
                  : "text-muted-foreground hover:text-foreground",
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
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
      <FilterSegmentGroup
        label="Performance window"
        options={PNL_WINDOWS.map((window) => ({
          value: window,
          label: PNL_WINDOW_LABELS[window],
        }))}
        value={pnlWindow}
        onChange={onPnlWindowChange}
      />
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
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
    </div>
  );
}
