const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function isValidAddress(address: string): boolean {
  return ADDRESS_RE.test(address);
}

export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length < 10) return address;
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}
