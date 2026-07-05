import type { FunctionReturnType } from "convex/server";

import type { api } from "@/convex/_generated/api";

export type WalletSnapshot = FunctionReturnType<typeof api.wallets.getSnapshot>;
export type LiveWalletSnapshot = NonNullable<
  FunctionReturnType<typeof api.wallets.getLiveSnapshot>
>;
