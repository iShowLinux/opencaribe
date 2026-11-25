import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { CATEGORIES, getCategoryBySlug, toCountryCode, type Locale } from '@opencaribe/configuration';
import { notFound } from 'next/navigation';
import { Badge, Container, SectionTitle } from '@opencaribe/ui';
import { ListingCard } from '@/components/ListingCard';
import { getAllListings } from '@/lib/listings-store';
import { getT } from '@/lib/t';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ country: string; category: string }>;
}) {
  const { country: rawCode, category: slug } = await params;
  const code = toCountryCode(rawCode);
  if (!code) notFound();
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const all = await getAllListings();
  const listings = all.filter((listing) => listing.countryCode === code && listing.categoryId === category.id);

  return (
    <Container className="py-10">
      <Link href={`/${code.toLowerCase()}`} className="text-sm text-teal-700 hover:underline dark:text-teal-300">← {COUNTRY_NAME[code]}</Link>
      <div className="mt-4 flex items-center gap-4">
        <span aria-hidden="true" className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{category.names[locale]}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{category.description[locale]}</p>
        </div>
        {category.moderationRequired && <Badge tone="warning">Moderated category</Badge>}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {category.subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/${code.toLowerCase()}/search?category=${category.id}`}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:text-slate-200"
          >
            {subcategory.names[locale]}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <SectionTitle>{listings.length} {t('search.results')}</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} locale={locale} compact />)}
        </div>
        {listings.length === 0 && <p className="mt-6 text-slate-600 dark:text-slate-400">{t('search.noResults')}</p>}
      </div>

      <p className="mt-8 text-xs text-slate-500">Available categories: {CATEGORIES.length}</p>
    </Container>
  );
}

const COUNTRY_NAME: Record<string, string> = { TT: 'Trinidad and Tobago', VE: 'Venezuela' };
