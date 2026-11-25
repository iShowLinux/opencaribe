import { describe, expect, it } from 'vitest';
import { isValidLocale, loadMessages, translate } from '@opencaribe/localization';

function flatten(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return [prefix];
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key));
  }
  return [];
}

describe('localization', () => {
  it('keeps English and Spanish message keys in sync', () => {
    const en = flatten(loadMessages('en')).sort();
    const es = flatten(loadMessages('es')).sort();
    expect(en).toEqual(es);
    expect(en.length).toBeGreaterThan(60);
  });

  it('interpolates parameters', () => {
    expect(translate('en', 'country.subtitle', { country: 'Venezuela' })).toContain('Venezuela');
    expect(translate('es', 'country.subtitle', { country: 'Venezuela' })).toContain('Venezuela');
  });

  it('returns the key for missing messages and validates locales', () => {
    expect(translate('en', 'missing.key')).toBe('missing.key');
    expect(isValidLocale('es')).toBe(true);
    expect(isValidLocale('fr')).toBe(false);
  });
});
