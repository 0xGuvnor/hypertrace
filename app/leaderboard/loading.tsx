import { ListOrdered } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROW_COUNT = 6;
const DESKTOP_ONLY = "hidden md:table-cell";

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="relative flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
              />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="mt-2 h-8 w-56 sm:h-9 sm:w-72" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </div>
          <div className="shrink-0 sm:text-right">
            <Skeleton className="h-3 w-16 sm:ml-auto" />
            <Skeleton className="mt-1 h-5 w-28 sm:ml-auto" />
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-4">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-9 w-full rounded-full md:w-56" />
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-9 w-full rounded-full md:w-64" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-9 w-full rounded-full md:w-56" />
            </div>
          </div>
        </div>

        <Table
          leading={
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <ListOrdered
                aria-hidden
                className="size-3.5 shrink-0 text-[var(--brand-cyan)]"
              />
              <Skeleton className="h-3 w-40" />
            </div>
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead className="text-right">Account value</TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Day PnL
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Week
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Month
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>All</TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Day Vol
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Week Vol
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                Month Vol
              </TableHead>
              <TableHead className={`text-right ${DESKTOP_ONLY}`}>
                All Vol
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className={`text-right ${DESKTOP_ONLY}`}>
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
