import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type WalletLoadErrorProps = {
  message: string;
  onRetry?: () => void;
};

export function WalletLoadError({ message, onRetry }: WalletLoadErrorProps) {
  return (
    <>
      <Alert variant="destructive">
        <AlertTitle>Could not load wallet</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      <div className="flex flex-col gap-2 sm:flex-row">
        {onRetry ? (
          <Button type="button" onClick={onRetry} className="w-full sm:w-auto">
            Try again
          </Button>
        ) : (
          <Link
            href="."
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            Try again
          </Link>
        )}
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
