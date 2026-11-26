# Changelog

All notable changes to this project are documented here. This project adheres to semantic versioning where applicable.

## [Unreleased] — Phase 0 foundation

### Added

- pnpm monorepo scaffold with pinned versions and committed lockfile.
- Country configuration for Trinidad and Tobago and Venezuela, with 31 translatable categories and region/city seed data.
- Verified Unsplash imagery on demo listings, category cards and the homepage; 24 placeholder posts across both markets.
- Clearly labelled "coming soon" crypto payment option for Adena wallet users: disabled connect button, payment-method placeholder, and a `/payments` explainer. No wallet connection or payment is performed.
- Phase 1 wallet connect: real Adena connection on the Onyx testnet (address, balance, network, chain-mismatch warning), still read-only. Added the `@opencaribe/payments` module and GnoConnect metadata. See ADR 0007.
- Integer-minor-unit money handling with explicit VES/VED support.
- Drizzle PostgreSQL schema covering users, auth, listings, media, search metadata, messaging, reports and audit log.
- Better Auth factory and server-side RBAC with mandatory MFA for privileged roles.
- Listing state machine with explicit transitions and ownership checks.
- Next.js App Router UI: homepage, country pages, category pages, search, listing detail, three-step listing wizard, account/messages/favorites, login/registration/recovery, admin area, six legal/safety documents.
- English and Spanish message catalogues with key-parity test.
- Light and dark themes, reduced-motion support and mobile-first styling.
- Vitest unit/security suite, Playwright smoke suite, ESLint and strict TypeScript checks. All passed.
- Docker Compose with PostGIS, Caddy configuration and GitHub Actions CI.

### Known limitations

See [`.project/BLOCKERS.md`](.project/BLOCKERS.md). Notably: the source directive was truncated at section 15; the source file is not available past "Use pagination with bounded query".
