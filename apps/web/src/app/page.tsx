import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { CATEGORIES, COUNTRIES, COUNTRY_CODES, type Locale } from '@opencaribe/configuration';
import { Card, Container, SectionTitle } from '@opencaribe/ui';
import { CategoryCard } from '@/components/CategoryCard';
import { LinkButton } from '@/components/LinkButton';
import { heroImage } from '@/lib/images';
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
              <LinkButton href="/tt/search" size="lg" variant="coral">{t('home.heroCta')}</LinkButton>
              <LinkButton href="/tt/post" size="lg" variant="outlineLight">{t('home.heroSecondary')}</LinkButton>
            </div>
          </div>
          <div className="relative hidden min-h-72 overflow-hidden rounded-2xl lg:block">
            <Image
              src={heroImage(1200)}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-6 text-sm font-semibold text-white">{'Trinidad & Tobago · Venezuela'}</p>
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
          {CATEGORIES.slice(0, 20).map((category) => (
            <CategoryCard key={category.id} category={category} countryCode="tt" locale={locale} />
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/tt/search" className="font-semibold text-teal-700 hover:underline dark:text-teal-300">{t('country.viewAll')} →</Link>
        </p>
      </Container>

      <Container className="pb-14">
        <Card className="flex flex-col items-start gap-4 border-coral-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center">
          <span aria-hidden="true" className="text-3xl">💳</span>
          <div className="flex-1">
            <p className="font-bold text-navy-900 dark:text-navy-50">{t('payment.cryptoTitle')}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('payment.siteBanner')}</p>
          </div>
          <LinkButton href="/payments" variant="secondary">{t('payment.learnMore')}</LinkButton>
        </Card>
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
