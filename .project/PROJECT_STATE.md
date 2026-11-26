# Project State

Last updated: 2026-11-25 (Phase 0 foundation)

## Repository

Public GitHub repository: https://github.com/iShowLinux/opencaribe (branch `main`, commit `00a2763`).

## Live deployment

**https://opencaribe.vercel.app** — Vercel production, auto-deploys from `main`. Runs in demo mode until `DATABASE_URL` is set. CLI authenticated as `ishowlinux`; project id `prj_sg1i72F8qGlCMhifSI6o2YJrLjNp`.

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
| Auth + RBAC | Config done, flows partial | Better Auth factory, RBAC matrix, API catch-all route; tests cover permission matrix; Google/X SSO config-driven and hidden until credentials set |
| Listing state machine | Done | `modules/listings/src/state.ts`; tests cover transitions, ownership, expiry |
| Geography | Done | `modules/geography/src/index.ts`; seed CLI and tests pass |
| Search | Done (in-memory) | `modules/search/src/index.ts`; tests cover filters, pagination, currency-safe ordering |
| Gno wallet connect (P1) | Done (read-only) | Adena client island; address/balance/network on `/payments`; chain-mismatch warning; settlement still disabled |
| i18n | Done | en/es catalogues, cookie switcher; key-parity test passes |
| Web UI | Done (Phase 0 scope) | 17 routes; production build and HTTP checks pass |
| Media pipeline | Not started | No upload processing yet |
| Messaging | Schema + placeholder UI | No conversation logic |
| Moderation | Policy config + placeholder admin | No queue implementation |
| Reports | Validated action only | No persistence |
| PostgreSQL runtime | Not exercised | No database available during Phase 0 verification |

## Verification actually executed (2026-11-25)

- `pnpm test` — **8 files, 40 tests passed** (includes the new payments module).
- `pnpm typecheck` — passed across all workspaces.
- `pnpm lint` — passed with zero warnings or errors.
- `pnpm build` — production build succeeded; 17 routes emitted.
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
- Adena crypto payments are a **placeholder only** for settlement: country config has `enabled: false` / `comingSoon: true`. Wallet connection (P1) is live on the Onyx testnet and is read-only — no wallet API beyond account reads, no signing, no transactions. See ADR 0007.

## Next milestone

Phase 1 — database-backed auth and listing persistence, then the secure media pipeline. See [BACKLOG.md](BACKLOG.md).
