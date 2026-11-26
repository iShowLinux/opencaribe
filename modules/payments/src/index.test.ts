import { describe, expect, it } from 'vitest';
import { formatMinorUnits, isExpectedNetwork, parseCoinString, shortAddress } from './index';

describe('coin parsing', () => {
  it('parses an ugnot balance from Adena', () => {
    const parsed = parseCoinString('3618115104ugnot');
    expect(parsed).toEqual({ amountMinor: 3618115104n, denom: 'ugnot' });
  });

  it('rejects malformed coin strings', () => {
    expect(parseCoinString('')).toBeNull();
    expect(parseCoinString('ugnot')).toBeNull();
    expect(parseCoinString('12.5ugnot')).toBeNull();
    expect(parseCoinString('-100ugnot')).toBeNull();
  });

  it('formats six-decimal assets without losing precision', () => {
    expect(formatMinorUnits(3618115104n, 6, 'GNOT')).toBe('3618.115104 GNOT');
    expect(formatMinorUnits(1n, 6, 'GNOT')).toBe('0.000001 GNOT');
    expect(formatMinorUnits(123456n, 2, 'TTD')).toBe('1234.56 TTD');
  });

  it('compares networks case-insensitively', () => {
    expect(isExpectedNetwork('onyx-1', 'onyx-1')).toBe(true);
    expect(isExpectedNetwork('Onyx-1', 'onyx-1')).toBe(true);
    expect(isExpectedNetwork('gnoland-1', 'onyx-1')).toBe(false);
  });

  it('abbreviates long addresses only', () => {
    expect(shortAddress('g1fnakf9vrd6uqn8qdmp88yam4p0ngy572answ9f')).toBe('g1fnak…answ9f');
    expect(shortAddress('g1abc')).toBe('g1abc');
  });
});
