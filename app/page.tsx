import { AppShell } from "@/components/app-shell";
import { HomeHero } from "@/components/home-hero";
import { InvestigationConsole } from "@/components/investigation-console";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <AppShell width="wide" className="pb-8 sm:pb-10">
      <SiteHeader variant="compact" />
      <div className="flex flex-1 flex-col justify-center py-8 sm:py-10 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <HomeHero />
          <InvestigationConsole />
        </div>
      </div>
    </AppShell>
  );
}
