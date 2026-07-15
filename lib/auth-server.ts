import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/** Prefer explicit site URL; otherwise derive from `.convex.cloud` → `.convex.site`. */
const convexSiteUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
  (convexUrl.includes(".convex.cloud")
    ? convexUrl.replace(".convex.cloud", ".convex.site")
    : convexUrl);

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl,
  convexSiteUrl,
});
