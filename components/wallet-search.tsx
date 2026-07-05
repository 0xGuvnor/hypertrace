"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidAddress, normalizeAddress } from "@/lib/address";

const RECENT_KEY = "hypertrace:recent-addresses";
const MAX_RECENT = 5;
const SERVER_SNAPSHOT: string[] = [];

let cachedSnapshot: string[] = SERVER_SNAPSHOT;
let cachedStorageValue: string | null = null;

const listeners = new Set<() => void>();

function parseRecent(raw: string | null): string[] {
  if (!raw) return SERVER_SNAPSHOT;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SERVER_SNAPSHOT;
    const addresses = parsed.filter((a): a is string => typeof a === "string");
    return addresses.length > 0 ? addresses : SERVER_SNAPSHOT;
  } catch {
    return SERVER_SNAPSHOT;
  }
}

function getRecentSnapshot(): string[] {
  const raw = localStorage.getItem(RECENT_KEY);
  if (raw === cachedStorageValue) return cachedSnapshot;
  cachedStorageValue = raw;
  cachedSnapshot = parseRecent(raw);
  return cachedSnapshot;
}

function getRecentServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function subscribeRecent(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === RECENT_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function invalidateRecentCache() {
  cachedStorageValue = null;
  for (const listener of listeners) listener();
}

function loadRecent(): string[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  return getRecentSnapshot();
}

function saveRecent(address: string) {
  const recent = loadRecent().filter((a) => a !== address);
  recent.unshift(address);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  invalidateRecentCache();
}

export function WalletSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recent = useSyncExternalStore(
    subscribeRecent,
    getRecentSnapshot,
    getRecentServerSnapshot,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!isValidAddress(trimmed)) {
      setError("Enter a valid 0x address (42 characters).");
      return;
    }
    const normalized = normalizeAddress(trimmed);
    saveRecent(normalized);
    setError(null);
    router.push(`/address/${normalized}`);
  }

  function handleRecentClick(address: string) {
    router.push(`/address/${address}`);
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="0x..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          className="font-mono text-sm"
          spellCheck={false}
          autoComplete="off"
        />
        <Button type="submit">Search</Button>
      </form>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {recent.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {recent.map((address) => (
            <Button
              key={address}
              type="button"
              variant="outline"
              size="sm"
              className="font-mono text-xs"
              onClick={() => handleRecentClick(address)}
            >
              {address.slice(0, 6)}…{address.slice(-4)}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
