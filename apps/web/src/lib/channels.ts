import type { Locale } from '@opencaribe/configuration';

/**
 * Curated directory of Caribbean news streams for the in-app HLS player.
 *
 * Rules for inclusion:
 * - Public, free-to-air HTTPS HLS manifests only.
 * - Verified end-to-end in a real Chromium (manifest -> media playlist ->
 *   MPEG-TS segments buffered and playback advancing).
 * - CORS (`Access-Control-Allow-Origin`) present on manifest AND segments, so
 *   hls.js can read them in a normal browser.
 * - Codecs the browser stack supports through MediaSource Extensions.
 *
 * Entries that fail one of these checks are kept with `enabled: false` and a
 * note explaining why, rather than being presented as a working player.
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
    note: 'General service with regular news bulletins; not 24/7.',
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
    id: 'globovision-venezuela',
    name: 'Globovisión',
    countryCode: 'VE',
    countryName: { en: 'Venezuela', es: 'Venezuela' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://59d39900ebfb8.streamlock.net/globo-720p/globo-720p/playlist.m3u8',
    website: 'https://www.globovision.com/',
    owner: 'Globovisión',
    note: 'Venezuelan news network. Schedule may switch to archived programmes between bulletins.',
    enabled: true,
  },
  {
    id: 'venevision-venezuela',
    name: 'Venevisión Internacional',
    countryCode: 'VE',
    countryName: { en: 'Venezuela', es: 'Venezuela' },
    language: 'Spanish',
    category: 'general',
    hlsUrl: 'https://vod2live.univtec.com/manifest/4c41c0d8-e2e4-43cc-bd43-79afe715e1b3.m3u8',
    website: 'https://www.venevision.com/',
    owner: 'Cisneros Media',
    note: 'International feed with news and entertainment.',
    enabled: true,
  },
  {
    id: 'telemundo-puerto-rico',
    name: 'Telemundo Puerto Rico (WKAQ)',
    countryCode: 'PR',
    countryName: { en: 'Puerto Rico', es: 'Puerto Rico' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream2/master.m3u8',
    website: 'https://www.telemundopr.com/',
    owner: 'NBCUniversal Telemundo Station Group',
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
    id: 'haiti-news-channel',
    name: 'Haiti News Channel',
    countryCode: 'HT',
    countryName: { en: 'Haiti', es: 'Haití' },
    language: 'Haitian Creole / French',
    category: 'news',
    hlsUrl: 'https://cdn.haititivi.com/website/haitinews/index.m3u8',
    website: 'https://haitinewstv.com/',
    owner: 'HNEWS',
    note: 'Continuous Haitian news in French and Haitian Creole; not 24/7.',
    enabled: true,
  },
  {
    id: 'antena-21',
    name: 'Antena 21',
    countryCode: 'DO',
    countryName: { en: 'Dominican Republic', es: 'República Dominicana' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://hls.tvabierta.net/hls/021.m3u8',
    website: 'https://www.antena7.com.do/',
    owner: 'Albavisión',
    note: 'Santo Domingo station carrying news and information programming.',
    enabled: true,
  },
  {
    id: 'telesistema-11',
    name: 'Telesistema 11',
    countryCode: 'DO',
    countryName: { en: 'Dominican Republic', es: 'República Dominicana' },
    language: 'Spanish',
    category: 'general',
    hlsUrl: 'https://cdn4.wind.do/streams/telesistema/telesistema_master.m3u8',
    website: 'https://telesistema11.com.do/',
    owner: 'Telesistema 11',
    enabled: true,
  },
  {
    id: 'telenews-canal-40',
    name: 'Telenews Canal 40',
    countryCode: 'DO',
    countryName: { en: 'Dominican Republic', es: 'República Dominicana' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: 'https://stream1.28tv.online/TeleNewsCanal40/index.m3u8',
    website: 'https://telenewscanal40.com/',
    owner: 'Telenews Canal 40',
    note: 'Santo Domingo news channel focused on continuous coverage.',
    enabled: true,
  },

  // Disabled: documented gaps, not dead weight.
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
    note: 'National broadcaster. No stable public HLS endpoint published yet; official live page linked instead.',
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
  {
    id: 'telesur-venezuela',
    name: 'teleSUR',
    countryCode: 'VE',
    countryName: { en: 'Venezuela', es: 'Venezuela' },
    language: 'Spanish',
    category: 'news',
    hlsUrl: '',
    website: 'https://www.telesurtv.net/',
    owner: 'Sistema Bolivariano de Comunicación e Información',
    note: 'Feed advertises H.264 Main profile (avc1.66.x), which most MSE browsers refuse; no compatible rendition offered.',
    enabled: false,
  },
  {
    id: 'gnn-jamaica',
    name: 'GNN TV',
    countryCode: 'JM',
    countryName: { en: 'Jamaica', es: 'Jamaica' },
    language: 'English',
    category: 'news',
    hlsUrl: 'https://na.linear.zype.com/bf94f9f4-383c-40e0-9d49-279a4f33ab8d/f29b8836-d990-4c8d-b421-192a8f43edc4-zype/live.m3u8',
    website: 'https://gnntvjamaica.com/',
    owner: 'Gleaner Communications Network',
    note: 'Verified HLS feed; schedule may include replays between bulletins.',
    enabled: true,
  },
  {
    id: 'cbc-tv8-barbados',
    name: 'CBC TV8',
    countryCode: 'BB',
    countryName: { en: 'Barbados', es: 'Barbados' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://1740288887.rsc.cdn77.org/1740288887/index.m3u8',
    website: 'https://www.cbc.bb/',
    owner: 'Caribbean Broadcasting Corporation',
    note: 'Flagship Barbadian channel with regular news bulletins.',
    enabled: true,
  },
  {
    id: 'mtv-guyana',
    name: 'MTV Guyana',
    countryCode: 'GY',
    countryName: { en: 'Guyana', es: 'Guyana' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://stream.mtvgy.com/mtvguyana/index.fmp4.m3u8',
    website: 'https://mtvgy.com/',
    owner: 'MTV Guyana',
    enabled: true,
  },
  {
    id: 'ziz-tv-nevis',
    name: 'ZIZ TV',
    countryCode: 'KN',
    countryName: { en: 'Saint Kitts and Nevis', es: 'San Cristóbal y Nieves' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://media.slactech.com:1936/ZIZDirect/ZIZDirect/playlist.m3u8',
    website: 'https://zizonline.com/',
    owner: 'ZIZ Broadcasting Corporation',
    enabled: true,
  },
  {
    id: 'nevis-television',
    name: 'Nevis Television',
    countryCode: 'KN',
    countryName: { en: 'Saint Kitts and Nevis', es: 'San Cristóbal y Nieves' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://media.slactech.com:1936/NTvDirect/ngrp:NTvDirect_all/playlist.m3u8',
    website: 'https://nevistelevision.com/',
    owner: 'Nevis Television',
    enabled: true,
  },
  {
    id: 'caribbean-hot-7',
    name: 'Caribbean Hot 7 TV',
    countryCode: 'LC',
    countryName: { en: 'Saint Lucia', es: 'Santa Lucía' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://vids1.intacs.com/caribbeanhot7tv/ch7-1.stream/playlist.m3u8',
    website: 'https://www.hot7tv.com/',
    owner: 'Caribbean Hot 7 TV',
    note: 'Feed occasionally re-announces its playlist; the player retries automatically.',
    enabled: true,
  },
  {
    id: 'tbn-suriname',
    name: 'TBN TV',
    countryCode: 'SR',
    countryName: { en: 'Suriname', es: 'Surinam' },
    language: 'Dutch',
    category: 'general',
    hlsUrl: 'https://live.suricloud.com/hls/tbntv/index.m3u8',
    website: 'https://tbn.sr/',
    owner: 'TBN Suriname',
    enabled: true,
  },
  {
    id: 'bizz-tv-trinidad',
    name: 'Bizz TV',
    countryCode: 'TT',
    countryName: { en: 'Trinidad and Tobago', es: 'Trinidad y Tobago' },
    language: 'English',
    category: 'general',
    hlsUrl: 'https://stream.bizzmedia.biz/bizz_tv/index.m3u8',
    website: 'https://bizzmedia.biz/',
    owner: 'Bizz Media',
    enabled: true,
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
