"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SITE_NAV_LINKS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SiteNavPillsProps = {
  className?: string;
  trailing?: ReactNode;
};

export function SiteNavPills({ className, trailing }: SiteNavPillsProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "hidden items-center rounded-full border border-border/80 bg-card/60 p-0.5 sm:flex",
        className,
      )}
    >
      {SITE_NAV_LINKS.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50",
              active
                ? "bg-secondary text-[var(--brand-cyan)] ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
      {trailing}
    </div>
  );
}
