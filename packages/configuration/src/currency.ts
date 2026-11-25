import type { CurrencyCode, CurrencyDefinition, Locale } from './types';

/**
 * All amounts are stored as integer minor units (e.g. cents). Parsing and
 * formatting never use floating-point arithmetic on the monetary value.
 */
export type MinorUnits = number;

export const CURRENCIES: Record<CurrencyCode, CurrencyDefinition> = {
  TTD: {
    code: 'TTD',
    digits: 2,
    symbol: 'TT$',
    name: { en: 'Trinidad and Tobago Dollar', es: 'Dólar de Trinidad y Tobago' },
  },
  USD: {
    code: 'USD',
    digits: 2,
    symbol: '$',
    name: { en: 'United States Dollar', es: 'Dólar estadounidense' },
  },
  VES: {
    code: 'VES',
    digits: 2,
    symbol: 'Bs.S',
    name: { en: 'Venezuelan Bolívar (Sovereign)', es: 'Bolívar soberano (VES)' },
    note: 'VES is the redenominated bolivar introduced in 2021. Historical VED amounts must not be reinterpreted as VES.',
  },
  VED: {
    code: 'VED',
    digits: 2,
    symbol: 'Bs.D',
    name: { en: 'Venezuelan Bolívar (Digital)', es: 'Bolívar digital (VED)' },
    note: 'VED was introduced in 2020 and preceded VES. Stored explicitly for historical records; no implicit conversion is performed.',
  },
};

export function getCurrency(code: CurrencyCode): CurrencyDefinition {
  return CURRENCIES[code];
}

/**
 * Parse a human-entered decimal string into integer minor units using string
 * arithmetic. Throws on malformed input rather than silently rounding.
 */
export function parseMoneyToMinor(input: string, currency: CurrencyCode): MinorUnits {
  const digits = CURRENCIES[currency].digits;
  const trimmed = input.trim();
  const match = /^(\d+)(?:[.,](\d+))?$/.exec(trimmed);
  if (!match) throw new Error(`Invalid monetary amount: ${input}`);
  const whole = match[1] ?? '0';
  const fraction = (match[2] ?? '').padEnd(digits, '0').slice(0, digits);
  if ((match[2] ?? '').length > digits) throw new Error(`Too many decimal places: ${input}`);
  const minor = Number(whole) * 10 ** digits + Number(fraction || '0');
  if (!Number.isSafeInteger(minor)) throw new Error(`Monetary amount out of range: ${input}`);
  return minor;
}

/** Format integer minor units for display in the requested locale. */
export function formatMoney(minor: MinorUnits, currency: CurrencyCode, locale: Locale): string {
  const digits = CURRENCIES[currency].digits;
  const major = minor / 10 ** digits;
  return new Intl.NumberFormat(locale === 'es' ? 'es-VE' : 'en-TT', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(major);
}

/** UI helper: render a plain decimal string from minor units, no locale grouping. */
export function moneyToDecimalString(minor: MinorUnits, currency: CurrencyCode): string {
  const digits = CURRENCIES[currency].digits;
  const sign = minor < 0 ? '-' : '';
  const abs = Math.abs(minor);
  const whole = Math.floor(abs / 10 ** digits).toString();
  const fraction = digits > 0 ? (abs % 10 ** digits).toString().padStart(digits, '0') : '';
  return fraction ? `${sign}${whole}.${fraction}` : `${sign}${whole}`;
}
