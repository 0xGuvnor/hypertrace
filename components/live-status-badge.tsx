import { Badge } from "@/components/ui/badge";
import { formatRelativeUpdate, type LiveFeedStatus } from "@/lib/live-status";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";

type LiveStatusBadgeProps = {
  status: LiveFeedStatus;
  now: number;
};

function StatusIndicator({
  tone,
  pulse,
}: {
  tone: "cyan" | "muted" | "amber" | "neutral";
  pulse?: boolean;
}) {
  const dotClass = {
    cyan: "bg-[var(--brand-cyan)]",
    muted: "bg-muted-foreground/50",
    amber: "bg-amber-500",
    neutral: "bg-muted-foreground/70",
  }[tone];

  if (pulse && tone === "cyan") {
    return (
      <span className="relative flex size-2 shrink-0" aria-hidden>
        <span
          className={cn(
            "absolute inline-flex size-full rounded-full opacity-40",
            dotClass,
            "motion-safe:animate-ping",
          )}
        />
        <span className={cn("relative inline-flex size-2 rounded-full", dotClass)} />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        dotClass,
        pulse && "motion-safe:animate-pulse",
      )}
    />
  );
}

function statusMeta(status: LiveFeedStatus, now: number) {
  switch (status.kind) {
    case "connecting":
      return {
        label: "Connecting",
        detail: "Subscribing to feed",
        tone: "muted" as const,
        pulse: true,
        badgeClass:
          "border-border/60 bg-muted/40 text-muted-foreground",
      };
    case "snapshot":
      return {
        label: "Snapshot",
        detail: formatTimestamp(status.fetchedAt),
        tone: "neutral" as const,
        pulse: false,
        badgeClass: "border-border bg-muted/30 text-muted-foreground",
      };
    case "live":
      return {
        label: "Live",
        detail: `Updated ${formatRelativeUpdate(status.updatedAt, now)}`,
        tone: "cyan" as const,
        pulse: true,
        badgeClass:
          "border-[color-mix(in_oklch,var(--brand-cyan)_35%,transparent)] bg-[color-mix(in_oklch,var(--brand-cyan)_12%,transparent)] text-[var(--brand-cyan)]",
      };
    case "stale":
      return {
        label: "Stale",
        detail: `Last update ${formatRelativeUpdate(status.updatedAt, now)}`,
        tone: "amber" as const,
        pulse: false,
        badgeClass:
          "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function LiveStatusBadge({ status, now }: LiveStatusBadgeProps) {
  const meta = statusMeta(status, now);

  return (
    <Badge
      variant="outline"
      className={cn("h-6 gap-1.5 px-2.5 font-normal tabular-nums", meta.badgeClass)}
    >
      <StatusIndicator tone={meta.tone} pulse={meta.pulse} />
      <span className="font-medium">{meta.label}</span>
      <span className="text-[0.6875rem] opacity-80">{meta.detail}</span>
    </Badge>
  );
}
