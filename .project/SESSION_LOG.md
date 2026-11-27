# Session Log

## 2026-11-25 — Phase 0 foundation

- Read the supplied directive; recorded its truncation at section 15 in `BLOCKERS.md`.
- Inspected the host: Node 24.18, pnpm 12.15, git 2.56, npm registry reachable. No pre-existing OpenCaribe repository.
- Created the repository at `C:\Users\mrjul\Documents\opencaribe` with the requested directory structure, omitting empty modules and documenting the deviation.
- Implemented packages for configuration, database, authentication, validation, localization and UI; modules for listings, geography and search.
- Implemented the Next.js application with 16 routes, bilingual catalogues, theme support and six legal/safety documents.
- Added Docker Compose (PostGIS), Caddy config, Dockerfile, GitHub Actions CI and Playwright smoke tests.
- Fixed workspace resolution issues: extensionless relative imports, root workspace dev-dependencies, next-intl plugin registration, cookie-based locale without middleware, and uppercase country-code normalisation.
- Repaired the pnpm store after a bulk edit inadvertently touched dependency sources; reinstalled all 443 packages from a clean store and re-verified.
- Verification: 33 unit/security tests passed; strict typecheck passed; ESLint passed; production build produced 16 routes; 14 HTTP route checks behaved as expected; search and Spanish locale behaviour confirmed by response inspection.
- Playwright: browser installed, 3 smoke tests passed after scoping a locator to `main`.
- Initialised git, added `.gitattributes` to pin LF line endings, and committed the verified foundation.
- Created the public GitHub repository `iShowLinux/opencaribe` and pushed `main`; added repository topics and verified the remote commit hash matches local HEAD.

## 2026-11-25 — Catalogue expansion, demo imagery and crypto placeholder

- Added 12 categories (31 total): pets, baby/kids, sports/outdoor, musical instruments, books/media, marine/boating, travel/tours, health/beauty, construction, toys/games, art/crafts and recycled/sustainable.
- Added `cryptoPayments` to country configuration and a bilingual `payment` message namespace; implemented a disabled "Connect Adena wallet" card, a disabled wizard payment option and a `/payments` explainer. No wallet or transaction code exists.
- Verified 49 Unsplash photo IDs resolve, then wired 24 placeholder posts, category thumbnails and the homepage hero through `next/image` with a single remote pattern.
- Added ADR 0006 and tests for category count and the coming-soon crypto flags.
- Verification: 34 unit/security tests, 5 Playwright tests, strict typecheck, ESLint, production build (17 routes), HTTP checks on all new pages, and a successful `200 image/jpeg` from the image optimiser.

## 2026-11-25 — GNOT payments Phase 1 (read-only wallet connect)

- Researched gno.land networks and Adena integration; targeted the current testnet **Onyx (`onyx-1`)** with RPC `https://rpc.onyx.testnets.gno.land:443`.
- Added `GNOT` (6 decimals, denom `ugnot`) to the currency model and extended `CryptoPaymentConfig` with `asset` and `walletConnect` blocks in both countries.
- Created `modules/payments` with pure coin parsing/formatting helpers and unit tests; added an Adena provider typing file and a read-only `AdenaWalletCard` client island (AddEstablish → GetAccount → address/balance/network display, chain-mismatch warning, faucet link).
- Added GnoConnect metadata to the layout and flipped the payment card/wizard copy to distinguish live wallet connect from disabled settlement.
- Added ADR 0007 superseding ADR 0006 with the four-phase rollout.
- Verification: 40 unit/security tests (8 files), 5 Playwright tests, strict typecheck, ESLint, production build (17 routes), and HTTP checks confirming GnoConnect metadata plus testnet wallet copy on `/payments`.

## 2026-11-25 — Vercel setup and production deploy

- Installed Vercel CLI 67.0.0; already authenticated as `ishowlinux`. Installed the standalone Vercel skills globally (`~/.agents/skills`, visible to Hermes). Registered the Vercel MCP server in Hermes config (`npx -y mcp-remote https://mcp.vercel.com`); it needs an agent restart plus OAuth consent.
- Linked the repo to the existing project `ishowlinux/opencaribe`; fixed an invalid region selector (`mia1` → `iad1`).
- Deployed production: **https://opencaribe.vercel.app** (READY). Verified `/`, `/tt`, `/ve`, `/payments`, Unsplash imagery, GnoConnect metadata and Spanish locale over HTTP. Git pushes to `main` now auto-deploy.

## 2026-11-25 — Social SSO (Google + X)

- Added Better Auth social providers `google` and `twitter` behind `GOOGLE_CLIENT_ID/SECRET` and `TWITTER_CLIENT_ID/SECRET`; a provider appears on `/login` and `/register` only when both values are present.
- New `@opencaribe/authentication` helpers (`enabledSocialProviders`, `resolveSocialProviders`) with unit tests; bilingual strings for the buttons.
- Auth catch-all now redirects unconfigured social sign-in attempts to `/login` instead of returning a 500.
- Documented OAuth app setup and callback URLs in `docs/deployment/deployment.md`; pushed and redeployed production.

## 2026-11-26 — News feature

- Verified working HTTPS HLS manifests by direct request (TVJ, CBC TV8, ZNS, teleSUR HD, Haiti News Channel, Prensa Latina, TeleOnce). WAPA/Antena21/Antena7 failed or were geo/token blocked; ttt.live unreachable from this network.
- Added `hls.js@1.7.4`, `/news` directory + `/news/[channel]` player page, header/footer navigation, en/es copy, and `tests/unit/news-catalog.test.ts` (catalog integrity: unique ids, HTTPS, locale parity, disabled honesty).
- Player supports play/pause, mute, quality levels, fullscreen, buffering and retryable error states; only catalog URLs can reach `<video>`.
- TTT and CNC3 are listed as `enabled: false` with their official watch-live links because no stable public manifest was found.

## 2026-11-26 (later) — News catalog re-verified against real Chromium

- Discovered the managed Hermes QA browser never opens MediaSource (readyState stays `closed`), so hls.js stalls there regardless of stream. Mux's reference stream behaved identically, proving it was environmental, not our code.
- Fixed a real bug found while diagnosing: `useTranslations()` returned a new function identity per render, which re-ran the player effect and destroyed/recreated HLS in a loop. Stabilised via `tRef`.
- Added a 20-second watchdog that surfaces a retryable error instead of spinning forever when MSE stalls.
- Re-scanned iptv-org country lists plus broadcaster CDNs; required manifest + media playlist + segment all to send `access-control-allow-origin`, supported codecs, and end-to-end playback in Playwright Chromium.
- Final enabled set (all played: readyState 4, advancing currentTime): TVJ, ZNS-TV, Globovisión, Venevisión Internacional, Telemundo PR/WKAQ, TeleOnce, Prensa Latina, Haiti News Channel, Antena 21, Telesistema 11, Telenews Canal 40.
- Dropped CBC TV8 (manifest load error from browsers), Canal I (segment fetch/CORS failed), and teleSUR (avc1.66.x unsupported by MSE). TTT and CNC3 remain listed disabled with official links.

## 2026-11-26 (later) — Accounts, wallet posting, messaging, testnet checkout

- Added `lib/local-store.ts`: scrypt password hashing, 30-day httpOnly sessions, per-listing message threads, payment orders; JSON mirror for durability when the filesystem is writable, memory fallback on serverless.
- Reworked AuthForm onto those actions (register/login/forgot/logout); verified registration redirects home with `oc_session`.
- Posting identity now has three tiers: wallet-connected (instant, 5/day, honeypot), registered account (instant), anonymous (pending review, hidden from public feeds). `cityId` made optional in the validation schema; public reads filter to active listings.
- Built messaging inbox + conversation pages and a server action that opens one thread per listing pair; Contact seller button routes buyers into it.
- Built testnet checkout: WalletPayButton connects Adena, signs `/bank.MsgSend` to the seller's wallet, then `recordPayment` validates the listing/seller/tx shape and stores an order shown on `/payments`.
- Shared UI cleanup: polished `buttonVariants`, added `LinkButton` (removes `<a><button>` nesting across homepage, header, country and listing pages), responsive wizard controls, optional-city hint.
- Playwright end-to-end walkthrough on a production build passed every step: register -> post (public listing appears in search) -> second account messages the seller -> seller inbox/thread reply -> payments page renders.
- Fixed recurring test-harness trap: `button[type=submit]` matched the header locale switcher; all e2e selectors scoped to the auth form.

## 2026-11-26 (later) — PostgreSQL store + real end-to-end verification

- Added `payment_orders` table and `users.wallet_address`; generated migration `packages/database/drizzle/0000_*.sql`.
- Added `apps/web/src/lib/db-store.ts` implementing the full demo-store API on Drizzle/Postgres, plus `lib/store.ts` facade that switches on `DATABASE_URL`; callers (auth actions, listing persistence, messaging, orders) now run unchanged against either backend.
- `persistListing()` inserts into `listings` (UUID ids), creating synthetic user rows for wallet/anonymous sellers so `seller_id` FK holds; wallet sellers keep their address for checkout.
- Ran PostGIS 16 container, applied schema via psql, built production bundle and ran the Playwright walkthrough with `DATABASE_URL`: register -> post (public listing found in search) -> second account opens thread -> seller reply persists. Verified rows in users/listings/message_threads/messages/sessions.
- Deployment steps documented in `docs/deployment/production-checklist.md`; remaining action is creating Neon and adding `DATABASE_URL`/`BETTER_AUTH_SECRET` (+ optional OAuth secrets) to Vercel Production.

## 2026-11-26 (final) — Production database cutover

- Installed the Neon marketplace integration through the authenticated Vercel CLI (`vercel integration accept-terms neon --yes`, `vercel integration add neon`), creating a free Neon project connected to opencaribe for all environments; `DATABASE_URL` and related vars were injected automatically.
- Pulled Production env locally (gitignored), applied `packages/database/drizzle/0000_*.sql` to Neon, confirmed all 17 tables exist, then removed the local env file.
- Redeployed and ran the Playwright walkthrough against https://opencaribe.vercel.app: register -> publish (UUID listing found by search on another instance) -> second account messages seller -> seller reply persists -> /payments renders. Shared-state blocker resolved.

## 2026-11-27 — Profiles, dashboard and seller ratings

- Added `seller_ratings` table (unique per seller+reviewer, upsert on re-rate) plus store implementations in both backends and facade methods `rateSeller`, `listRatingsForSeller`, `getSellerStats`.
- New account dashboard (`/[country]/account`): member since, wallet, own listings with status, reviews received, sign-out.
- New public seller profile (`/[country]/u/[userId]`): active listings, average rating and review list; linked from listing pages ("Sold by …").
- Listing sidebar shows seller name/profile link, star average and a RateSellerForm (login required, self-rating blocked, score 1–5).
- Replaced effect-based auto-navigation after validation errors with render-derived step selection (React compiler rule) and fixed nav base to use the effective step.
- Schema applied to local PostGIS and production Neon; full walkthrough passed on the live site.

## 2026-11-27 (later) — Launch hardening: moderation, analytics, domain prep

- Full production audit: all routes 200, no page errors; register/post/dashboard/profile/rating/messaging flows pass.
- Added roles (`user|moderator|admin`) across both stores, `ADMIN_EMAILS` bootstrap on register/login, `/admin` pending-review queue with approve/reject server action and header "Administration" entry for privileged roles.
- Anonymous listings now only become public after moderator approval; verified end-to-end (pending hidden from search -> approve -> visible).
- Integrated `@vercel/analytics` in the root layout; wrote custom-domain runbook (`docs/deployment/custom-domain.md`).
- Verified live with `ADMIN_EMAILS` set in Vercel Production.

## 2026-11-27 (later) — Brand, markets, channels, offers

- Replaced the "OC" tile with an original sailship mark (white sails + hull over
  a wave on the teal tile) as a React component and `app/icon.svg`; checked at
  36px/96px and on navy.
- Added Jamaica, Barbados and Guyana markets end-to-end (currency JMD/BBD/GYD,
  regions/cities, timezones, locales, shared policy blocks). Country picker and
  homepage pick them up automatically.
- Added 8 candidate channels from iptv-org discovery; vetted each with the
  3-hop CORS check and Chromium playback. 7 enabled after `readyState 4`
  playback; CBC TV8 parked as disabled with the reason recorded.
- Built offers: `offers` table + both store backends, offer form on listings,
  buyer/seller dashboard sections, accept/decline/cancel server actions, unit
  tests.
- Added the wallet gate: gno.land wallet required for wallet sellers and
  GNOT-priced listings; `wugnot.BalanceOf` read through the public RPC blocks
  messages/offers below the asking amount; fails open when the oracle errors so
  a network outage never locks the marketplace.
- Fixed `/admin` 500 (Date parameter serialization in the analytics query).
- Full production walkthroughs pass: cross-country navigation, dashboard across
  markets, offers lifecycle, admin moderation + analytics.

## 2026-11-27 (later) — Community, maps, shipping

- Free wallet nav button for logged-out users (Adena), hidden when signed in.
- Members-only community: three categories (events/feedback/support), thread pages
  with replies, author lines show wallet address alongside display name and the
  UI states that names are only labels (wallet is the proof).
- Wallet gate now proceeds when a wallet is already linked and offers a
  "connect a different wallet" path from blocked message/offer states and the
  account wallet card.
- Listings render the exact region/city label, an OpenStreetMap embed and a
  driving route (OSRM) from the visitor's IP-based location when Vercel supplies
  geolocation headers, plus Google Maps directions link and a Ship-this-item link.
- `/shipping` shipping matrix: package quote form wired to an optional provider
  adapter, with direct Pirate Ship label creation (no public API exists, so live
  rates require a connected carrier account).
- Fixed the header Browse link outside country pages (`/search` 404) via scoped
  links and a root `/search` -> `/browse` redirect; footer now lists every market.

## 2026-11-27 (later) — Moderation powers, photos, payments

- Admins/moderators can delete (soft-remove) listings from `/admin` or directly on
  a listing, and ban/restore members. Bans drop DB sessions immediately,
  `getCurrentUser()` treats banned users as signed out, and login is rejected
  with a suspension message; profiles show a Suspended badge.
- Post form now accepts one item photo (PNG/JPEG/WebP, <=1.5 MB) stored in the
  new `listings.image_url` column and rendered on listing pages.
- Wallet connect no longer fails when Adena is already established; it reuses
  the existing session first.
- Crypto payments enabled across markets: sellers can price in GNOT, and
  listings with a seller wallet expose the Adena `/bank.MsgSend` checkout at
  the exact asking amount (testnet onyx-1).

## 2026-11-27 (later) — Basin coverage, news, chat

- Expanded COUNTRIES from 5 to 22 markets covering the Caribbean basin with
  local currencies (BSD, DOP, HTG, CUP, BZD, XCD, SRD, AWG, ANG, EUR) via a
  shared `caribbeanMarket()` builder; homepage/picker/routing pick them up.
- `/headlines`: US-outlet RSS aggregation (NYT Americas, WaPo World, CBS World,
  NPR World) filtered to Caribbean keywords, cached in `news_articles` with an
  hourly cron (`/api/cron/headlines`, protected by CRON_SECRET) plus first-load
  refresh.
- Inbox messages gained a Translate button (server proxy, EN<->ES).
- Profiles support a WhatsApp number saved from the dashboard and shown as a
  wa.me link on seller profiles.
- `/chat`: logged-in live room backed by `chat_messages`, 5s polling, nav entry.
- Crypto launch hardening: wallet connect reuses established Adena sessions in
  the checkout and payments card, balance gate uses each market's configured
  RPC, "coming soon" copy replaced with live-testnet messaging.
