import type { WalletSnapshot } from "./types";

export type ConvexIngestClient = {
  listActiveWatches(): Promise<string[]>;
  upsertSnapshot(snapshot: WalletSnapshot): Promise<void>;
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
  };
}
