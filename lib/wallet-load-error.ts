export const WALLET_RATE_LIMIT_MESSAGE =
  "Hyperliquid rate limit reached. Wait a moment and try again.";

export const WALLET_LOAD_DEFAULT_MESSAGE =
  "Something went wrong fetching data from Hyperliquid.";

function isRateLimitMessage(message: string): boolean {
  return (
    message.includes("429") ||
    message.toLowerCase().includes("rate limit")
  );
}

function isProductionSanitizedMessage(message: string): boolean {
  return message.toLowerCase().includes("omitted in production");
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "";
}

export function walletLoadUserMessage(error: unknown): string {
  const message = extractErrorMessage(error);

  if (isRateLimitMessage(message)) {
    return WALLET_RATE_LIMIT_MESSAGE;
  }

  if (isProductionSanitizedMessage(message)) {
    return WALLET_LOAD_DEFAULT_MESSAGE;
  }

  return message || WALLET_LOAD_DEFAULT_MESSAGE;
}
