import { createConvexIngestClient } from "./convex-client";
import { loadConfig } from "./config";
import { fetchWalletSnapshot } from "./hyperliquid";
import { HyperliquidSocket } from "./hyperliquid-socket";

const config = loadConfig();
const convex = createConvexIngestClient(config.convexSiteUrl, config.ingestSecret);

const refreshTimers = new Map<string, ReturnType<typeof setTimeout>>();
const inFlight = new Set<string>();

function startHealthServer() {
  Bun.serve({
    port: config.port,
    fetch(request) {
      const url = new URL(request.url);
      if (url.pathname === "/health") {
        return new Response("ok");
      }
      return new Response("hypertrace worker", { status: 404 });
    },
  });
  console.log(`[health] listening on :${config.port}`);
}

async function refreshAddress(address: string, reason: string) {
  if (inFlight.has(address)) return;
  inFlight.add(address);
  try {
    const snapshot = await fetchWalletSnapshot(address);
    await convex.upsertSnapshot(snapshot);
    console.log(`[snapshot] ${address.slice(0, 8)}… (${reason})`);
  } catch (error) {
    console.error(`[snapshot] failed for ${address}`, error);
  } finally {
    inFlight.delete(address);
  }
}

function scheduleRefresh(address: string, reason: string) {
  const existing = refreshTimers.get(address);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    refreshTimers.delete(address);
    void refreshAddress(address, reason);
  }, config.refreshDebounceMs);

  refreshTimers.set(address, timer);
}

async function syncWatches(socket: HyperliquidSocket) {
  try {
    const addresses = await convex.listActiveWatches();
    socket.syncAddresses(addresses);
    console.log(`[watches] tracking ${addresses.length} address(es)`);

    for (const address of addresses) {
      scheduleRefresh(address, "watch-sync");
    }
  } catch (error) {
    console.error("[watches] sync failed", error);
  }
}

async function main() {
  startHealthServer();

  const socket = new HyperliquidSocket({
    wsUrl: config.hlWsUrl,
    onUserEvent: (address) => scheduleRefresh(address, "ws-event"),
    onReady: () => {
      void syncWatches(socket);
    },
    onDisconnect: () => {
      console.warn("[worker] hyperliquid socket disconnected");
    },
  });

  socket.start();
  setInterval(() => {
    void syncWatches(socket);
  }, config.watchPollMs);

  console.log("[worker] hypertrace ingestion worker started");
}

void main();
