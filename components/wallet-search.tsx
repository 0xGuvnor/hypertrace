"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { isValidAddress, normalizeAddress } from "@/lib/address";

type WalletSearchProps = {
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  showLabel?: boolean;
};

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

export function WalletSearch({
  autoFocus = false,
  className,
  inputClassName,
  showLabel = false,
}: WalletSearchProps = {}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recent = useSyncExternalStore(
    subscribeRecent,
    getRecentSnapshot,
    getRecentServerSnapshot,
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function searchAddress() {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    searchAddress();
  }

  function handleRecentClick(address: string) {
    router.push(`/address/${address}`);
  }

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex w-full flex-col gap-2">
        {showLabel ? (
          <label
            htmlFor="wallet-search-input"
            className="text-sm text-muted-foreground"
          >
            Wallet address
          </label>
        ) : null}

        <form onSubmit={handleSubmit} className="relative w-full">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            ref={inputRef}
            id={showLabel ? "wallet-search-input" : undefined}
            type="text"
            placeholder="0x..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            className={cn(
              "h-11 min-w-0 w-full pl-9 font-mono text-base md:text-sm",
              "pr-20 sm:pr-28",
              "focus-visible:border-[var(--brand-cyan)]/40 focus-visible:ring-[var(--brand-cyan)]/25",
              inputClassName,
            )}
            spellCheck={false}
            autoComplete="off"
            autoFocus={autoFocus}
          />
          <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1.5">
            <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
            <Button
              type="submit"
              size="icon-sm"
              aria-label="Investigate wallet"
              className={cn(
                "relative size-8 rounded-md border-transparent",
                "bg-[var(--brand-cyan-fill)] text-black",
                "hover:bg-[var(--brand-cyan-fill)]/90",
                "active:not-aria-[haspopup]:translate-y-0",
                "focus-visible:ring-[var(--brand-cyan)]/40",
                "after:absolute after:top-1/2 after:left-1/2 after:size-10",
                "after:-translate-x-1/2 after:-translate-y-1/2 after:content-['']",
              )}
            >
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {recent.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">Recent</p>
          <div className="flex flex-wrap gap-2">
            {recent.map((address) => (
              <Tooltip key={address}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-9 font-mono text-xs"
                      onClick={() => handleRecentClick(address)}
                    />
                  }
                >
                  {address.slice(0, 6)}…{address.slice(-4)}
                </TooltipTrigger>
                <TooltipContent className="max-w-none font-mono break-all">
                  {address}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
