import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  COUNTRIES,
  COUNTRY_CODES,
  formatMoney,
  getCurrency,
  isCategoryEnabled,
  moneyToDecimalString,
  parseMoneyToMinor,
} from '@opencaribe/configuration';

describe('country configuration', () => {
  it('defines both launch markets with the required values', () => {
    expect(COUNTRY_CODES).toEqual(['TT', 'VE']);
    expect(COUNTRIES.TT.defaultCurrency).toBe('TTD');
    expect(COUNTRIES.TT.telephonePrefix).toBe('+1-868');
    expect(COUNTRIES.TT.timeZone).toBe('America/Port_of_Spain');
    expect(COUNTRIES.VE.defaultCurrency).toBe('VES');
    expect(COUNTRIES.VE.telephonePrefix).toBe('+58');
    expect(COUNTRIES.VE.timeZone).toBe('America/Caracas');
  });

  it('supports both languages in both countries', () => {
    for (const code of COUNTRY_CODES) {
      expect(COUNTRIES[code].supportedLanguages).toEqual(expect.arrayContaining(['en', 'es']));
    }
  });

  it('has 31 enabled, translatable categories', () => {
    expect(CATEGORIES).toHaveLength(31);
    for (const category of CATEGORIES) {
      expect(category.names.en).toBeTruthy();
      expect(category.names.es).toBeTruthy();
      expect(isCategoryEnabled(category, 'TT')).toBe(true);
    }
    const slugs = CATEGORIES.map((category) => category.slug);
    expect(slugs).toContain('pets');
    expect(slugs).toContain('marine-boating');
    expect(slugs).toContain('sustainability');
  });
});

describe('crypto payment configuration', () => {
  it('keeps settlement disabled while wallet connect is live on testnet', () => {
    for (const code of COUNTRY_CODES) {
      const crypto = COUNTRIES[code].cryptoPayments;
      expect(crypto.enabled).toBe(false);
      expect(crypto.comingSoon).toBe(true);
      expect(crypto.wallets).toContain('adena');
      expect(crypto.asset.symbol).toBe('GNOT');
      expect(crypto.asset.denom).toBe('ugnot');
      expect(crypto.asset.decimals).toBe(6);
      expect(crypto.walletConnect.enabled).toBe(true);
      expect(crypto.walletConnect.network).toBe('testnet');
      expect(crypto.walletConnect.chainId).toBeTruthy();
      expect(crypto.walletConnect.rpcUrl).toMatch(/^https:\/\//);
      expect(crypto.note.en).toBeTruthy();
      expect(crypto.note.es).toBeTruthy();
    }
  });
});

describe('money handling', () => {
  it('parses decimal strings into integer minor units without floating point drift', () => {
    expect(parseMoneyToMinor('123.45', 'TTD')).toBe(12345);
    expect(parseMoneyToMinor('0.07', 'USD')).toBe(7);
    expect(parseMoneyToMinor('10', 'VES')).toBe(1000);
    expect(parseMoneyToMinor('1,5', 'VES')).toBe(150);
  });

  it('rejects malformed amounts and excess precision', () => {
    expect(() => parseMoneyToMinor('12.345', 'TTD')).toThrow();
    expect(() => parseMoneyToMinor('-5', 'TTD')).toThrow();
    expect(() => parseMoneyToMinor('abc', 'TTD')).toThrow();
  });

  it('keeps VES and VED as distinct currencies', () => {
    expect(getCurrency('VES').note).toContain('VED');
    expect(getCurrency('VED').note).toContain('VES');
    expect(getCurrency('VES').symbol).not.toBe(getCurrency('VED').symbol);
  });

  it('formats and round-trips minor units', () => {
    expect(moneyToDecimalString(123456, 'TTD')).toBe('1234.56');
    expect(formatMoney(123456, 'TTD', 'en')).toContain('1,234.56');
  });

  it('handles the six-decimal GNOT asset without floating point', () => {
    expect(parseMoneyToMinor('1.5', 'GNOT')).toBe(1_500_000);
    expect(formatMoney(1_500_000, 'GNOT', 'en')).toContain('1.5');
    expect(getCurrency('GNOT').digits).toBe(6);
  });
});
