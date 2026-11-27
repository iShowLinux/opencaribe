import Link from 'next/link';
import { Container, SectionTitle } from '@opencaribe/ui';
import { ListingCard } from '@/components/ListingCard';
import { listListingsByStatus } from '@/lib/listings-store';
import { COUNTRIES, toCountryCode, type Locale } from '@opencaribe/configuration';
import { getLocale } from 'next-intl/server';
import { getT } from '@/lib/t';

function buildHref(q: string, country: string): string {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (country !== 'all') params.set('country', country);
  const qs = params.toString();
  return qs ? `/browse?${qs}` : '/browse';
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string }>;
}) {
  const { q = '', country = 'all' } = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const active = await listListingsByStatus('active');
  const needle = q.trim().toLowerCase();
  const listings = active.filter((listing) => {
    if (country !== 'all' && listing.countryCode.toLowerCase() !== country) return false;
    if (!needle) return true;
    return listing.title.toLowerCase().includes(needle) || listing.description.toLowerCase().includes(needle);
  });

  return (
    <Container className="py-12">
      <SectionTitle>{t('nav.browse')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('browse.subtitle')}</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link href={buildHref(q, 'all')} className={`rounded-full px-3 py-1 text-sm font-medium ${country === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
          {t('browse.allCountries')}
        </Link>
        {Object.keys(COUNTRIES).map((code) => (
          <Link key={code} href={buildHref(q, code.toLowerCase())} className={`rounded-full px-3 py-1 text-sm font-medium ${country === code.toLowerCase() ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
            {COUNTRIES[toCountryCode(code) ?? 'TT'].displayName}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">{t('browse.resultsCount', { count: listings.length })}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => <ListingCard key={listing.id} listing={listing} locale={locale} />)}
      </div>
      {listings.length === 0 && <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">{t('browse.empty')}</p>}
    </Container>
  );
}
