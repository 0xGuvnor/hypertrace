import { WalletSearch } from "@/components/wallet-search";
import { cn } from "@/lib/utils";

type InvestigationConsoleProps = {
  className?: string;
};

export function InvestigationConsole({ className }: InvestigationConsoleProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border/80 bg-card p-5 sm:gap-6 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-xs tracking-[0.08em] text-[var(--brand-cyan)] uppercase">
            Investigation console
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Trace a wallet
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-1">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)] motion-safe:animate-pulse"
          />
          <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Live
          </span>
        </div>
      </div>

      <div className="border-t border-border/60 pt-5 sm:pt-6">
        <WalletSearch autoFocus showLabel />
      </div>
    </section>
  );
}
