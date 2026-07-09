"use client";

import { ResponsiveHint } from "@/components/responsive-hint";
import { truncateAddress } from "@/lib/address";

export function AddressWithTooltip({ address }: { address: string }) {
  const explorerUrl = `https://app.hyperliquid.xyz/explorer/address/${address}`;

  return (
    <ResponsiveHint
      as="h1"
      label={truncateAddress(address, 6)}
      content={
        <span className="flex flex-col gap-2">
          <span className="font-mono break-all">{address}</span>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary w-fit underline-offset-4 hover:underline"
          >
            Open in Hyperliquid
          </a>
        </span>
      }
      triggerClassName="min-w-0 truncate font-mono text-base font-medium sm:text-lg"
      contentClassName="max-w-none"
    />
  );
}
