"use client";

import { FillsTable } from "@/components/fills-table";
import { OrdersTable } from "@/components/orders-table";
import { PositionsTable } from "@/components/positions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletTabs({ snapshot }: { snapshot: WalletSnapshot }) {
  return (
    <Tabs defaultValue="positions" className="min-w-0">
      <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:overflow-visible">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="positions" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            <span className="sm:hidden">Pos</span>
            <span className="hidden sm:inline">Positions</span>
            <span className="text-muted-foreground">({snapshot.positions.length})</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            Orders
            <span className="text-muted-foreground">({snapshot.openOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="fills" className="min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
            Fills
            <span className="text-muted-foreground">({snapshot.recentFills.length})</span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="positions" className="min-w-0">
        <PositionsTable positions={snapshot.positions} />
      </TabsContent>
      <TabsContent value="orders" className="min-w-0">
        <OrdersTable orders={snapshot.openOrders} />
      </TabsContent>
      <TabsContent value="fills" className="min-w-0">
        <FillsTable fills={snapshot.recentFills} />
      </TabsContent>
    </Tabs>
  );
}
