/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as lib_address from "../lib/address.js";
import type * as lib_hyperliquid from "../lib/hyperliquid.js";
import type * as lib_hyperliquidTypes from "../lib/hyperliquidTypes.js";
import type * as lib_ingestAuth from "../lib/ingestAuth.js";
import type * as wallets from "../wallets.js";
import type * as watches from "../watches.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/address": typeof lib_address;
  "lib/hyperliquid": typeof lib_hyperliquid;
  "lib/hyperliquidTypes": typeof lib_hyperliquidTypes;
  "lib/ingestAuth": typeof lib_ingestAuth;
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
