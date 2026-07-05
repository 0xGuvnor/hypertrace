import { v } from "convex/values";
import { action } from "./_generated/server";
import { isValidAddress, normalizeAddress } from "./lib/address";
import { fetchWalletSnapshot } from "./lib/hyperliquid";
import { walletSnapshotValidator } from "./lib/hyperliquidTypes";

export const getSnapshot = action({
  args: { address: v.string() },
  returns: walletSnapshotValidator,
  handler: async (_ctx, args) => {
    const trimmed = args.address.trim();
    if (!isValidAddress(trimmed)) {
      throw new Error("Invalid wallet address");
    }

    return await fetchWalletSnapshot(normalizeAddress(trimmed));
  },
});
