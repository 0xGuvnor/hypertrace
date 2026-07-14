"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const headerNavItemClassName = cn(
  "rounded-full px-3.5 py-1.5 text-sm transition-colors",
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50",
  "text-muted-foreground hover:text-foreground",
);

type AuthNavControlsProps = {
  className?: string;
  /** Pill-track item for desktop header; full-width for mobile sheet */
  layout?: "header" | "sheet";
  onNavigate?: () => void;
};

function initialsFromUser(name: string, email: string): string {
  const fromName = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  if (fromName.length > 0) {
    return fromName;
  }
  return (email[0] ?? "?").toUpperCase();
}

export function AuthNavControls({
  className,
  layout = "header",
  onNavigate,
}: AuthNavControlsProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(
    api.auth.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading) {
    return (
      <div
        className={cn(
          layout === "header"
            ? "mx-1 h-7 w-14 animate-pulse rounded-full bg-muted/60"
            : "h-11 w-full animate-pulse rounded-xl bg-muted/60",
          className,
        )}
        aria-hidden
      />
    );
  }

  if (!isAuthenticated) {
    if (layout === "sheet") {
      return (
        <div
          className={cn(
            "mt-auto flex flex-col gap-2 border-t border-border/60 px-3 py-3",
            className,
          )}
        >
          <Link
            href="/login"
            onClick={onNavigate}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-center",
            )}
          >
            Sign in
          </Link>
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className={cn(headerNavItemClassName, className)}
      >
        Sign in
      </Link>
    );
  }

  const label = user?.name || user?.email || "Account";
  const email = user?.email ?? "";
  const initial = initialsFromUser(user?.name ?? "", email);

  async function handleSignOut() {
    await authClient.signOut();
    onNavigate?.();
    router.refresh();
  }

  if (layout === "sheet") {
    return (
      <div
        className={cn(
          "mt-auto flex flex-col gap-2 border-t border-border/60 px-3 py-3",
          className,
        )}
      >
        <p className="truncate px-3 font-mono text-xs text-muted-foreground">
          {email || label}
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center"
          onClick={() => {
            void handleSignOut();
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              headerNavItemClassName,
              "inline-flex max-w-[9.5rem] items-center gap-1.5",
              className,
            )}
            aria-label={`Account menu for ${label}`}
          />
        }
      >
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--brand-cyan)]/12 font-mono text-[0.6rem] text-[var(--brand-cyan)]"
        >
          {initial}
        </span>
        <span className="truncate">{label}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 gap-2 p-2">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          {email ? (
            <p className="truncate font-mono text-xs text-muted-foreground">
              {email}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            void handleSignOut();
          }}
        >
          Sign out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
