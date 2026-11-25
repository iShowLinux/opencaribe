import Link from 'next/link';
import { formatMoney, type Locale } from '@opencaribe/configuration';
import { findLocationLabel } from '@opencaribe/geography';
import { getCategoryBySlug } from '@opencaribe/configuration';
import { Badge, Card } from '@opencaribe/ui';
import { getT } from '@/lib/t';
import type { PublicListing } from '@/lib/types';

export async function ListingCard({
  listing,
  locale,
  compact = false,
}: {
  listing: PublicListing;
  locale: Locale;
  compact?: boolean;
}) {
  const t = await getT();
  const category = getCategoryBySlug(listing.categoryId);
  const location = findLocationLabel(listing.cityId, locale) ?? findLocationLabel(listing.regionId, locale) ?? '';

  const price =
    listing.priceType === 'free'
      ? t('listing.free')
      : listing.priceType === 'contact'
        ? t('listing.contactForPrice')
        : formatMoney(listing.amountMinor, listing.currency, locale);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/${listing.countryCode.toLowerCase()}/l/${listing.id}`} className="block">
        <div className={`grid place-items-center bg-gradient-to-br from-navy-800 to-teal-800 text-white ${compact ? 'h-28' : 'h-40'}`}>
          <span aria-hidden="true" className="text-4xl">{category?.icon ?? '📦'}</span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-semibold text-navy-900 dark:text-navy-50">{listing.title}</h3>
            {listing.negotiable && <Badge tone="teal">{t('listing.negotiable')}</Badge>}
          </div>
          <p className="mt-2 text-lg font-bold text-teal-800 dark:text-teal-300">{price}</p>
          {!compact && <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{listing.description}</p>}
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {location} · {new Intl.DateTimeFormat(locale === 'es' ? 'es-VE' : 'en-TT', { dateStyle: 'medium' }).format(listing.createdAt)}
          </p>
        </div>
      </Link>
    </Card>
  );
}
