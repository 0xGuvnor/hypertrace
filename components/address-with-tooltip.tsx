"use client";

import { ResponsiveHint } from "@/components/responsive-hint";
import { truncateAddress } from "@/lib/address";

export function AddressWithTooltip({ address }: { address: string }) {
  return (
    <ResponsiveHint
      as="h1"
      label={truncateAddress(address, 6)}
      content={address}
      triggerClassName="min-w-0 truncate font-mono text-base font-medium sm:text-lg"
      contentClassName="max-w-none font-mono break-all"
    />
  );
}
