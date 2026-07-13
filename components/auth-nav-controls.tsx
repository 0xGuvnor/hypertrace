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

type AuthNavControlsProps = {
  className?: string;
  /** Compact outline button for header; full-width for mobile sheet */
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
            ? "h-8 w-16 animate-pulse rounded-md bg-muted/60"
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
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          className,
        )}
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
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2 font-normal", className)}
            aria-label={`Account menu for ${label}`}
          />
        }
      >
        <span
          aria-hidden
          className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-cyan)]/15 font-mono text-[0.65rem] text-[var(--brand-cyan)]"
        >
          {initial}
        </span>
        <span className="max-w-[7rem] truncate">{label}</span>
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
