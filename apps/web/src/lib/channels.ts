import type { Locale } from '@opencaribe/configuration';

/**
 * Curated directory of Caribbean news streams for the in-app HLS player.
 *
 * Only publicly published, free-to-air HTTPS HLS endpoints belong here. Feeds
 * are third-party broadcasts: availability changes without notice and the
 * player must degrade gracefully when a stream goes offline. Disabled entries
 * keep an official link so users know what is missing and why.
 */
export interface NewsChannel {
  id: string;
  name: string;
  countryCode: string;
  countryName: Record<Locale, string>;
  language: string;
  category: 'news' | 'general';
  /** Empty for entries that have no public HLS endpoint. */
  hlsUrl: string;
  website: string;
  owner: string;
  note?: string;
  enabled: boolean;
}

export const NEWS_CHANNELS: NewsChannel[] = [
  {
    id: 'tvj-jamaica',
    name: 'TVJ',
    countryCode: 'JM',
    countryName: { en: 'Jamaica', es: 'Jamaica' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://vod2live.univtec.com/manifest/a99a1804-dc83-411f-8c1c-b62f08cdfa59.m3u8',
    website: 'https://www.televisionjamaica.com/',
    owner: 'RJRGleaner Communications Group',
    note: 'Public HLS feed; availability varies by schedule and region.',
    enabled: true,
  },
  {
    id: 'cbc-tv8-barbados',
    name: 'CBC TV8',
    countryCode: 'BB',
    countryName: { en: 'Barbados', es: 'Barbados' },
    language: 'English',
    category: 'news',
    hlsUrl: 'https://1740288887.rsc.cdn77.org/1740288887/index.m3u8',
    website: 'https://www.cbc.bb/',
    owner: 'Caribbean Broadcasting Corporation',
    note: 'National broadcaster. Not 24/7 on this public CDN.',
    enabled: true,
  },
  {
    id: 'zns-bahamas',
    name: 'ZNS-TV',
    countryCode: 'BS',
    countryName: { en: 'Bahamas', es: 'Bahamas' },
    language: 'English',
    category: 'news',
    hlsUrl: 'https://zns-edge1.streamcomedia.cloud/znstv13/zns1080p_stream/playlist.m3u8',
    website: 'https://znsbahamas.com/',
    owner: 'Broadcasting Corporation of The Bahamas',
    enabled: true,
  },
  {
    id: 'telesur-venezuela',
    name: 'teleSUR',
    countryCode: 'VE',
    countryName: { en: 'Venezuela', es: 'Venezuela' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://mblenmain01.telesur.ultrabase.net/mblivev3/hd/playlist.m3u8',
    website: 'https://www.telesurtv.net/',
    owner: 'Sistema Bolivariano de Comunicación e Información',
    note: 'Latin American news network headquartered in Caracas; state-sponsored.',
    enabled: true,
  },
  {
    id: 'haiti-news-channel',
    name: 'Haiti News Channel',
    countryCode: 'HT',
    countryName: { en: 'Haiti', es: 'Haití' },
    language: 'Haitian Creole / French',
    category: 'news',
    hlsUrl: 'https://cdn.haititivi.com/website/haitinews/index.m3u8',
    website: 'https://haititivi.com/',
    owner: 'HaitiTVI',
    note: 'Not 24/7; the feed can be offline between bulletins.',
    enabled: true,
  },
  {
    id: 'prensa-latina',
    name: 'Prensa Latina TV',
    countryCode: 'CU',
    countryName: { en: 'Cuba', es: 'Cuba' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://eu1.servers10.com:8081/8192/index.m3u8',
    website: 'https://www.prensa-latina.cu/',
    owner: 'Agencia Informativa Latinoamericana',
    enabled: true,
  },
  {
    id: 'teleonce-puerto-rico',
    name: 'TeleOnce',
    countryCode: 'PR',
    countryName: { en: 'Puerto Rico', es: 'Puerto Rico' },
    language: 'Spanish',
    category: 'general',
    hlsUrl: 'https://live.11-cdn.com/TeleOnce/3fc63fe00050c646635f16b071cd33e2.sdp/playlist.m3u8',
    website: 'https://www.teleonce.com/',
    owner: 'Liberman Media Group',
    note: 'General channel with regular news bulletins.',
    enabled: true,
  },
  {
    id: 'ttt-trinidad',
    name: 'TTT',
    countryCode: 'TT',
    countryName: { en: 'Trinidad and Tobago', es: 'Trinidad y Tobago' },
    language: 'English',
    category: 'news',
    hlsUrl: '',
    website: 'https://ttt.live/stream',
    owner: 'TTT Limited',
    note: 'No stable public HLS endpoint published yet. Official live page linked instead.',
    enabled: false,
  },
  {
    id: 'cnc3-trinidad',
    name: 'CNC3',
    countryCode: 'TT',
    countryName: { en: 'Trinidad and Tobago', es: 'Trinidad y Tobago' },
    language: 'English',
    category: 'news',
    hlsUrl: '',
    website: 'https://www.cnc3.co.tt/live-stream',
    owner: 'Guardian Media Limited',
    note: 'News channel. Public HLS URL not currently available; use the official live page.',
    enabled: false,
  },
];

export function getNewsChannel(id: string): NewsChannel | undefined {
  return NEWS_CHANNELS.find((channel) => channel.id === id);
}

export function listNewsChannels(options: { country?: string; includeDisabled?: boolean } = {}): NewsChannel[] {
  return NEWS_CHANNELS.filter((channel) => {
    if (!options.includeDisabled && !channel.enabled) return false;
    if (options.country && channel.countryCode !== options.country.toUpperCase()) return false;
    return true;
  });
}

export function listNewsCountries(): Array<{ code: string; name: Record<Locale, string>; count: number }> {
  const grouped = new Map<string, { code: string; name: Record<Locale, string>; count: number }>();
  for (const channel of NEWS_CHANNELS) {
    const existing = grouped.get(channel.countryCode);
    if (existing) existing.count += 1;
    else grouped.set(channel.countryCode, { code: channel.countryCode, name: channel.countryName, count: 1 });
  }
  return [...grouped.values()];
}

/** Public streams must be HTTPS so they are not blocked as mixed content. */
export function isPlayableStreamUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('https://')) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(url);
}
