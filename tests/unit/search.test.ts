import { describe, expect, it } from 'vitest';
import { applySearchFilters, type SearchableListing } from '@opencaribe/search';

const listing = (overrides: Partial<SearchableListing> = {}): SearchableListing => ({
  id: 'x',
  countryCode: 'TT',
  regionId: 'tt-port-of-spain',
  cityId: 'tt-pos-city',
  categoryId: 'electronics',
  title: 'Blue bicycle',
  description: 'A bicycle in good condition',
  amountMinor: 10000,
  currency: 'TTD',
  condition: 'good',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  status: 'active',
  ...overrides,
});

describe('search', () => {
  it('hides non-active listings', () => {
    const result = applySearchFilters([listing(), listing({ id: 'draft', status: 'draft' })]);
    expect(result.total).toBe(1);
  });

  it('applies country, category, price and keyword filters', () => {
    const items = [
      listing(),
      listing({ id: 've', countryCode: 'VE', currency: 'VES' }),
      listing({ id: 'expensive', amountMinor: 500000 }),
      listing({ id: 'other', title: 'Red car' }),
    ];
    expect(applySearchFilters(items, { country: 'VE' }).items.map((i) => i.id)).toEqual(['ve']);
    expect(applySearchFilters(items, { category: 'electronics' }).total).toBe(4);
    expect(applySearchFilters(items, { minPrice: '200.00' }).items.map((i) => i.id)).toEqual(['expensive']);
    expect(applySearchFilters(items, { q: 'bicycle' }).total).toBe(4);
  });

  it('never compares prices across currencies', () => {
    const items = [
      listing({ id: 'ttd-1', currency: 'TTD', amountMinor: 500 }),
      listing({ id: 'usd-1', currency: 'USD', amountMinor: 100 }),
      listing({ id: 'ttd-2', currency: 'TTD', amountMinor: 100 }),
    ];
    const result = applySearchFilters(items, { sort: 'price_asc' });
    expect(result.items.map((i) => i.id)).toEqual(['ttd-2', 'ttd-1', 'usd-1']);
    expect(result.currencies).toEqual(['TTD', 'USD']);
  });

  it('bounds pagination', () => {
    const items = Array.from({ length: 60 }, (_, index) => listing({ id: `item-${index}` }));
    const result = applySearchFilters(items, { page: 99 }, 10);
    expect(result.pageCount).toBe(6);
    expect(result.page).toBe(6);
    expect(result.items).toHaveLength(10);
  });
});
