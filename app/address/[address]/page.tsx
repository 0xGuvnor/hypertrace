import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAction, fetchQuery, preloadQuery } from "convex/nextjs";
import type { Preloaded } from "convex/react";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { WalletDetailLive } from "@/components/wallet-detail-live";
import { WalletLoadError } from "@/components/wallet-load-error";
import { api } from "@/convex/_generated/api";
import { isValidAddress, normalizeAddress, truncateAddress } from "@/lib/address";
import { walletLoadUserMessage } from "@/lib/wallet-load-error";
import type { WalletSnapshot } from "@/lib/wallet-types";

type PageProps = {
  params: Promise<{ address: string }>;
};

type WalletPageLoadResult =
  | {
      ok: true;
      initialSnapshot: WalletSnapshot;
      firstActivityAt: number | null;
      preloadedWalletClusters: Preloaded<typeof api.clusters.getForWallet>;
      preloadedDeposits: Preloaded<typeof api.deposits.listByWallet>;
    }
  | { ok: false; message: string };

async function loadFirstActivity(address: string): Promise<number | null> {
  try {
    return await fetchAction(api.wallets.getFirstActivity, { address });
  } catch {
    return null;
  }
}

async function loadWalletPageData(address: string): Promise<WalletPageLoadResult> {
  try {
    const [cachedSnapshot, preloadedWalletClusters, preloadedDeposits, firstActivityAt] =
      await Promise.all([
        fetchQuery(api.wallets.getLiveSnapshot, { address }),
        preloadQuery(api.clusters.getForWallet, { address }),
        preloadQuery(api.deposits.listByWallet, { address }),
        loadFirstActivity(address),
      ]);

    const initialSnapshot =
      cachedSnapshot ??
      (await fetchAction(api.wallets.getSnapshot, { address }));

    return {
      ok: true,
      initialSnapshot,
      firstActivityAt,
      preloadedWalletClusters,
      preloadedDeposits,
    };
  } catch (error) {
    return { ok: false, message: walletLoadUserMessage(error) };
  }
}

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
  const result = await loadWalletPageData(address);

  if (!result.ok) {
    return (
      <AppShell className="gap-6">
        <SiteHeader variant="compact" className="items-start" />
        <WalletLoadError message={result.message} />
      </AppShell>
    );
  }

  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <WalletDetailLive
        address={address}
        initialSnapshot={result.initialSnapshot}
        firstActivityAt={result.firstActivityAt}
        preloadedWalletClusters={result.preloadedWalletClusters}
        preloadedDeposits={result.preloadedDeposits}
      />
    </AppShell>
  );
}
