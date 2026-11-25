import { describe, expect, it } from 'vitest';
import { buildGeographySeed, findLocationLabel, searchLocations } from '@opencaribe/geography';

describe('geography', () => {
  it('builds deterministic seed data with unique ids', () => {
    const seed = buildGeographySeed();
    const regionIds = seed.regions.map((region) => region.id);
    const cityIds = seed.cities.map((city) => city.id);
    expect(new Set(regionIds).size).toBe(regionIds.length);
    expect(new Set(cityIds).size).toBe(cityIds.length);
    expect(seed.regions.length).toBeGreaterThan(10);
    expect(seed.cities.length).toBeGreaterThan(15);
  });

  it('resolves localized labels in both languages', () => {
    expect(findLocationLabel('tt-port-of-spain', 'en')).toBe('Port of Spain');
    expect(findLocationLabel('ve-capital', 'es')).toBe('Distrito Capital');
    expect(findLocationLabel('unknown', 'en')).toBeUndefined();
  });

  it('searches locations without exposing exact addresses', () => {
    const hits = searchLocations('Caracas', 'en');
    expect(hits.some((hit) => hit.id === 've-caracas' && hit.kind === 'city')).toBe(true);
    expect(hits[0]).not.toHaveProperty('address');
  });
});
