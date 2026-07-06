import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { WalletSearch } from "@/components/wallet-search";

export default function Page() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,var(--brand-cyan)_0%,transparent_55%)] opacity-[0.08] dark:opacity-[0.14]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_35%_at_50%_0%,var(--brand-purple)_0%,transparent_50%)] opacity-[0.05] dark:opacity-[0.09]"
      />
      <AppShell
        width="narrow"
        className="relative items-center pb-10 sm:pb-14"
      >
        <div className="flex w-full flex-col items-center gap-6 pt-[clamp(1.5rem,24vh,11rem)] sm:gap-7">
          <SiteHeader variant="hero" />
          <WalletSearch
            autoFocus
            className="w-full"
            inputClassName="h-10 sm:h-11 focus-visible:border-[var(--brand-cyan)]/40 focus-visible:ring-[var(--brand-cyan)]/25"
          />
        </div>
      </AppShell>
    </div>
  );
}
