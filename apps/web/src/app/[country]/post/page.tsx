import { getLocale } from 'next-intl/server';
import { CATEGORIES, COUNTRIES, toCountryCode, type Locale } from '@opencaribe/configuration';
import { listRegions } from '@opencaribe/geography';
import { notFound } from 'next/navigation';
import { Container } from '@opencaribe/ui';
import { PostListingWizard } from '@/components/PostListingWizard';
import { getT } from '@/lib/t';

export default async function PostPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: rawCode } = await params;
  const code = toCountryCode(rawCode);
  if (!code) notFound();
  const country = COUNTRIES[code];
  const locale = (await getLocale()) as Locale;
  const t = await getT();

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{t('post.title')}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t('post.subtitle')}</p>
      <div className="mt-8">
        <PostListingWizard
          countryCode={code}
          locale={locale}
          categories={CATEGORIES.map((category) => ({
            id: category.id,
            slug: category.slug,
            names: category.names,
            subcategories: category.subcategories.map((subcategory) => ({
              id: subcategory.id,
              slug: subcategory.slug,
              names: subcategory.names,
            })),
          }))}
          regions={listRegions(code).map((region) => ({ id: region.id, names: region.names }))}
          currencies={country.supportedCurrencies}
        />
      </div>
    </Container>
  );
}
