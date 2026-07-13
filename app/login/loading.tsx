import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8 sm:py-12">
        <div className="flex flex-col gap-5 rounded-xl border border-border/80 bg-card p-5 sm:gap-6 sm:p-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="border-t border-border/60 pt-5">
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
