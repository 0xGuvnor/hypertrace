import { parseLeaderboardResponse } from "./lib/leaderboardParse";
import type { LeaderboardUpsertRow } from "./lib/leaderboardParse";

export const LEADERBOARD_URL =
  "https://stats-data.hyperliquid.xyz/Mainnet/leaderboard";

export const LEADERBOARD_UPSERT_BATCH_SIZE = 100;

export type FetchLeaderboardResult =
  | {
      ok: true;
      rows: LeaderboardUpsertRow[];
      skipped: number;
    }
  | {
      ok: false;
      reason: string;
    };

export async function fetchAndParseLeaderboard(
  url: string = LEADERBOARD_URL,
): Promise<FetchLeaderboardResult> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Leaderboard fetch failed";
    return { ok: false, reason };
  }

  if (!response.ok) {
    return { ok: false, reason: `Leaderboard fetch failed: ${response.status}` };
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : "Leaderboard JSON parse failed";
    return { ok: false, reason };
  }

  const { rows, skipped } = parseLeaderboardResponse(data);
  if (rows.length === 0) {
    return {
      ok: false,
      reason:
        skipped > 0
          ? `No valid leaderboard rows (skipped ${skipped})`
          : "No leaderboard rows in response",
    };
  }

  return { ok: true, rows, skipped };
}

export function chunkLeaderboardRows(
  rows: LeaderboardUpsertRow[],
  batchSize: number = LEADERBOARD_UPSERT_BATCH_SIZE,
): LeaderboardUpsertRow[][] {
  const chunks: LeaderboardUpsertRow[][] = [];
  for (let i = 0; i < rows.length; i += batchSize) {
    chunks.push(rows.slice(i, i + batchSize));
  }
  return chunks;
}
