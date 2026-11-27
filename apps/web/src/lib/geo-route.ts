import { COUNTRIES, toCountryCode } from '@opencaribe/configuration';

export interface Coords {
  lat: number;
  lon: number;
}

/** Resolves the approximate coordinates of a listing city (or region fallback). */
export function cityCoords(countryCode: string, regionId?: string, cityId?: string): Coords | undefined {
  const code = toCountryCode(countryCode);
  if (!code) return undefined;
  const regions = COUNTRIES[code].regions;
  const wantedRegion = regionId ? regions.find((region) => region.id === regionId) : undefined;

  const pool = wantedRegion ? [wantedRegion] : regions;
  for (const region of pool) {
    const city = cityId ? region.cities.find((entry) => entry.id === cityId) : region.cities[0];
    if (city?.approxLatitude != null && city.approxLongitude != null) {
      return { lat: city.approxLatitude, lon: city.approxLongitude };
    }
  }
  // Fall back to any city in the country.
  for (const region of regions) {
    const city = region.cities[0];
    if (city?.approxLatitude != null && city.approxLongitude != null) {
      return { lat: city.approxLatitude, lon: city.approxLongitude };
    }
  }
  return undefined;
}

export interface RouteSummary {
  distanceKm: number;
  durationMin: number;
}

/** Driving route via the public OSRM demo server; null when it cannot answer. */
export async function drivingRoute(from: Coords, to: Coords): Promise<RouteSummary | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=false`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000), cache: 'no-store' });
    if (!response.ok) return null;
    const payload = (await response.json()) as { routes?: Array<{ distance?: number; duration?: number }> };
    const route = payload.routes?.[0];
    if (!route?.distance || !route.duration) return null;
    return { distanceKm: Math.round(route.distance / 100) / 10, durationMin: Math.round(route.duration / 60) };
  } catch {
    return null;
  }
}

/** OpenStreetMap embed centred on the destination marker. */
export function osmEmbedUrl(coords: Coords): string {
  const d = 0.04;
  const bbox = `${coords.lon - d},${coords.lat - d},${coords.lon + d},${coords.lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`;
}

/** Google Maps directions link (no API key required). */
export function mapsDirectionsUrl(from: Coords | undefined, to: Coords): string {
  const params = new URLSearchParams({ api: '1', destination: `${to.lat},${to.lon}`, travelmode: 'driving' });
  if (from) params.set('origin', `${from.lat},${from.lon}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
