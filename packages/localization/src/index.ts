import type { Locale } from '@opencaribe/configuration';
import en from '../messages/en.json';
import es from '../messages/es.json';

export const MESSAGES = { en, es } as const;

export function loadMessages(locale: Locale) {
  return MESSAGES[locale];
}

export function isValidLocale(value: string): value is Locale {
  return value === 'en' || value === 'es';
}

/** Lightweight key lookup with {param} interpolation, usable in server and client code. */
export function translate(
  locale: Locale,
  key: string,
  params: Record<string, string | number> = {},
): string {
  let node: unknown = MESSAGES[locale];
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null || !(part in node)) return key;
    node = (node as Record<string, unknown>)[part];
  }
  if (typeof node !== 'string') return key;
  return node.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}
