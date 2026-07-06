import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAction, fetchQuery } from "convex/nextjs";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { WalletDetailLive } from "@/components/wallet-detail-live";
import { api } from "@/convex/_generated/api";
import { isValidAddress, normalizeAddress, truncateAddress } from "@/lib/address";

type PageProps = {
  params: Promise<{ address: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { address: raw } = await params;
  if (!isValidAddress(raw)) {
    return { title: "Not found" };
  }
  const address = normalizeAddress(raw);
  return {
    title: truncateAddress(address, 6),
    robots: { index: false, follow: false },
  };
}

export default async function AddressPage({ params }: PageProps) {
  const { address: raw } = await params;
  if (!isValidAddress(raw)) notFound();

  const address = normalizeAddress(raw);
  const [snapshot, initialWalletClusters, initialDeposits] = await Promise.all([
    fetchAction(api.wallets.getSnapshot, { address }),
    fetchQuery(api.clusters.getForWallet, { address }),
    fetchQuery(api.deposits.listByWallet, { address }),
  ]);

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <WalletDetailLive
        address={address}
        initialSnapshot={snapshot}
        initialWalletClusters={initialWalletClusters}
        initialDeposits={initialDeposits}
      />
    </AppShell>
  );
}
