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
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-pretty sm:text-xl">
            Favorites
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Wallets you have starred for quick return.
          </p>
        </div>
        <FavoritesList />
      </div>
    </AppShell>
  );
}
