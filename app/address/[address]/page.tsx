import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAction } from "convex/nextjs";

import { WalletDetail } from "@/components/wallet-detail";
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
    return { title: "Not found · Hypertrace" };
  }
  const address = normalizeAddress(raw);
  return {
    title: `${truncateAddress(address, 6)} · Hypertrace`,
    robots: { index: false, follow: false },
  };
}

export default async function AddressPage({ params }: PageProps) {
  const { address: raw } = await params;
  if (!isValidAddress(raw)) notFound();

  const snapshot = await fetchAction(api.wallets.getSnapshot, {
    address: normalizeAddress(raw),
  });

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col p-6">
      <WalletDetail snapshot={snapshot} />
    </div>
  );
}
