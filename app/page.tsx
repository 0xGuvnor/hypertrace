import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { WalletSearch } from "@/components/wallet-search";

export default function Page() {
  return (
    <AppShell
      width="narrow"
      className="items-center justify-center gap-8 sm:gap-10"
    >
      <SiteHeader variant="hero" />
      <WalletSearch />
    </AppShell>
  );
}
