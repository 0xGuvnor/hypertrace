import Link from "next/link";

import { AddressWithTooltip } from "@/components/address-with-tooltip";
import { CopyAddressButton } from "@/components/copy-address-button";
import { WalletSummary } from "@/components/wallet-summary";
import { WalletTabs } from "@/components/wallet-tabs";
import { formatTimestamp } from "@/lib/format";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletDetail({ snapshot }: { snapshot: WalletSnapshot }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
        >
          ← Back to search
        </Link>
        <div className="flex items-center gap-1">
          <AddressWithTooltip address={snapshot.address} />
          <CopyAddressButton address={snapshot.address} />
        </div>
        <p className="text-muted-foreground text-xs">
          Fetched {formatTimestamp(snapshot.fetchedAt)}
        </p>
      </div>

      <WalletSummary account={snapshot.account} />
      <WalletTabs snapshot={snapshot} />
    </div>
  );
}
