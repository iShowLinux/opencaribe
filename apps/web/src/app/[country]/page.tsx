import { getLocale } from 'next-intl/server';
import { CATEGORIES, COUNTRIES, toCountryCode, type Locale } from '@opencaribe/configuration';
import { notFound } from 'next/navigation';
import { Container, SectionTitle } from '@opencaribe/ui';
import { LinkButton } from '@/components/LinkButton';
import { CategoryCard } from '@/components/CategoryCard';
import { ListingCard } from '@/components/ListingCard';
import { getAllListings } from '@/lib/listings-store';
import { getT } from '@/lib/t';

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: rawCode } = await params;
  const code = toCountryCode(rawCode);
  if (!code) notFound();
  const country = COUNTRIES[code];
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const all = await getAllListings();
  const listings = all.filter((listing) => listing.countryCode === code && listing.status === 'active').slice(0, 6);

  return (
    <>
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-navy-900/30">
        <Container className="py-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">{code}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-navy-900 dark:text-navy-50">
            {t('country.welcome')} {country.displayName}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">{t('country.subtitle', { country: country.displayName })}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href={`/${code.toLowerCase()}/post`}>{t('home.heroSecondary')}</LinkButton>
            <LinkButton href={`/${code.toLowerCase()}/search`} variant="secondary">{t('country.viewAll')}</LinkButton>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div><dt className="font-semibold text-navy-900 dark:text-navy-50">{t('search.currency')}</dt><dd>{country.supportedCurrencies.join(' / ')}</dd></div>
            <div><dt className="font-semibold text-navy-900 dark:text-navy-50">{t('common.language')}</dt><dd>{country.supportedLanguages.join(' / ')}</dd></div>
            <div><dt className="font-semibold text-navy-900 dark:text-navy-50">{t('listing.location')}</dt><dd>{country.timeZone}</dd></div>
          </dl>
        </Container>
      </section>

      <Container className="py-12">
        <SectionTitle>{t('home.categoriesTitle')}</SectionTitle>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} countryCode={code} locale={locale} />
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        <SectionTitle>{t('country.recent')}</SectionTitle>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} locale={locale} />)}
        </div>
      </Container>
    </>
  );
}
