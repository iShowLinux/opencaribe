# News / IPTV player

The **News** feature is a curated live-TV directory plus an in-page HLS player
built on [hls.js](https://github.com/video-dev/hls.js). It plays free-to-air
public streams published by Caribbean broadcasters and news agencies.

## Where things live

| Concern | File |
| --- | --- |
| Channel catalog, validation, lookup | `apps/web/src/lib/channels.ts` |
| Player component | `apps/web/src/components/HlsPlayer.tsx` |
| Directory page | `apps/web/src/app/news/page.tsx` |
| Single-channel page | `apps/web/src/app/news/[channel]/page.tsx` |
| Catalog unit tests | `tests/unit/news-catalog.test.ts` |
| UI copy (English / Spanish) | `packages/localization/messages/{en,es}.json` under `news` |

## Adding or changing a channel

1. Find the broadcaster's own public HLS manifest (`https://…/index.m3u8` or
   `playlist.m3u8`). Do not add re-hosted proxy feeds, scrapper lists, or
   anything whose only source is a pastebin / forum.
2. Verify it yourself before committing:

   ```sh
   curl -sS -A 'Mozilla/5.0' 'https://example.com/live/index.m3u8' | head -n 3
   ```

   The first line must be `#EXTM3U`. Also confirm the URL is HTTPS, otherwise
   browsers block it as mixed content on the deployed site.
3. Add an entry to `NEWS_CHANNELS` with `countryCode`, both localized
   `countryName` values, `language`, `owner`, `website`, and an optional
   `note` explaining schedule or availability limits.
4. Run `pnpm test` — the catalog tests enforce HTTPS, locale parity, unique ids,
   and honest disabled-state handling.

If a stable public manifest does not exist, add the entry with
`enabled: false`, an empty `hlsUrl`, and the official watch-live URL in
`website`. Disabled channels render as "No public stream" cards instead of a
broken player.

## Player behaviour and security notes

- Only URLs listed in `NEWS_CHANNELS` can reach the `<video>` element. There is
  deliberately no user-supplied stream URL, so the app cannot be used as an
  open HLS relay.
- All seeded streams are HTTPS. Localhost HTTP is allowed only by
  `isPlayableStreamUrl()` for development.
- Streams are third-party broadcasts. Availability changes without notice;
  the player shows a retryable error state rather than failing silently.
- Autoplay starts muted-friendly via the play button; quality selection is
  provided when the manifest advertises multiple levels.
- Geo-restriction is possible even when a URL responds here. This is expected
  and documented in the UI (`news.sourceNote`).
- Copyright and redistribution terms belong to each broadcaster. The app
  links to the official site from every channel page.
