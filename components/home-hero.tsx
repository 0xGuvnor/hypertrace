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
        <span className="font-mono text-xs tracking-[0.08em] text-[var(--brand-cyan)] uppercase">
          Hyperliquid intelligence layer
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          See the capital behind the{" "}
          <em className="font-serif text-[1.45em] font-light italic leading-none text-[var(--brand-cyan)]">
            move.
          </em>
        </h1>
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          Trace whale wallets, uncover coordinated clusters, and monitor live
          positions across Hyperliquid—all from one signal-rich view.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <li key={feature.title} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Icon
                  aria-hidden
                  className="size-4 shrink-0 text-[var(--brand-cyan)]"
                  strokeWidth={1.75}
                />
                <p className="text-sm font-medium text-foreground">
                  {feature.title}
                </p>
              </div>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
