import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "hero" | "compact";
  className?: string;
};

export function SiteHeader({ variant = "compact", className }: SiteHeaderProps) {
  const isHero = variant === "hero";

  return (
    <header className={cn("flex flex-col items-center", className)}>
      <Link
        href="/"
        className={cn(
          "group flex items-center gap-3 rounded-xl outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isHero ? "flex-col gap-4" : "flex-row",
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-2xl",
            isHero ? "size-20 sm:size-24" : "size-9 sm:size-10",
          )}
        >
          {isHero ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 scale-150 bg-[radial-gradient(circle_at_50%_50%,var(--brand-cyan)_0%,transparent_70%)] opacity-30 blur-2xl"
            />
          ) : null}
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            priority={isHero}
            className="relative size-full object-cover"
          />
        </div>
        <div className={cn("flex flex-col", isHero ? "items-center text-center" : "items-start")}>
          <span
            className={cn(
              "font-semibold tracking-tight",
              isHero ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
            )}
          >
            Hyper<span className="italic">trace</span>
          </span>
          {isHero ? (
            <span className="text-muted-foreground max-w-sm text-sm sm:text-base">
              Look up any Hyperliquid wallet. Positions, margin, and recent fills.
            </span>
          ) : null}
        </div>
      </Link>
    </header>
  );
}
