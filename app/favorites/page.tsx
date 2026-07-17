import type { Metadata } from "next";

import { AppShell } from "@/components/app-shell";
import { FavoritesList } from "@/components/favorites-list";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <AppShell className="gap-6 sm:gap-8">
      <SiteHeader variant="compact" className="items-start" />
      <div className="flex min-w-0 flex-col gap-6">
        <div>
          <p className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-[0.16em] uppercase">
            <span
              aria-hidden
              className="size-1.5 shrink-0 rounded-full bg-[var(--brand-cyan)]"
            />
            <span>
              Account
              <span className="text-muted-foreground/50 mx-1.5">/</span>
              Favorites
            </span>
          </p>
          <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Favorites
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-pretty text-sm leading-relaxed">
            Wallets you have starred for quick return.
          </p>
        </div>
        <FavoritesList />
      </div>
    </AppShell>
  );
}
