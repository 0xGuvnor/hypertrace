import Image from "next/image";
import Link from "next/link";

import { MobileNavMenu } from "@/components/mobile-nav-menu";
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

function SiteNavActions({ className }: { className?: string }) {
  return (
    <nav className={cn("flex shrink-0 items-center gap-2 pt-0.5", className)}>
      <MobileNavMenu className="sm:hidden" />
      <ClustersNavLink className="hidden sm:inline-flex" />
    </nav>
  );
}

export function SiteHeader({ variant = "compact", className }: SiteHeaderProps) {
  const isHero = variant === "hero";

  const logoLink = (
    <Link
      href="/"
      className={cn(
        "group flex items-center rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isHero ? "flex-col gap-3 sm:flex-row sm:gap-4" : "flex-row gap-1",
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
  );

  if (isHero) {
    return (
      <header className={cn("flex w-full flex-col gap-3", className)}>
        <SiteNavActions className="fixed top-6 right-4 z-50 sm:hidden" />
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
          {logoLink}
          <SiteNavActions className="hidden sm:flex" />
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "flex w-full flex-row items-start justify-between",
        className,
      )}
    >
      {logoLink}
      <SiteNavActions />
    </header>
  );
}
