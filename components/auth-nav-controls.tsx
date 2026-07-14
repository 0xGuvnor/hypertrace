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
  "rounded-full px-2.5 py-1.5 text-sm transition-colors",
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

function AccountAvatar({
  image,
  name,
  email,
}: {
  image: string | null;
  name: string;
  email: string;
}) {
  const initial = initialsFromUser(name, email);

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Google OAuth avatar URL; avoid next/image remote allowlist churn
      <img
        src={image}
        alt=""
        width={20}
        height={20}
        referrerPolicy="no-referrer"
        className="size-5 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-5 items-center justify-center rounded-full bg-[var(--brand-cyan)]/12 font-mono text-[0.65rem] text-[var(--brand-cyan)]"
    >
      {initial}
    </span>
  );
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
            ? "mx-1 size-7 animate-pulse rounded-full bg-muted/60"
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
  const image = user?.image ?? null;

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
        <div className="flex items-center gap-2 px-3">
          <AccountAvatar image={image} name={user?.name ?? ""} email={email} />
          <p className="truncate font-mono text-xs text-muted-foreground">
            {email || label}
          </p>
        </div>
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
              "inline-flex items-center",
              className,
            )}
            aria-label={`Account menu for ${label}`}
          />
        }
      >
        <AccountAvatar image={image} name={user?.name ?? ""} email={email} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 gap-2 p-2">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <AccountAvatar image={image} name={user?.name ?? ""} email={email} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {label}
            </p>
            {email ? (
              <p className="truncate font-mono text-xs text-muted-foreground">
                {email}
              </p>
            ) : null}
          </div>
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
