import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@opencaribe/configuration';
import { Badge, Container, SectionTitle } from '@opencaribe/ui';
import { getT } from '@/lib/t';
import { listNewsChannels, listNewsCountries } from '@/lib/channels';

type SearchParams = Record<string, string | string[] | undefined>;

export default async function NewsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  const rawCountry = typeof query.country === 'string' ? query.country : '';
  const locale = (await getLocale()) as Locale;
  const t = await getT();

  const channels = listNewsChannels({ country: rawCountry || undefined });
  const countries = listNewsCountries();

  return (
    <Container className="py-10">
      <SectionTitle>{t('news.title')}</SectionTitle>
      <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{t('news.subtitle')}</p>

      <div className="mt-6 flex flex-wrap gap-2" role="navigation" aria-label={t('news.channels')}>
        <Link
          href="/news"
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${!rawCountry ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:text-slate-200'}`}
        >
          {t('news.allCountries')}
        </Link>
        {countries.map((country) => (
          <Link
            key={country.code}
            href={`/news?country=${country.code}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${rawCountry === country.code ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 text-slate-700 hover:border-teal-500 dark:border-slate-700 dark:text-slate-200'}`}
          >
            {country.name[locale]} ({country.count})
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Link key={channel.id} href={`/news/${channel.id}`}>
            <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-500 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-navy-900 dark:text-navy-50">{channel.name}</p>
                {channel.enabled ? (
                  <Badge tone="danger">{t('news.live')}</Badge>
                ) : (
                  <Badge tone="neutral">{t('news.offlineBadge')}</Badge>
                )}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                {channel.countryName[locale]}
              </p>
              <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{channel.note ?? channel.owner}</p>
              <p className="mt-auto text-xs text-slate-500 dark:text-slate-400">{channel.language}</p>
            </div>
          </Link>
        ))}
      </div>

      {channels.length === 0 && (
        <p className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {t('news.offlineBadge')}
        </p>
      )}

      <p className="mt-8">
        <Link href="/headlines" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-300">
          {t('headlines.title')} →
        </Link>
      </p>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t('news.sourceNote')}</p>
    </Container>
  );
}
