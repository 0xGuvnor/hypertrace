/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as clusters from "../clusters.js";
import type * as crons from "../crons.js";
import type * as deposits from "../deposits.js";
import type * as http from "../http.js";
import type * as leaderboard from "../leaderboard.js";
import type * as lib_address from "../lib/address.js";
import type * as lib_clusterTypes from "../lib/clusterTypes.js";
import type * as lib_depositClustering from "../lib/depositClustering.js";
import type * as lib_depositTypes from "../lib/depositTypes.js";
import type * as lib_hyperliquid from "../lib/hyperliquid.js";
import type * as lib_hyperliquidTypes from "../lib/hyperliquidTypes.js";
import type * as lib_ingestAuth from "../lib/ingestAuth.js";
import type * as lib_ingestParse from "../lib/ingestParse.js";
import type * as lib_leaderboardParse from "../lib/leaderboardParse.js";
import type * as lib_leaderboardTypes from "../lib/leaderboardTypes.js";
import type * as lib_snapshotEqual from "../lib/snapshotEqual.js";
import type * as lib_spotAccountValue from "../lib/spotAccountValue.js";
import type * as wallets from "../wallets.js";
import type * as watches from "../watches.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  clusters: typeof clusters;
  crons: typeof crons;
  deposits: typeof deposits;
  http: typeof http;
  leaderboard: typeof leaderboard;
  "lib/address": typeof lib_address;
  "lib/clusterTypes": typeof lib_clusterTypes;
  "lib/depositClustering": typeof lib_depositClustering;
  "lib/depositTypes": typeof lib_depositTypes;
  "lib/hyperliquid": typeof lib_hyperliquid;
  "lib/hyperliquidTypes": typeof lib_hyperliquidTypes;
  "lib/ingestAuth": typeof lib_ingestAuth;
  "lib/ingestParse": typeof lib_ingestParse;
  "lib/leaderboardParse": typeof lib_leaderboardParse;
  "lib/leaderboardTypes": typeof lib_leaderboardTypes;
  "lib/snapshotEqual": typeof lib_snapshotEqual;
  "lib/spotAccountValue": typeof lib_spotAccountValue;
  wallets: typeof wallets;
  watches: typeof watches;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
