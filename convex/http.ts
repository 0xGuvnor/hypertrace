import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { unauthorizedResponse, verifyIngestSecret } from "./lib/ingestAuth";
import type { WalletSnapshot } from "./lib/hyperliquidTypes";

const http = httpRouter();

http.route({
  path: "/ingest/watches",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const addresses = await ctx.runQuery(internal.watches.listActive, {});
    return Response.json({ addresses });
  }),
});

http.route({
  path: "/ingest/snapshot",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return new Response("Invalid body", { status: 400 });
    }

    await ctx.runMutation(internal.wallets.upsertSnapshot, {
      snapshot: body as WalletSnapshot,
    });
    return new Response(null, { status: 200 });
  }),
});

export default http;
