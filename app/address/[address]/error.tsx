"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <Alert variant="destructive">
        <AlertTitle>Could not load wallet</AlertTitle>
        <AlertDescription>{friendlyMessage(error.message)}</AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to search
        </Link>
      </div>
    </div>
  );
}
