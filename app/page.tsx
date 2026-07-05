import { WalletSearch } from "@/components/wallet-search";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Hypertrace</h1>
          <p className="text-muted-foreground text-sm">
            Look up any Hyperliquid wallet. Positions, margin, and recent fills.
          </p>
        </div>
        <WalletSearch />
      </div>
    </div>
  );
}
