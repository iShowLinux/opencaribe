import { getLocale } from 'next-intl/server';
import { CATEGORIES, COUNTRIES, toCountryCode, type Locale } from '@opencaribe/configuration';
import { listCities, listRegions } from '@opencaribe/geography';
import { applySearchFilters, type SortOption } from '@opencaribe/search';
import { Container } from '@opencaribe/ui';
import { notFound } from 'next/navigation';
import { ListingCard } from '@/components/ListingCard';
import { SearchForm } from '@/components/SearchForm';
import { getAllListings } from '@/lib/listings-store';
import { getT } from '@/lib/t';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { country: rawCode } = await params;
  const code = toCountryCode(rawCode);
  if (!code) notFound();
  const query = await searchParams;
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const country = COUNTRIES[code];

  const value = (key: string) => {
    const raw = query[key];
    return (Array.isArray(raw) ? raw[0] : raw) ?? '';
  };

  const all = await getAllListings();
  const result = applySearchFilters(all, {
    q: value('q') || undefined,
    country: code,
    region: value('region') || undefined,
    city: value('city') || undefined,
    category: value('category') || undefined,
    currency: value('currency') || undefined,
    minPrice: value('minPrice') || undefined,
    maxPrice: value('maxPrice') || undefined,
    condition: value('condition') || undefined,
    sort: (value('sort') || 'recent') as SortOption,
    page: Number(value('page') || '1'),
  });

  const categoryOptions = CATEGORIES.map((category) => ({
    value: category.id,
    label: category.names[locale],
  }));
  const regionOptions = listRegions(code).map((region) => ({
    value: region.id,
    label: region.names[locale as Locale],
  }));
  const cityOptions = listCities(code).map((city) => ({
    value: city.id,
    label: city.names[locale as Locale],
  }));
  const currencyOptions = country.supportedCurrencies.map((currency) => ({ value: currency, label: currency }));

  const defaults: Record<string, string> = {};
  for (const key of ['q', 'category', 'region', 'city', 'currency', 'minPrice', 'maxPrice', 'sort']) {
    defaults[key] = value(key);
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('search.title')}</h1>
      <div className="mt-6">
        <SearchForm
          action={`/${code.toLowerCase()}/search`}
          categories={categoryOptions}
          regions={regionOptions}
          cities={cityOptions}
          currencies={currencyOptions}
          defaults={defaults}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">{result.total} {t('search.results')}</p>
        <p className="text-xs text-slate-500">{result.currencies.join(' · ')}</p>
      </div>

      {result.items.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {t('search.noResults')}
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {result.items.map((listing) => <ListingCard key={listing.id} listing={listing} locale={locale} compact />)}
          </div>
          {result.pageCount > 1 && (
            <nav className="mt-8 flex justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: result.pageCount }, (_, index) => index + 1).map((page) => (
                <a
                  key={page}
                  href={`/${code.toLowerCase()}/search?page=${page}`}
                  className={`rounded-lg px-3 py-2 text-sm ${page === result.page ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
                >
                  {page}
                </a>
              ))}
            </nav>
          )}
        </>
      )}
    </Container>
  );
}
