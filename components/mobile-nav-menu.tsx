"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AuthNavControls } from "@/components/auth-nav-controls";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
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
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[45%] gap-0 border-l border-[var(--brand-cyan)]/30 data-[side=right]:w-[45%] data-[side=right]:sm:max-w-none"
      >
        <SheetHeader className="flex-row items-center gap-2">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={cn(
              "flex min-h-11 flex-1 items-center gap-2 rounded-xl outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <div className="relative size-7 shrink-0">
              <Image
                src="/logo.png"
                alt=""
                width={56}
                height={56}
                className="size-full object-contain"
              />
            </div>
            <SheetTitle className="text-base font-semibold tracking-tight">
              Hyper<span className="italic">trace</span>
            </SheetTitle>
          </Link>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
          {SITE_NAV_LINKS.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center rounded-xl px-3 text-sm transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "bg-[var(--brand-cyan)]/[0.08] font-medium text-[var(--brand-cyan)]"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <AuthNavControls
          layout="sheet"
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
