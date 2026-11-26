/**
 * Pure helpers for crypto settlement. Amounts are always integer minor units;
 * floating point is never used for money.
 */

export type PaymentStatus =
  | 'created'
  | 'pending'
  | 'paid'
  | 'released'
  | 'refunded'
  | 'disputed'
  | 'cancelled';

export interface ParsedCoinAmount {
  amountMinor: bigint;
  denom: string;
}

/**
 * Parse the `coins` field returned by Adena, for example
 * "3618115104ugnot" -> { amountMinor: 3618115104n, denom: "ugnot" }.
 * Returns null rather than guessing when the shape is unexpected.
 */
export function parseCoinString(value: string): ParsedCoinAmount | null {
  const match = /^(\d+)([A-Za-z][A-Za-z0-9/_.:-]*)$/.exec(value.trim());
  if (!match) return null;
  try {
    return { amountMinor: BigInt(match[1] ?? '0'), denom: match[2] ?? '' };
  } catch {
    return null;
  }
}

/** Format integer minor units for display, e.g. 3618115104n, 6 -> "3618.115104 GNOT". */
export function formatMinorUnits(amountMinor: bigint, decimals: number, symbol: string): string {
  const negative = amountMinor < 0n;
  const absolute = negative ? -amountMinor : amountMinor;
  const scale = 10n ** BigInt(decimals);
  const whole = (absolute / scale).toString();
  const fraction = decimals > 0 ? (absolute % scale).toString().padStart(decimals, '0') : '';
  const sign = negative ? '-' : '';
  return `${sign}${whole}${fraction ? `.${fraction}` : ''} ${symbol}`;
}

export function isExpectedNetwork(actual: string, expected: string): boolean {
  return actual.trim().toLowerCase() === expected.trim().toLowerCase();
}

export function shortAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
