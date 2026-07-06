import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </AppShell>
  );
}
