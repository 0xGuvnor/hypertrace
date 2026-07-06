"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { WalletLoadError } from "@/components/wallet-load-error";
import { walletLoadUserMessage } from "@/lib/wallet-load-error";

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
      <WalletLoadError
        message={walletLoadUserMessage(error)}
        onRetry={reset}
      />
    </AppShell>
  );
}
