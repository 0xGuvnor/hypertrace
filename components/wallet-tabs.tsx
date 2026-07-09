"use client";

import { DepositsTable } from "@/components/deposits-table";
import { FillsTable } from "@/components/fills-table";
import { OrdersTable } from "@/components/orders-table";
import { PositionsTable } from "@/components/positions-table";
import { SpotHoldingsTable } from "@/components/spot-holdings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WalletDeposits } from "@/lib/cluster-types";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletTabs({
  snapshot,
  walletDeposits,
}: {
  snapshot: WalletSnapshot;
  walletDeposits: WalletDeposits;
}) {
  const { deposits, hasMore } = walletDeposits;
  const depositCountLabel = hasMore ? `${deposits.length}+` : `${deposits.length}`;
  const spotCount = snapshot.spotBalances?.length ?? 0;

  return (
    <Tabs defaultValue="positions" className="min-w-0">
      <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:overflow-visible">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="positions" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            <span className="sm:hidden">Pos</span>
            <span className="hidden sm:inline">Positions</span>
            <span className="text-muted-foreground">({snapshot.positions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="spot" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            Spot
            <span className="text-muted-foreground">({spotCount})</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            Orders
            <span className="text-muted-foreground">({snapshot.openOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="fills" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            Fills
            <span className="text-muted-foreground">({snapshot.recentFills.length})</span>
          </TabsTrigger>
          <TabsTrigger value="deposits" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            <span className="sm:hidden">Dep</span>
            <span className="hidden sm:inline">Deposits</span>
            <span className="text-muted-foreground">({depositCountLabel})</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="positions" className="min-w-0">
        <PositionsTable positions={snapshot.positions} />
      </TabsContent>
      <TabsContent value="spot" className="min-w-0">
        <SpotHoldingsTable holdings={snapshot.spotBalances ?? []} />
      </TabsContent>
      <TabsContent value="orders" className="min-w-0">
        <OrdersTable orders={snapshot.openOrders} />
      </TabsContent>
      <TabsContent value="fills" className="min-w-0">
        <FillsTable fills={snapshot.recentFills} />
      </TabsContent>
      <TabsContent value="deposits" className="min-w-0">
        <DepositsTable deposits={deposits} hasMore={hasMore} />
      </TabsContent>
    </Tabs>
  );
}
