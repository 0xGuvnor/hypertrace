import { AppShell } from "@/components/app-shell";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SUMMARY_LABELS = [
  "Account value",
  "Spot",
  "Margin used",
  "Withdrawable",
] as const;
const TAB_WIDTHS = ["w-[5.5rem]", "w-16", "w-20", "w-16", "w-16"] as const;
const TABLE_ROW_COUNT = 3;

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <Skeleton className="h-4 w-10 shrink-0" />
            <Skeleton className="h-7 w-44 sm:w-52" />
            <Skeleton className="size-8 shrink-0 rounded-md" />
          </div>
          <Skeleton className="h-6 w-44 rounded-full" />
        </div>

        <Card size="sm" className="border-[var(--brand-cyan)]/20">
          <CardHeader>
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full max-w-sm" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SUMMARY_LABELS.map((label) => (
            <Card key={label} size="sm">
              <CardHeader>
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:overflow-visible">
            <div className="inline-flex h-8 w-full items-center gap-1 rounded-lg bg-muted p-[3px] sm:w-fit">
              {TAB_WIDTHS.map((width, index) => (
                <Skeleton
                  key={index}
                  className={`h-[calc(100%-2px)] flex-1 rounded-md sm:flex-none ${width}`}
                />
              ))}
            </div>
          </div>

          <Table
            leading={
              <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-3 py-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            }
          >
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Mark</TableHead>
                <TableHead className="text-right">uPnL</TableHead>
                <TableHead className="text-right">Liq. price</TableHead>
                <TableHead className="text-right">TP</TableHead>
                <TableHead className="text-right">SL</TableHead>
                <TableHead className="text-right">Leverage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: TABLE_ROW_COUNT }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-14" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppShell>
  );
}
