import Image from "next/image";
import Link from "next/link";

import { AuthNavControls } from "@/components/auth-nav-controls";
import { MobileNavMenu } from "@/components/mobile-nav-menu";
import { SiteNavPills } from "@/components/site-nav-pills";
import { cn } from "@/lib/utils";

type SiteHeaderVariant = "compact" | "minimal";

type SiteHeaderProps = {
  variant?: SiteHeaderVariant;
  className?: string;
};

function SiteNavActions({ className }: { className?: string }) {
  return (
    <nav className={cn("flex shrink-0 items-center gap-2", className)}>
      <MobileNavMenu className="sm:hidden" />
      <SiteNavPills />
      <AuthNavControls className="hidden sm:inline-flex" layout="header" />
    </nav>
  );
}

function siteHeaderClassName(className?: string) {
  return cn(
    "sticky top-0 z-40 -mt-6 w-full self-stretch",
    "bg-background",
    "pt-6 pb-3 sm:-mt-8 sm:pt-8",
    className,
  );
}

export function SiteHeader({
  variant = "compact",
  className,
}: SiteHeaderProps) {
  if (variant === "minimal") {
    return (
      <header className={cn(siteHeaderClassName(className), "flex justify-end")}>
        <SiteNavActions />
      </header>
    );
  }

  return (
    <header
      className={cn(
        siteHeaderClassName(className),
        "flex flex-row items-center justify-between",
      )}
    >
      <Link
        href="/"
        className="group flex flex-row items-center gap-1.5 rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative size-8 shrink-0 sm:size-9">
          <Image
            src="/logo.png"
            alt=""
            width={96}
            height={96}
            className="size-full object-contain"
          />
        </div>
        <span className="text-base font-semibold tracking-tight sm:text-lg">
          Hyper<span className="italic">trace</span>
        </span>
      </Link>
      <SiteNavActions />
    </header>
  );
}
