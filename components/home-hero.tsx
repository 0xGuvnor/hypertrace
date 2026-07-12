import { AudioLines, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type HomeHeroProps = {
  className?: string;
};

const FEATURES = [
  {
    title: "On-chain verified",
    description: "Funding paths mapped directly from wallet activity",
    icon: ShieldCheck,
  },
  {
    title: "Live positions",
    description: "Signal updates from the most active market participants",
    icon: AudioLines,
  },
] as const;

export function HomeHero({ className }: HomeHeroProps) {
  return (
    <div className={cn("flex flex-col gap-6 sm:gap-8", className)}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1">
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
        />
        <span className="font-mono text-[0.65rem] tracking-[0.08em] text-[var(--brand-cyan)] uppercase">
          Hyperliquid intelligence layer
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          See the capital behind the{" "}
          <em className="font-serif text-[1.08em] font-light italic text-[var(--brand-cyan)]">
            move.
          </em>
        </h1>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          Trace whale wallets, uncover coordinated clusters, and monitor live
          positions across Hyperliquid—all from one signal-rich view.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-2 rounded-xl border border-border/80 bg-card p-3 sm:p-4"
            >
              <Icon
                aria-hidden
                className="size-4 text-[var(--brand-cyan)]"
                strokeWidth={1.75}
              />
              <p className="text-sm font-medium text-foreground">
                {feature.title}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
