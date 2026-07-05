import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <AppShell className="justify-center gap-6">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-medium">Invalid address</h1>
        <p className="text-muted-foreground text-sm">
          That URL does not contain a valid Ethereum wallet address (0x + 40 hex
          characters).
        </p>
      </div>
      <Link href="/" className={cn(buttonVariants(), "w-full sm:w-auto")}>
        Back to search
      </Link>
    </AppShell>
  );
}
