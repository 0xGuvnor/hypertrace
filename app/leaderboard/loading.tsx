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

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet</TableHead>
              <TableHead className="text-right">Account value</TableHead>
              <TableHead className="text-right">Day PnL</TableHead>
              <TableHead className="text-right">Week</TableHead>
              <TableHead className="text-right">Month</TableHead>
              <TableHead className="text-right">All</TableHead>
              <TableHead className="text-right">Day Vol</TableHead>
              <TableHead className="text-right">Week Vol</TableHead>
              <TableHead className="text-right">Month Vol</TableHead>
              <TableHead className="text-right">All Vol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-14" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-3 w-12" />
                </TableCell>
                <TableCell className="text-right">
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
