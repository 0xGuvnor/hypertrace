const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function isValidAddress(address: string): boolean {
  return ADDRESS_RE.test(address);
}

export function normalizeAddress(address: string): string {
  return address.toLowerCase();
}
