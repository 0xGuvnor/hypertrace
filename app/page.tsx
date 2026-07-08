import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteHeroBrand } from "@/components/site-hero-brand";
import { WalletSearch } from "@/components/wallet-search";

export default function Page() {
  return (
    <AppShell
      width="narrow"
      className="items-center pb-10 sm:pb-14"
    >
      <SiteHeader variant="minimal" />
      <div className="flex w-full flex-col items-center gap-6 pt-[clamp(1.5rem,24vh,11rem)] sm:gap-7">
        <SiteHeroBrand />
        <WalletSearch
          autoFocus
          className="w-full"
          inputClassName="h-10 sm:h-11 focus-visible:border-[var(--brand-cyan)]/40 focus-visible:ring-[var(--brand-cyan)]/25"
        />
      </div>
    </AppShell>
  );
}
