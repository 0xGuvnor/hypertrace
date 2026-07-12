import { parseLeaderboardResponse } from "../convex/lib/leaderboardParse";

const LEADERBOARD_URL = "https://stats-data.hyperliquid.xyz/Mainnet/leaderboard";
const BATCH = 200;

const res = await fetch(LEADERBOARD_URL, {
  headers: {
    Accept: "application/json",
    "User-Agent": "hypertrace-ingest/1.0",
  },
});
if (!res.ok) {
  throw new Error(`fetch ${res.status}`);
}
const data: unknown = await res.json();
const { rows, skipped } = parseLeaderboardResponse(data);
console.log(
  JSON.stringify({
    rows: rows.length,
    skipped,
    sampleVlm: rows[0] && {
      vlmDay: rows[0].vlmDay,
      vlmAllTime: rows[0].vlmAllTime,
    },
  }),
);

const fetchedAt = Date.now();
let upserted = 0;
let walletsCreated = 0;

for (let i = 0; i < rows.length; i += BATCH) {
  const chunk = rows.slice(i, i + BATCH);
  const prune = i + BATCH >= rows.length;
  const argsPath = `/tmp/lb-batch-${i}.json`;
  await Bun.write(
    argsPath,
    JSON.stringify({ rows: chunk, fetchedAt, prune }),
  );
  const proc = Bun.spawn(
    [
      "bunx",
      "convex",
      "run",
      "internal.leaderboard.ingestBatch",
      await Bun.file(argsPath).text(),
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const out = await new Response(proc.stdout).text();
  const err = await new Response(proc.stderr).text();
  const code = await proc.exited;
  if (code !== 0) {
    console.error("batch failed", i, err || out);
    process.exit(1);
  }
  const parsed = JSON.parse(out) as {
    upserted: number;
    walletsCreated: number;
  };
  upserted += parsed.upserted ?? 0;
  walletsCreated += parsed.walletsCreated ?? 0;
  console.log(`batch ${i}/${rows.length}`, parsed);
}

console.log(JSON.stringify({ done: true, upserted, walletsCreated, fetchedAt }));
