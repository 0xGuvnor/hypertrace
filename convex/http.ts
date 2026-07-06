import { httpRouter } from "convex/server";

import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { unauthorizedResponse, verifyIngestSecret } from "./lib/ingestAuth";
import {
  parseIngestCursorsBody,
  parseIngestDepositsBody,
  parseIngestDepositSourcesBody,
} from "./lib/ingestParse";
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

http.route({
  path: "/ingest/deposit-cursors",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const raw = url.searchParams.get("addresses") ?? "";
    const addresses = raw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const cursors = await ctx.runQuery(internal.deposits.getCursors, {
      addresses,
    });
    return Response.json({ cursors });
  }),
});

http.route({
  path: "/ingest/deposit-cursors",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json();
    const parsed = parseIngestCursorsBody(body);
    if (!parsed) {
      return new Response("Invalid body", { status: 400 });
    }

    await ctx.runMutation(internal.deposits.setCursors, {
      cursors: parsed.cursors,
    });
    return new Response(null, { status: 200 });
  }),
});

http.route({
  path: "/ingest/deposits",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json();
    const parsed = parseIngestDepositsBody(body);
    if (!parsed) {
      return new Response("Invalid body", { status: 400 });
    }

    const result = await ctx.runMutation(internal.deposits.upsertBatch, {
      deposits: parsed.deposits,
      cursors: parsed.cursors,
    });
    return Response.json(result);
  }),
});

http.route({
  path: "/ingest/deposits-self-sourced",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const url = new URL(request.url);
    const raw = url.searchParams.get("addresses") ?? "";
    const addresses = raw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const deposits = await ctx.runQuery(internal.deposits.listSelfSourced, {
      addresses,
    });
    return Response.json({ deposits });
  }),
});

http.route({
  path: "/ingest/deposit-sources",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!verifyIngestSecret(request)) {
      return unauthorizedResponse();
    }

    const body: unknown = await request.json();
    const parsed = parseIngestDepositSourcesBody(body);
    if (!parsed) {
      return new Response("Invalid body", { status: 400 });
    }

    const result = await ctx.runMutation(internal.deposits.patchSourceBatch, {
      updates: parsed.updates,
    });
    return Response.json(result);
  }),
});

export default http;
