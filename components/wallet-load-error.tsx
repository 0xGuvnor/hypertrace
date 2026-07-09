"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WalletLoadErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function WalletLoadError({ message, onRetry }: WalletLoadErrorProps) {
  const router = useRouter();

  return (
    <>
      <Alert variant="destructive">
        <AlertTitle>Could not load wallet</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          onClick={onRetry ?? (() => router.refresh())}
          className="w-full sm:w-auto"
        >
          Try again
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          Back to search
        </Link>
      </div>
    </>
  );
}
