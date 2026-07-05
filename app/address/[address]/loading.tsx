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

const SUMMARY_LABELS = ["Account value", "Margin used", "Withdrawable"] as const;
const TAB_WIDTHS = ["w-[5.5rem]", "w-20", "w-16"] as const;
const TABLE_ROW_COUNT = 3;

export default function Loading() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-28" />
          <div className="flex min-w-0 items-center gap-1">
            <Skeleton className="h-7 w-44 sm:w-52" />
            <Skeleton className="size-8 shrink-0 rounded-md" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
            <div className="inline-flex h-8 w-max min-w-full items-center gap-1 rounded-lg bg-muted p-[3px] sm:min-w-0 sm:w-fit">
              {TAB_WIDTHS.map((width, index) => (
                <Skeleton
                  key={index}
                  className={`h-[calc(100%-2px)] rounded-md ${width}`}
                />
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Entry</TableHead>
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
                    <Skeleton className="ml-auto h-4 w-8" />
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
