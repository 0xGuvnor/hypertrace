#!/usr/bin/env bun
/**
 * Regenerates worker/src/known-addresses.ts and convex/lib/knownAddresses.ts
 * from data/funding-denylist.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(
  readFileSync(resolve(root, "data/funding-denylist.json"), "utf8"),
) as {
  entries: Array<{ address: string; kind: string; label: string }>;
};

const entriesLit = JSON.stringify(data.entries, null, 2);

const body = `/** Auto-synced from data/funding-denylist.json. Do not edit by hand. */

export type FundingDenylistKind = "bridge" | "cctp" | "cex" | "router" | "token";

export type FundingDenylistEntry = {
  address: string;
  kind: FundingDenylistKind;
  label: string;
};

/** Sources funding more than this many HL wallets are treated as infrastructure. */
export const CLUSTER_SOURCE_FANOUT_CAP = 25;

export const FUNDING_DENYLIST_ENTRIES: FundingDenylistEntry[] = ${entriesLit};

const denylistSet = new Set(
  FUNDING_DENYLIST_ENTRIES.map((entry) => entry.address.toLowerCase()),
);

const labelByAddress = new Map(
  FUNDING_DENYLIST_ENTRIES.map((entry) => [entry.address.toLowerCase(), entry] as const),
);

export function isFundingDenylisted(address: string): boolean {
  return denylistSet.has(address.toLowerCase());
}

export function getFundingDenylistEntry(
  address: string,
): FundingDenylistEntry | undefined {
  return labelByAddress.get(address.toLowerCase());
}
`;

writeFileSync(resolve(root, "worker/src/known-addresses.ts"), `${body}\n`);
writeFileSync(resolve(root, "convex/lib/knownAddresses.ts"), `${body}\n`);
console.log(`synced ${data.entries.length} denylist entries`);
