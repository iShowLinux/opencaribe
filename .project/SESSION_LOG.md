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
