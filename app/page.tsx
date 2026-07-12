import { AppShell } from "@/components/app-shell";
import { HomeHero } from "@/components/home-hero";
import { InvestigationConsole } from "@/components/investigation-console";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <AppShell width="wide" className="pb-8 sm:pb-10">
      <SiteHeader variant="compact" />
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-0">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <HomeHero className="h-full" />
            <InvestigationConsole className="h-full" />
          </div>
        </div>
        <footer className="mt-auto flex items-center justify-between gap-4 border-t border-border/40 pt-6">
          <p className="font-mono text-[0.65rem] tracking-[0.1em] text-muted-foreground uppercase">
            Hypertrace protocol
          </p>
          <p className="font-mono text-[0.65rem] tracking-[0.1em] text-muted-foreground uppercase">
            Index status: nominal
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
