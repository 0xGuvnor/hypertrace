import type {
  DepositCursor,
  DepositRow,
  DepositSourceUpdate,
  LeaderboardUpsertRow,
  SelfSourcedDeposit,
  WalletSnapshot,
} from "./types";

export type LeaderboardIngestResult = {
  upserted: number;
  walletsCreated: number;
  pruned: number;
  continued: boolean;
};

export type ConvexIngestClient = {
  listActiveWatches(): Promise<string[]>;
  upsertSnapshot(snapshot: WalletSnapshot): Promise<void>;
  getDepositCursors(
    addresses: string[],
  ): Promise<Record<string, number | null>>;
  ingestDeposits(
    deposits: DepositRow[],
    cursors: DepositCursor[],
  ): Promise<{ inserted: number; skipped: number; updated: number }>;
  listSelfSourcedDeposits(addresses: string[]): Promise<SelfSourcedDeposit[]>;
  patchDepositSources(
    updates: DepositSourceUpdate[],
  ): Promise<{ updated: number; skipped: number }>;
  getSnapshotTimestamps(
    addresses: string[],
  ): Promise<Record<string, number | null>>;
  ingestLeaderboardBatch(
    rows: LeaderboardUpsertRow[],
    fetchedAt: number,
    prune: boolean,
  ): Promise<LeaderboardIngestResult>;
};

export function createConvexIngestClient(
  convexSiteUrl: string,
  ingestSecret: string,
): ConvexIngestClient {
  const headers = {
    "x-ingest-secret": ingestSecret,
    "content-type": "application/json",
  };

  return {
    async listActiveWatches() {
      const response = await fetch(`${convexSiteUrl}/ingest/watches`, { headers });
      if (!response.ok) {
        throw new Error(`Failed to list watches (${response.status})`);
      }
      const body = (await response.json()) as { addresses?: string[] };
      return body.addresses ?? [];
    },

    async upsertSnapshot(snapshot) {
      const response = await fetch(`${convexSiteUrl}/ingest/snapshot`, {
        method: "POST",
        headers,
        body: JSON.stringify(snapshot),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to upsert snapshot (${response.status}): ${text}`);
      }
    },

    async getDepositCursors(addresses) {
      if (addresses.length === 0) {
        return {};
      }
      const query = encodeURIComponent(addresses.join(","));
      const response = await fetch(
        `${convexSiteUrl}/ingest/deposit-cursors?addresses=${query}`,
        { headers },
      );
      if (!response.ok) {
        throw new Error(`Failed to get deposit cursors (${response.status})`);
      }
      const body = (await response.json()) as {
        cursors?: Record<string, number | null>;
      };
      return body.cursors ?? {};
    },

    async ingestDeposits(deposits, cursors) {
      const response = await fetch(`${convexSiteUrl}/ingest/deposits`, {
        method: "POST",
        headers,
        body: JSON.stringify({ deposits, cursors }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ingest deposits (${response.status}): ${text}`);
      }
      return (await response.json()) as {
        inserted: number;
        skipped: number;
        updated: number;
      };
    },

    async listSelfSourcedDeposits(addresses) {
      if (addresses.length === 0) {
        return [];
      }
      const query = encodeURIComponent(addresses.join(","));
      const response = await fetch(
        `${convexSiteUrl}/ingest/deposits-self-sourced?addresses=${query}`,
        { headers },
      );
      if (!response.ok) {
        throw new Error(`Failed to list self-sourced deposits (${response.status})`);
      }
      const body = (await response.json()) as { deposits?: SelfSourcedDeposit[] };
      return body.deposits ?? [];
    },

    async patchDepositSources(updates) {
      const response = await fetch(`${convexSiteUrl}/ingest/deposit-sources`, {
        method: "POST",
        headers,
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to patch deposit sources (${response.status}): ${text}`);
      }
      return (await response.json()) as { updated: number; skipped: number };
    },

    async getSnapshotTimestamps(addresses) {
      if (addresses.length === 0) {
        return {};
      }
      const query = encodeURIComponent(addresses.join(","));
      const response = await fetch(
        `${convexSiteUrl}/ingest/snapshot-timestamps?addresses=${query}`,
        { headers },
      );
      if (!response.ok) {
        throw new Error(`Failed to get snapshot timestamps (${response.status})`);
      }
      const body = (await response.json()) as {
        timestamps?: Record<string, number | null>;
      };
      return body.timestamps ?? {};
    },

    async ingestLeaderboardBatch(rows, fetchedAt, prune) {
      const response = await fetch(`${convexSiteUrl}/ingest/leaderboard`, {
        method: "POST",
        headers,
        body: JSON.stringify({ rows, fetchedAt, prune }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Failed to ingest leaderboard (${response.status}): ${text}`,
        );
      }
      return (await response.json()) as LeaderboardIngestResult;
    },
  };
}
