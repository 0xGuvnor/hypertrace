"use client";

import { FillsTable } from "@/components/fills-table";
import { PositionsTable } from "@/components/positions-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WalletSnapshot } from "@/lib/wallet-types";

export function WalletTabs({ snapshot }: { snapshot: WalletSnapshot }) {
  return (
    <Tabs defaultValue="positions">
      <TabsList>
        <TabsTrigger value="positions">
          Positions ({snapshot.positions.length})
        </TabsTrigger>
        <TabsTrigger value="fills">
          Fills ({snapshot.recentFills.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="positions">
        <PositionsTable positions={snapshot.positions} />
      </TabsContent>
      <TabsContent value="fills">
        <FillsTable fills={snapshot.recentFills} />
      </TabsContent>
    </Tabs>
  );
}
