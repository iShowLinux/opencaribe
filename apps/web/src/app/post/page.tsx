import Link from 'next/link';
import { Container, SectionTitle, Card } from '@opencaribe/ui';
import { COUNTRIES, toCountryCode, type Locale } from '@opencaribe/configuration';
import { getLocale } from 'next-intl/server';
import { getT } from '@/lib/t';

export default async function PostChooserPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getT();
  void locale;
  return (
    <Container className="max-w-2xl py-16">
      <SectionTitle>{t('post.chooseCountry')}</SectionTitle>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{t('post.chooseCountryHint')}</p>
      <div className="mt-8 grid gap-4">
        {Object.keys(COUNTRIES).map((code) => {
          const c = COUNTRIES[toCountryCode(code) ?? 'TT'];
          return (
            <Link key={code} href={`/${c.code.toLowerCase()}/post`}>
              <Card className="flex items-center justify-between p-6 transition-colors hover:border-teal-500">
                <div>
                  <p className="font-semibold text-navy-900 dark:text-navy-50">{c.displayName}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('post.chooseCountryBody', { country: c.displayName })}</p>
                </div>
                <span className="text-teal-700 dark:text-teal-300">→</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
