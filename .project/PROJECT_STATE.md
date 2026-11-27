# Project State

Last updated: 2026-11-27 (moderation queue + analytics live; profiles/dashboard/ratings verified)

## Repository

Public GitHub repository: https://github.com/iShowLinux/opencaribe (branch `main`, commit `00a2763`).

## Live deployment

**https://opencaribe.vercel.app** — Vercel production, auto-deploys from `main`, backed by Vercel Postgres (Neon free plan, connected through the Vercel marketplace integration). CLI authenticated as `ishowlinux`; project id `prj_sg1i72F8qGlCMhifSI6o2YJrLjNp`.

## Where the code lives

`C:\Users\mrjul\Documents\opencaribe` — pnpm workspace, 11 projects.

## What exists and is verified

| Area | State | Evidence |
| --- | --- | --- |
| Monorepo scaffold | Done | `package.json`, `pnpm-workspace.yaml`, committed `pnpm-lock.yaml`; `pnpm install --frozen-lockfile` succeeds |
| Country config (TT, VE) | Done | `packages/configuration/src/countries.ts`; unit tests assert locale, currency, prefix, timezone |
| Categories (31) | Done | `packages/configuration/src/categories.ts`; test asserts count, dual-language names and new slugs |
| Money | Done | `packages/configuration/src/currency.ts`; tests cover parsing, formatting, VES/VED distinction |
| Drizzle schema | Done | `packages/database/src/schema.ts`; typecheck passes |
| Auth + RBAC | Both paths implemented | `lib/store.ts` selects PostgreSQL (Drizzle: users/sessions/accounts) when `DATABASE_URL` is set, else the scrypt demo store; Better Auth factory, RBAC matrix and Google/X SSO remain available |
| Listing state machine | Done | `modules/listings/src/state.ts`; tests cover transitions, ownership, expiry |
| Geography | Done | `modules/geography/src/index.ts`; seed CLI and tests pass |
| Search | Done (in-memory) | `modules/search/src/index.ts`; tests cover filters, pagination, currency-safe ordering |
| Gno wallet connect (P1) | Done (read-only) | Adena client island; address/balance/network on `/payments`; chain-mismatch warning; settlement still disabled |
| Wallet posting | Done (demo) | Register-free posting when Adena is connected: server validates gno address, 5/day limit, honeypot; account/wallet posts publish instantly, anonymous go to review | 
| Messaging | Done (Postgres + demo) | Per-listing threads, inbox, replies, unread marking via `message_threads`/`thread_participants`/`messages` | 
| Moderation queue + admin roles | Done (live) | `ADMIN_EMAILS` grants admin on register/login; `/admin` shows the pending-review queue with approve/reject; anonymous posts stay hidden until approved |
| Web analytics | Shipped | `@vercel/analytics` mounted in the layout; needs one-click enable in the Vercel dashboard |
| Custom domain | Prepared | `docs/deployment/custom-domain.md` (DNS + env vars); awaiting the domain you want to point |
| Profiles / dashboard / ratings | Done (live) | Public seller profiles (`/[country]/u/[userId]`), account dashboard (`/[country]/account`, linked as **My account** in the header when signed in), 1–5 star reviews persisted in `seller_ratings` with one review per reviewer per seller; owners see a dashboard shortcut on their listings and never see the rate form on their own ads | 
| Testnet crypto checkout | Done (send-only) | Listing page pays a seller wallet via Adena `/bank.MsgSend`; tx hash stored in `payment_orders` and shown on `/payments` | 
| News / IPTV player | Done (curated) | hls.js player + catalog (`apps/web/src/lib/channels.ts`); 11 channels verified playing in Chromium; TTT/CNC3/teleSUR kept as disabled with recorded reasons |
| i18n | Done | en/es catalogues, cookie switcher; key-parity test passes |
| Web UI | Done (Phase 0 scope + news) | 19 routes incl. `/news`, `/news/[channel]`; production build and HTTP checks pass |
| Media pipeline | Not started | No upload processing yet |
| Messaging | Schema + placeholder UI | No conversation logic |
| Moderation | Policy config + placeholder admin | No queue implementation |
| Reports | Validated action only | No persistence |
| PostgreSQL runtime | Not exercised | No database available during Phase 0 verification |

## Verification actually executed (2026-11-25)

- `pnpm test` — **12 files, 60 tests passed** (adds local-store, wallet-posting and news-catalog suites).
- `pnpm typecheck` — passed across all workspaces.
- `pnpm lint` — passed with zero warnings or errors.
- `pnpm build` — production build succeeded; 19 routes emitted (adds `/news`, `/news/[channel]`).
- HTTP checks against `pnpm start` on port 3000: `/`, `/tt`, `/ve`, `/tt/search?q=phone`, `/ve/c/electronics`, `/tt/l/tt-1001`, `/tt/post`, `/tt/favorites`, `/tt/messages`, `/tt/account`, `/login`, `/register`, `/info/privacy`, `/admin` all returned **200**; `/xx` returned **404** as expected.
- Content checks: search for `phone` returned only the phone listing; `NEXT_LOCALE=es` produced Spanish headings on `/ve`.
- Playwright smoke suite: **5 tests passed** (Chromium, against the production server), including new-category browsing and the live wallet-connect state.
- Wallet-connect HTTP check: `/payments` exposes GnoConnect metadata (`rpc=https://rpc.onyx.testnets.gno.land:443`, `chainid=onyx-1`) and renders the testnet copy, "Install Adena"/faucet link; `/tt/post` still shows the disabled crypto payment option.
- HTTP re-check after the imagery/crypto change: `/`, `/tt`, `/ve`, `/tt/l/tt-1007`, `/tt/c/pets`, `/tt/c/sustainability`, `/payments`, `/tt/post` all returned **200**; `/payments` contained "Pay with crypto" and the coming-soon payment copy; the Next image optimiser returned `200 image/jpeg` for an Unsplash URL.
- Initial run had one locator issue (the country `<select>` option matched before the visible card); the locator was scoped to `main` and re-run green.

## Important implementation notes

- URLs use lowercase country segments (`/tt`, `/ve`); `toCountryCode()` normalises them to uppercase config keys.
- Locale is cookie-based (`NEXT_LOCALE`), not URL-prefixed, so `/tt` works in both languages. No middleware is used.
- Listings are served from deterministic demo data unless `DATABASE_URL` is set; DB errors fall back to demo data.
- Draft creation in the wizard is validated server-side and held in a process-local store; database persistence is Phase 1.
- Demo listings (24) and category thumbnails use verified Unsplash photo IDs through `next/image`; `next.config.ts` allows only `images.unsplash.com`.
- Profiles/dashboard/ratings verified on production: seller posts → public profile link + star average; second account rates 4★ with comment; seller dashboard and profile both show it.
- Production PostgreSQL is live: schema applied to Neon, and a Playwright walkthrough against the deployed URL passed register -> post (visible in search across serverless instances) -> two-account messaging -> payments page.
- Without it, demo accounts/messages/orders persist to `LOCAL_DATA_DIR` (default `./.opencaribe/local-store.json`) when writable, so registration, posting and messaging survive restarts locally; this is explicitly a development/demo store, not the production database.
- Public listings are filtered to `status === 'active'`; drafts and anonymous pending-review submissions never appear in search results.
- City is optional on listings (region-level location is enough); exact addresses are never required.
- Wallet posts are active immediately with a 5-per-day per-address limit plus a honeypot; wallet connection proves possession of the address to Adena, not cryptographic ownership to OpenCaribe, so wallet sellers are labelled accordingly.
- Testnet checkout broadcasts a real MsgSend and records the tx hash; no escrow or dispute logic exists yet.
- News streams are curated and HTTPS-only; the player has no arbitrary-URL input, so it cannot be used as an open relay. 11 channels were verified end-to-end in Playwright Chromium (buffered fragments, advancing playback); the managed Hermes QA browser has MediaSource permanently closed, so playback is not verifiable there. See `docs/features/news.md`.
- Adena crypto payments are a **placeholder only** for settlement: country config has `enabled: false` / `comingSoon: true`. Wallet connection (P1) is live on the Onyx testnet and is read-only — no wallet API beyond account reads, no signing, no transactions. See ADR 0007.

## Next milestone

Phase 1 — database-backed auth and listing persistence, then the secure media pipeline. See [BACKLOG.md](BACKLOG.md).
