import { headers } from 'next/headers';
import { cityCoords, drivingRoute, mapsDirectionsUrl, osmEmbedUrl, type Coords } from '@/lib/geo-route';
import { getT } from '@/lib/t';

interface Props {
  countryCode: string;
  regionId?: string;
  cityId?: string;
  label: string;
}

/**
 * Listing location: map marker plus a driving route from the visitor's
 * approximate (IP-based) position when Vercel exposes geolocation headers.
 */
export async function ItemMap({ countryCode, regionId, cityId, label }: Props) {
  const t = await getT();
  const coords = cityCoords(countryCode, regionId, cityId);
  if (!coords) return null;

  let origin: Coords | undefined;
  try {
    const store = await headers();
    const lat = Number.parseFloat(store.get('x-vercel-ip-latitude') ?? '');
    const lon = Number.parseFloat(store.get('x-vercel-ip-longitude') ?? '');
    if (Number.isFinite(lat) && Number.isFinite(lon)) origin = { lat, lon };
  } catch {
    /* headers unavailable outside a request context */
  }

  const route = origin ? await drivingRoute(origin, coords) : null;

  return (
    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
      <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t('listing.map')}</p>
      <div className="mt-2 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <iframe title={t('listing.map')} src={osmEmbedUrl(coords)} className="h-56 w-full" loading="lazy" />
      </div>
      {route ? (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {t('listing.routeFromYou', { distance: route.distanceKm.toFixed(1), minutes: route.durationMin })}
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t('listing.mapNote')}</p>
      )}
      <a
        href={mapsDirectionsUrl(origin, coords)}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs font-medium text-teal-700 hover:underline dark:text-teal-300"
      >
        {t('listing.directions')} ↗
      </a>
      {label && <p className="sr-only">{label}</p>}
    </div>
  );
}
