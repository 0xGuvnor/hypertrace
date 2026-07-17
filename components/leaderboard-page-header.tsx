import { formatTimestamp } from "@/lib/format";

type LeaderboardPageHeaderProps = {
  snapshotAt?: number | null;
};

export function LeaderboardPageHeader({
  snapshotAt = null,
}: LeaderboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
          />
          <span>
            Market intelligence
            <span className="text-muted-foreground/50 mx-1.5">/</span>
            PnL
          </span>
        </p>
        <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Whale leaderboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-pretty text-sm leading-relaxed">
          Filterable Hyperliquid whale performance. Opted-in addresses sourced
          from stats-data.
        </p>
      </div>

      {snapshotAt !== null ? (
        <div className="shrink-0 sm:pb-0.5 sm:text-right">
          <p className="text-muted-foreground font-mono text-xs tracking-[0.16em] uppercase">
            Snapshot
          </p>
          <p
            className="mt-1 font-mono text-sm tabular-nums text-foreground"
            suppressHydrationWarning
          >
            {formatTimestamp(snapshotAt)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
