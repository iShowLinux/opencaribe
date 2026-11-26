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
