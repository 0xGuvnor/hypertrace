"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE_NAV_LINKS } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

type MobileNavMenuProps = {
  className?: string;
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNavMenu({ className }: MobileNavMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            aria-label="Open menu"
            className={cn(
              "size-11 shrink-0 [&_svg]:size-6",
              "focus-visible:border-[var(--brand-cyan)]/40 focus-visible:ring-[var(--brand-cyan)]/25",
              className,
            )}
          />
        }
      >
        <Menu className="size-6" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-border">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <nav className="flex flex-1 flex-col gap-1 px-2 pt-10">
          {SITE_NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors",
                  active
                    ? "border-l-2 border-[var(--brand-cyan)] bg-muted/50 pl-[calc(0.75rem-2px)] font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4" aria-hidden />
      </SheetContent>
    </Sheet>
  );
}
