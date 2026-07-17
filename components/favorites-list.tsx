"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useState } from "react";

import { AddressWithTooltip } from "@/components/address-with-tooltip";
import { TablePagination } from "@/components/table-pagination";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { paginateItems } from "@/lib/table-page";
import { cn } from "@/lib/utils";

export function FavoritesList() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const favorites = useQuery(
    api.favorites.list,
    isAuthenticated ? {} : "skip",
  );
  const toggle = useMutation(api.favorites.toggle);
  const [page, setPage] = useState(0);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="h-40 animate-pulse rounded-xl border border-border/80 bg-card/40" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border/80 bg-card p-5 text-center sm:p-6">
        <p className="text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty">
          Sign in to see wallets you have favorited.
        </p>
        <Link
          href="/login?next=%2Ffavorites"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (favorites === undefined || favorites === null) {
    return (
      <div className="h-40 animate-pulse rounded-xl border border-border/80 bg-card/40" />
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl border border-border/80 bg-card p-5 text-center sm:p-6">
        <p className="text-muted-foreground max-w-prose text-sm leading-relaxed text-pretty">
          No favorites yet. Open a wallet and tap the star to save it here.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Investigate a wallet
        </Link>
      </div>
    );
  }

  const {
    pageItems,
    pageCount,
    showPagination,
    rangeStart,
    rangeEnd,
  } = paginateItems(favorites, page);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Wallet</TableHead>
            <TableHead className="w-12 text-right">
              <span className="sr-only">Favorite</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => (
            <TableRow key={item.address}>
              <TableCell>
                <Link
                  href={`/address/${item.address}`}
                  className="inline-flex min-h-11 items-center underline-offset-4 outline-none hover:text-[var(--brand-cyan)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]/50 [text-decoration-thickness:from-font] [text-underline-position:from-font]"
                >
                  <AddressWithTooltip address={item.address} />
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={pendingAddress === item.address}
                  aria-label="Remove from favorites"
                  title="Remove favorite"
                  className={cn(
                    "relative",
                    "after:absolute after:top-1/2 after:left-1/2 after:size-10",
                    "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
                  )}
                  onClick={() => {
                    setPendingAddress(item.address);
                    void toggle({ address: item.address }).finally(() => {
                      setPendingAddress(null);
                    });
                  }}
                >
                  <Star className="fill-[var(--brand-cyan)] text-[var(--brand-cyan)]" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination ? (
        <TablePagination
          page={page}
          pageCount={pageCount}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={favorites.length}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}
