import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex flex-col items-start gap-4 py-8">
        <h1 className="text-lg font-semibold">Cluster not found</h1>
        <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
          This cluster may have dissolved if wallets no longer share a funding
          source, or the link may be invalid.
        </p>
        <Button render={<Link href="/clusters" />}>Browse clusters</Button>
      </div>
    </AppShell>
  );
}
