import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import type { Locale } from '@opencaribe/configuration';
import { notFound } from 'next/navigation';
import { Badge, Card, Container, SectionTitle } from '@opencaribe/ui';
import { HlsPlayer } from '@/components/HlsPlayer';
import { getT } from '@/lib/t';
import { getNewsChannel, isPlayableStreamUrl } from '@/lib/channels';

export default async function NewsChannelPage({ params }: { params: Promise<{ channel: string }> }) {
  const { channel: id } = await params;
  const channel = getNewsChannel(id);
  if (!channel) notFound();

  const locale = (await getLocale()) as Locale;
  const t = await getT();
  const playable = channel.enabled && isPlayableStreamUrl(channel.hlsUrl);

  return (
    <Container className="max-w-5xl py-10">
      <Link href="/news" className="text-sm font-medium text-teal-700 hover:underline dark:text-teal-300">
        ← {t('news.backToNews')}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-900 dark:text-navy-50">{channel.name}</h1>
        {playable ? <Badge tone="danger">{t('news.live')}</Badge> : <Badge tone="neutral">{t('news.offlineBadge')}</Badge>}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {channel.countryName[locale]} · {channel.language} · {channel.owner}
      </p>

      <div className="mt-6">
        {playable ? (
          <HlsPlayer src={channel.hlsUrl} channelName={channel.name} />
        ) : (
          <Card className="p-8 text-center">
            <SectionTitle className="text-xl">{t('news.offlineBadge')}</SectionTitle>
            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">{channel.note}</p>
            <a
              href={channel.website}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {t('news.officialSite')} ↗
            </a>
          </Card>
        )}
      </div>

      <dl className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">{t('news.country')}</dt>
          <dd className="mt-1 text-sm font-semibold text-navy-900 dark:text-navy-50">{channel.countryName[locale]}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">{t('news.language')}</dt>
          <dd className="mt-1 text-sm font-semibold text-navy-900 dark:text-navy-50">{channel.language}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">{t('news.owner')}</dt>
          <dd className="mt-1 text-sm font-semibold text-navy-900 dark:text-navy-50">{channel.owner}</dd>
        </div>
      </dl>

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        {channel.note ?? t('news.sourceNote')}{' '}
        <a href={channel.website} target="_blank" rel="noreferrer" className="font-medium text-teal-700 underline dark:text-teal-300">
          {t('news.officialSite')} ↗
        </a>
      </p>
    </Container>
  );
}
