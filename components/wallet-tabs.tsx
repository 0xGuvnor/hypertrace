"use client";

import { useCallback, useState } from "react";

import { FillsTable } from "@/components/fills-table";
import { OrdersTable } from "@/components/orders-table";
import { PositionsTable } from "@/components/positions-table";
import { SpotHoldingsTable } from "@/components/spot-holdings-table";
import { TransfersTable } from "@/components/transfers-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WalletDeposits } from "@/lib/cluster-types";
import type { WalletSnapshot } from "@/lib/wallet-types";
import {
  type PositionsSortKey,
  type WalletView,
  isWalletTab,
  walletHref,
} from "@/lib/wallet-view";

function replaceWalletUrl(address: string, view: WalletView): void {
  window.history.replaceState(null, "", walletHref(address, view));
}

export function WalletTabs({
  snapshot,
  walletDeposits,
  initialView,
}: {
  snapshot: WalletSnapshot;
  walletDeposits: WalletDeposits;
  initialView: WalletView;
}) {
  const { deposits, hasMore } = walletDeposits;
  const transferCountLabel = hasMore
    ? `${deposits.length}+`
    : `${deposits.length}`;
  const spotCount = snapshot.spotBalances?.length ?? 0;

  const [view, setView] = useState<WalletView>(initialView);

  const applyView = useCallback(
    (updater: (prev: WalletView) => WalletView) => {
      setView((prev) => {
        const next = updater(prev);
        replaceWalletUrl(snapshot.address, next);
        return next;
      });
    },
    [snapshot.address],
  );

  const handleTabChange = useCallback(
    (value: string | number | null) => {
      if (!isWalletTab(value)) return;
      applyView((prev) => ({ ...prev, tab: value }));
    },
    [applyView],
  );

  const handlePositionsSort = useCallback(
    (key: PositionsSortKey) => {
      applyView((prev) => {
        if (key === prev.positionsSortKey) {
          return {
            ...prev,
            positionsOrder: prev.positionsOrder === "asc" ? "desc" : "asc",
          };
        }
        return {
          ...prev,
          positionsSortKey: key,
          positionsOrder: "desc",
        };
      });
    },
    [applyView],
  );

  const handleSpotSort = useCallback(() => {
    applyView((prev) => ({
      ...prev,
      spotOrder: prev.spotOrder === "asc" ? "desc" : "asc",
    }));
  }, [applyView]);

  return (
    <Tabs
      value={view.tab}
      onValueChange={handleTabChange}
      className="min-w-0"
    >
      <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:overflow-visible">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger
            value="positions"
            className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm"
          >
            <span className="sm:hidden">Pos</span>
            <span className="hidden sm:inline">Positions</span>
            <span className="text-muted-foreground">
              ({snapshot.positions.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="spot"
            className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm"
          >
            Spot
            <span className="text-muted-foreground">({spotCount})</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm"
          >
            Orders
            <span className="text-muted-foreground">
              ({snapshot.openOrders.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="fills"
            className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm"
          >
            Fills
            <span className="text-muted-foreground">
              ({snapshot.recentFills.length})
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="transfers"
            className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm"
          >
            <span className="sm:hidden">Xfer</span>
            <span className="hidden sm:inline">Transfers</span>
            <span className="text-muted-foreground">({transferCountLabel})</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="positions" className="min-w-0">
        <PositionsTable
          positions={snapshot.positions}
          sortKey={view.positionsSortKey}
          sortDir={view.positionsOrder}
          onSort={handlePositionsSort}
        />
      </TabsContent>
      <TabsContent value="spot" className="min-w-0">
        <SpotHoldingsTable
          holdings={snapshot.spotBalances ?? []}
          sortDir={view.spotOrder}
          onSort={handleSpotSort}
        />
      </TabsContent>
      <TabsContent value="orders" className="min-w-0">
        <OrdersTable orders={snapshot.openOrders} />
      </TabsContent>
      <TabsContent value="fills" className="min-w-0">
        <FillsTable fills={snapshot.recentFills} />
      </TabsContent>
      <TabsContent value="transfers" className="min-w-0">
        <TransfersTable transfers={deposits} hasMore={hasMore} />
      </TabsContent>
    </Tabs>
  );
}
