import { describe, expect, it } from 'vitest';

import {
  NEWS_CHANNELS,
  getNewsChannel,
  isPlayableStreamUrl,
  listNewsChannels,
  listNewsCountries,
} from '../../apps/web/src/lib/channels';

describe('news channel catalog', () => {
  it('uses unique ids', () => {
    const ids = NEWS_CHANNELS.map((channel) => channel.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps enabled streams playable over HTTPS', () => {
    for (const channel of NEWS_CHANNELS.filter((item) => item.enabled)) {
      expect(channel.hlsUrl, channel.id).toMatch(/^https:\/\//);
      expect(isPlayableStreamUrl(channel.hlsUrl)).toBe(true);
    }
  });

  it('labels disabled entries instead of pretending they stream', () => {
    for (const channel of NEWS_CHANNELS.filter((item) => !item.enabled)) {
      expect(channel.hlsUrl).toBe('');
      expect(channel.note).toBeTruthy();
    }
  });

  it('provides both locales for country names', () => {
    for (const channel of NEWS_CHANNELS) {
      expect(channel.countryName.en, `${channel.id}.en`).toBeTruthy();
      expect(channel.countryName.es, `${channel.id}.es`).toBeTruthy();
    }
  });

  it('rejects plain HTTP and mixed-content hosts outside local development', () => {
    expect(isPlayableStreamUrl('http://example.com/live.m3u8')).toBe(false);
    expect(isPlayableStreamUrl('https://cdn.example.com/live.m3u8')).toBe(true);
    expect(isPlayableStreamUrl('http://localhost:8000/live.m3u8')).toBe(true);
    expect(isPlayableStreamUrl('javascript:alert(1)')).toBe(false);
  });

  it('filters by country and hides disabled channels by default', () => {
    const jamaica = listNewsChannels({ country: 'JM' });
    expect(jamaica).toHaveLength(1);
    expect(jamaica[0].id).toBe('tvj-jamaica');
    expect(listNewsChannels().every((channel) => channel.enabled)).toBe(true);
    expect(getNewsChannel('ttt-trinidad')).toBeDefined();
    expect(listNewsChannels().some((channel) => channel.id === 'ttt-trinidad')).toBe(false);
  });

  it('exposes one country row per distinct country code', () => {
    const rows = listNewsCountries();
    const codes = rows.map((row) => row.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(rows.some((row) => row.code === 'TT')).toBe(true);
  });
});
