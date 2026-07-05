"use client";

import Link from "next/link";
import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function friendlyMessage(message: string): string {
  if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
    return "Hyperliquid rate limit reached. Wait a moment and try again.";
  }
  return message || "Something went wrong fetching data from Hyperliquid.";
}

export default function AddressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell className="gap-6">
      <SiteHeader variant="compact" className="items-start" />
      <Alert variant="destructive">
        <AlertTitle>Could not load wallet</AlertTitle>
        <AlertDescription>{friendlyMessage(error.message)}</AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={reset} className="w-full sm:w-auto">
          Try again
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          Back to search
        </Link>
      </div>
    </AppShell>
  );
}
