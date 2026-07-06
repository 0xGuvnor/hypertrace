"use client";

import Link from "next/link";
import { useEffect } from "react";

import "./globals.css";
import { SHELL_PADDING, SHELL_WIDTH_WIDE } from "@/components/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
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
    <html lang="en">
      <body className="font-sans antialiased">
        <div
          className={cn(
            "mx-auto flex min-h-svh w-full flex-col justify-center gap-6",
            SHELL_PADDING,
            SHELL_WIDTH_WIDE,
          )}
        >
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              An unexpected error occurred. Try again or return to search.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={reset} className="w-full sm:w-auto">
              Try again
            </Button>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto",
              )}
            >
              Back to search
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
