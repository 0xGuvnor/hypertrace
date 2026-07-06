import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "hero" | "compact";
  className?: string;
};

function ClustersNavLink({ className }: { className?: string }) {
  return (
    <Link
      href="/clusters"
      className={cn(
        "text-muted-foreground hover:text-foreground text-sm transition-colors",
        className,
      )}
    >
      Clusters
    </Link>
  );
}

export function SiteHeader({ variant = "compact", className }: SiteHeaderProps) {
  const isHero = variant === "hero";

  return (
    <header
      className={cn(
        "flex w-full flex-col items-center gap-3",
        !isHero && "sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <Link
        href="/"
        className={cn(
          "group flex items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isHero ? "flex-col gap-3 sm:flex-row sm:gap-4" : "flex-row",
        )}
      >
        <div
          className={cn(
            "relative shrink-0",
            isHero ? "size-16 sm:size-20" : "size-9 sm:size-10",
          )}
        >
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority={isHero}
            className="size-full object-contain"
          />
        </div>
        <div
          className={cn(
            "flex flex-col",
            isHero ? "items-center text-center sm:items-start sm:text-left" : "items-start",
          )}
        >
          <span
            className={cn(
              "font-semibold tracking-tight",
              isHero ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
            )}
          >
            Hyper<span className="italic">trace</span>
          </span>
          {isHero ? (
            <span className="text-muted-foreground max-w-md text-sm leading-snug">
              Track Hyperliquid whales and the wallet clusters behind them. Shared
              funding, correlated entries, live positions.
            </span>
          ) : null}
        </div>
      </Link>
      {isHero ? (
        <ClustersNavLink className="sm:self-end" />
      ) : (
        <ClustersNavLink className="shrink-0 pt-1 sm:pt-0.5" />
      )}
    </header>
  );
}
