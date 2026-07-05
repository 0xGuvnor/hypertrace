import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-lg font-medium">Invalid address</h1>
      <p className="text-muted-foreground text-sm">
        That URL does not contain a valid Ethereum wallet address (0x + 40 hex
        characters).
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        Back to search
      </Link>
    </div>
  );
}
