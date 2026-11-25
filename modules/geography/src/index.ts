import {
  COUNTRIES,
  COUNTRY_CODES,
  getCountry,
  type CityConfig,
  type CountryCode,
  type Locale,
  type RegionConfig,
} from '@opencaribe/configuration';

export interface LocationHit {
  id: string;
  kind: 'country' | 'region' | 'city';
  countryCode: CountryCode;
  regionId?: string;
  label: string;
}

function localizedName(names: Record<Locale, string>, locale: Locale): string {
  return names[locale] ?? names.en;
}

export function listCountries() {
  return COUNTRY_CODES.map((code) => COUNTRIES[code]);
}

export function countryConfig(code: string) {
  return getCountry(code);
}

export function listRegions(code: CountryCode): RegionConfig[] {
  return COUNTRIES[code].regions;
}

export function listCities(code: CountryCode, regionId?: string): Array<CityConfig & { regionId: string }> {
  return COUNTRIES[code].regions
    .filter((region) => !regionId || region.id === regionId)
    .flatMap((region) => region.cities.map((city) => ({ ...city, regionId: region.id })));
}

export function findLocationLabel(id: string, locale: Locale): string | undefined {
  for (const code of COUNTRY_CODES) {
    if (code.toLowerCase() === id.toLowerCase()) return COUNTRIES[code].displayName;
    for (const region of COUNTRIES[code].regions) {
      if (region.id === id) return localizedName(region.names, locale);
      for (const city of region.cities) {
        if (city.id === id) return localizedName(city.names, locale);
      }
    }
  }
  return undefined;
}

export function searchLocations(query: string, locale: Locale, limit = 20): LocationHit[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  const hits: LocationHit[] = [];

  for (const code of COUNTRY_CODES) {
    const country = COUNTRIES[code];
    const countryLabel = country.displayName.toLocaleLowerCase();
    if (countryLabel.includes(needle)) {
      hits.push({ id: code, kind: 'country', countryCode: code, label: country.displayName });
    }
    for (const region of country.regions) {
      const regionLabel = localizedName(region.names, locale);
      if (regionLabel.toLocaleLowerCase().includes(needle)) {
        hits.push({ id: region.id, kind: 'region', countryCode: code, label: regionLabel });
      }
      for (const city of region.cities) {
        const cityLabel = localizedName(city.names, locale);
        if (cityLabel.toLocaleLowerCase().includes(needle)) {
          hits.push({
            id: city.id,
            kind: 'city',
            countryCode: code,
            regionId: region.id,
            label: cityLabel,
          });
        }
      }
    }
  }
  return hits.slice(0, limit);
}

export interface GeographySeed {
  regions: Array<{ id: string; countryCode: string; names: Record<Locale, string> }>;
  cities: Array<{
    id: string;
    countryCode: string;
    regionId: string;
    names: Record<Locale, string>;
    approxLatitude: number | null;
    approxLongitude: number | null;
  }>;
}

/** Deterministic seed rows derived from the single source of truth in configuration. */
export function buildGeographySeed(): GeographySeed {
  const seed: GeographySeed = { regions: [], cities: [] };
  for (const code of COUNTRY_CODES) {
    for (const region of COUNTRIES[code].regions) {
      seed.regions.push({ id: region.id, countryCode: code, names: region.names });
      for (const city of region.cities) {
        seed.cities.push({
          id: city.id,
          countryCode: code,
          regionId: region.id,
          names: city.names,
          approxLatitude: city.approxLatitude ?? null,
          approxLongitude: city.approxLongitude ?? null,
        });
      }
    }
  }
  return seed;
}
