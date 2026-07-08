import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteHeroBrandProps = {
  className?: string;
};

export function SiteHeroBrand({ className }: SiteHeroBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex flex-col items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-start sm:gap-4",
        className,
      )}
    >
      <div className="relative size-16 shrink-0 sm:size-20">
        <Image
          src="/logo.png"
          alt=""
          width={96}
          height={96}
          priority
          className="size-full object-contain"
        />
      </div>
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <span className="text-xl font-semibold tracking-tight sm:text-2xl">
          Hyper<span className="italic">trace</span>
        </span>
        <span className="text-muted-foreground max-w-md text-sm leading-snug">
          Track Hyperliquid whales and the wallet clusters behind them. Shared
          funding, correlated entries, live positions.
        </span>
      </div>
    </Link>
  );
}
