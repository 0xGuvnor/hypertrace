"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  nextPath: string;
  className?: string;
};

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("size-4", className)}
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.5 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.8H12z"
      />
      <path
        fill="#34A853"
        d="M3.6 7.4 6.6 9.6C7.4 7.6 9.5 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.5 2.7 12 2.7 8.2 2.7 4.9 4.8 3.6 7.4z"
      />
      <path
        fill="#4A90E2"
        d="M12 21.3c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9 1-3.1 1-2.4 0-4.4-1.6-5.1-3.8l-3 2.3c1.4 2.7 4.2 4.9 8.1 4.9z"
      />
      <path
        fill="#FBBC05"
        d="M6.9 14.1c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.9 7.9C3.3 9.1 3 10.5 3 12s.3 2.9.9 4.1l3-2z"
      />
    </svg>
  );
}

export function LoginForm({ nextPath, className }: LoginFormProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isLoading, nextPath, router]);

  async function handleGoogleSignIn() {
    setError(null);
    setPending(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: nextPath,
      });
    } catch (err) {
      setPending(false);
      setError(
        err instanceof Error ? err.message : "Google sign-in failed",
      );
    }
  }

  if (isLoading || isAuthenticated) {
    return (
      <div
        className={cn(
          "flex flex-col gap-5 rounded-xl border border-border/80 bg-card p-5 sm:gap-6 sm:p-6",
          className,
        )}
      >
        <div className="h-24 animate-pulse rounded-lg bg-muted/50" aria-hidden />
      </div>
    );
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border/80 bg-card p-5 sm:gap-6 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-[var(--brand-cyan)] uppercase">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
          />
          Access
        </p>
        <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sign in to Hyper<span className="italic">trace</span>
        </h1>
        <p className="text-muted-foreground max-w-prose text-pretty text-sm leading-relaxed">
          Save wallets you are tracking. Whale pages stay public.
        </p>
      </div>

      <div className="border-t border-border/60 pt-5 sm:pt-6">
        <Button
          type="button"
          size="lg"
          className="h-11 w-full gap-2 bg-[var(--brand-cyan-fill)] text-[var(--brand-ink)] hover:bg-[var(--brand-cyan-fill)]/90"
          disabled={pending}
          onClick={() => {
            void handleGoogleSignIn();
          }}
        >
          <GoogleMark />
          {pending ? "Redirecting…" : "Continue with Google"}
        </Button>
        {error ? (
          <p className="mt-3 text-pretty text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
