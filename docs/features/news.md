# News / IPTV player

The **News** feature is a curated live-TV directory plus an in-page HLS player
built on [hls.js](https://github.com/video-dev/hls.js). It plays free-to-air
public streams published by Caribbean broadcasters.

## Where things live

| Concern | File |
| --- | --- |
| Channel catalog, validation, lookup | `apps/web/src/lib/channels.ts` |
| Player component | `apps/web/src/components/HlsPlayer.tsx` |
| Directory page | `apps/web/src/app/news/page.tsx` |
| Single-channel page | `apps/web/src/app/news/[channel]/page.tsx` |
| Catalog unit tests | `tests/unit/news-catalog.test.ts` |
| UI copy (English / Spanish) | `packages/localization/messages/{en,es}.json` under `news` |

## Current channels (verified 2026-11-26)

Playable in Chromium through hls.js, with CORS and supported codecs confirmed:

| Channel | Country | Language | Type |
| --- | --- | --- | --- |
| TVJ | Jamaica | English | general + news bulletins |
| ZNS-TV | Bahamas | English | news |
| Globovisión | Venezuela | Spanish | news |
| Venevisión Internacional | Venezuela | Spanish | general + news |
| Telemundo Puerto Rico (WKAQ) | Puerto Rico | Spanish | news |
| TeleOnce | Puerto Rico | Spanish | general + news |
| Prensa Latina TV | Cuba | Spanish | news |
| Haiti News Channel | Haiti | French / Haitian Creole | news |
| Antena 21 | Dominican Republic | Spanish | news |
| Telesistema 11 | Dominican Republic | Spanish | general + news |
| Telenews Canal 40 | Dominican Republic | Spanish | news |

Listed but disabled, with the reason recorded in `channels.ts`:

- **TTT**, **CNC3** (Trinidad and Tobago): no stable public HLS endpoint found;
  official watch-live pages are linked instead.
- **teleSUR**: its feed advertises H.264 Main profile (`avc1.66.x`), which
  Chromium's MSE rejects (`MediaSource.isTypeSupported(...) === false`).

CBC TV8 (Barbados) was tested and dropped because the CDN failed manifest
loads from browsers even though plain HTTPS requests succeed.

## Verification method (repeat before adding any stream)

```sh
# 1. Manifest is valid HLS and advertises supported codecs
curl -sS -A 'Mozilla/5.0' -H 'Origin: https://opencaribe.vercel.app' \
  'https://example.com/live/index.m3u8' | head -n 5

# 2. Manifest AND media playlist AND a segment all answer with
#    access-control-allow-origin: * when the app origin is sent,
#    otherwise hls.js cannot read them in a normal browser.
```

Then play it in a real browser with working MSE (the repository's Playwright
Chromium works; the managed Hermes QA browser has MediaSource permanently
closed, so playback cannot be exercised there):

```js
// node script using @playwright/test against the local dev server
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:3000/news/<channel-id>');
await page.waitForTimeout(12000);
console.log(await page.evaluate(() => {
  const v = document.querySelector('video');
  return { readyState: v.readyState, currentTime: v.currentTime };
}));
// readyState >= 2 and currentTime increasing means real playback.
```

Expected result: `readyState: 4`, non-zero advancing `currentTime`.

## Player behaviour and security notes

- Only URLs listed in `NEWS_CHANNELS` can reach the `<video>` element. There is
  deliberately no user-supplied stream URL, so the app cannot be used as an
  open HLS relay.
- All seeded streams are HTTPS; localhost HTTP is allowed only by
  `isPlayableStreamUrl()` for development.
- A 20-second watchdog turns a silent stall into a retryable error state. This
  matters when MediaSource fails to open or the feed goes dark.
- Streams are third-party broadcasts; availability and geo-restriction vary by
  schedule and region. The UI says so (`news.sourceNote`).
- Copyright belongs to each broadcaster. Every channel page links to the
  official site.

## Adding or changing a channel

1. Find the broadcaster's own public HLS manifest. Do not add re-hosted proxy
   feeds, scraper lists, or anything whose only source is a forum or pastebin.
2. Run the verification above; all three checks must pass.
3. Add an entry to `NEWS_CHANNELS` with both localized `countryName` values,
   language, owner, official website and a note explaining schedule limits.
4. Run `pnpm test`; the catalog tests enforce HTTPS, locale parity, unique ids
   and honest disabled-state handling.

If a stable public manifest does not exist, keep the entry `enabled: false`
with an empty `hlsUrl` and the official live page in `website`.
