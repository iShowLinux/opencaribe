import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { CATEGORIES, COUNTRIES, COUNTRY_CODES, type Locale } from '@opencaribe/configuration';
import { Button, Card, Container, SectionTitle } from '@opencaribe/ui';
import { getT } from '@/lib/t';

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getT();

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-br from-navy-900 via-navy-800 to-teal-800 text-white dark:border-slate-800">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              {t('app.tagline')}
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200">{t('home.heroSubtitle')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tt/search"><Button size="lg" className="bg-coral-500 hover:bg-coral-600">{t('home.heroCta')}</Button></Link>
              <Link href="/tt/post"><Button size="lg" variant="secondary" className="border-white/40 bg-white/10 text-white hover:bg-white/20">{t('home.heroSecondary')}</Button></Link>
            </div>
          </div>
          <div className="hidden items-center justify-center lg:flex" aria-hidden="true">
            <div className="grid grid-cols-3 gap-3 text-5xl opacity-90">
              <span>🏠</span><span>🚗</span><span>💻</span><span>🛋️</span><span>👕</span><span>📦</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionTitle>{t('home.countriesTitle')}</SectionTitle>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('home.countriesSubtitle')}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {COUNTRY_CODES.map((code) => {
            const country = COUNTRIES[code];
            return (
              <Link key={code} href={`/${code.toLowerCase()}`}>
                <Card className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:border-teal-500">
                  <div>
                    <p className="text-xl font-bold text-navy-900 dark:text-navy-50">{country.displayName}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {country.defaultLocale === 'es' ? 'Español' : 'English'} · {country.supportedCurrencies.join(' / ')} · {country.telephonePrefix}
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-3xl">{code === 'TT' ? '🌴' : '🌊'}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>

      <Container className="pb-14">
        <SectionTitle>{t('home.categoriesTitle')}</SectionTitle>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.slice(0, 15).map((category) => (
            <Link key={category.id} href={`/tt/c/${category.slug}`}>
              <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:border-teal-500">
                <span aria-hidden="true" className="text-2xl">{category.icon}</span>
                <span className="text-sm font-semibold text-navy-900 dark:text-navy-50">{category.names[locale]}</span>
              </Card>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        <SectionTitle>{t('home.trustTitle')}</SectionTitle>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ['🔒', t('home.trustPrivacy')],
            ['📱', t('home.trustFree')],
            ['🌐', t('home.trustOpen')],
          ].map(([icon, text]) => (
            <Card key={text} className="p-6">
              <span aria-hidden="true" className="text-3xl">{icon}</span>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
