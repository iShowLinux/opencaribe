# OpenCaribe

An open-source, country-aware classifieds marketplace for Trinidad and Tobago and Venezuela, built to run well on modest devices and slow connections.

> Status: Phase 0 foundation. Browsing, search, country pages, Spanish/English UI, a validated listing wizard and the core domain model are implemented and verified. Authentication persistence, media processing, messaging and moderation are scaffolded but not yet complete. See [`.project/PROJECT_STATE.md`](.project/PROJECT_STATE.md) for the exact state.

## Quick start

Requires Node 20.11+ and pnpm 12+.

```bash
pnpm install
cp .env.example .env       # optional: enables PostgreSQL and authentication
pnpm dev                   # http://localhost:3000
```

Without a database the app serves deterministic demo listings. With `DATABASE_URL` set it reads active listings from PostgreSQL and falls back to demo data if the query fails.

```bash
pnpm test        # unit + security tests
pnpm typecheck   # strict TypeScript across all workspaces
pnpm lint        # ESLint (Next.js flat config)
pnpm build       # production build
pnpm test:e2e    # Playwright smoke tests (needs browser install)
```

To start PostgreSQL with PostGIS:

```bash
docker compose up -d db
pnpm db:push
pnpm db:seed
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FiShowLinux%2Fopencaribe)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2FiShowLinux%2Fopencaribe)

The repository deploys as-is: the build is `pnpm build` and the start command is `pnpm start`. The app runs in demo mode without a database and serves deterministic sample listings; set these environment variables in the provider dashboard for the full product:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Recommended | PostgreSQL connection string; enables real listings |
| `BETTER_AUTH_SECRET` | For auth | Random secret used by Better Auth |
| `BETTER_AUTH_URL` | For auth | Public URL of the deployment |
| `NEXT_PUBLIC_APP_URL` | For auth | Same public URL, browser-side |
| `GNO_CHAIN_ID` / `GNO_RPC_URL` | Optional | Override the gno.land testnet used by wallet connect |

With a database, run migrations from a shell (`pnpm --filter @opencaribe/database db:push`) or use the provided Dockerfile on Render, Railway or Fly. See [docs/deployment/deployment.md](docs/deployment/deployment.md).

## What is implemented

- **Modular monolith** in a pnpm workspace: `apps/web`, six `packages/*`, four `modules/*`.
- **Country configuration** for TT and VE: locale, currency, telephone prefix, timezone, regions, cities, feature flags and moderation policies — all data-driven.
- **Money** as integer minor units parsed from strings; VES and VED kept distinct; no floating-point arithmetic on amounts.
- **31 translatable categories** with category-specific attribute definitions.
- **Search** with filters, bounded pagination, and price sorting grouped by currency (never cross-currency comparison).
- **Auth foundation**: Better Auth factory, database schema for sessions/accounts, and a server-side RBAC matrix with mandatory MFA for privileged roles.
- **Gno wallet connect (P1)**: Adena connection on the current gno.land testnet, showing address, balance and network with chain-mismatch warnings. Settlement stays off (ADR 0007).
- **Listing lifecycle** state machine with explicit allowed transitions and ownership checks.
- **i18n** in English and Spanish with a cookie-based locale switcher and key-parity test.
- **Mobile-first UI** in navy/teal/sand/coral with light and dark themes, reduced-motion support and semantic markup.
- **Reproducible tooling**: pinned versions, committed lockfile, Docker Compose, Caddy config, GitHub Actions CI.

## Repository layout

| Path | Purpose |
| --- | --- |
| `apps/web` | Next.js App Router application |
| `packages/configuration` | Countries, categories, currencies, feature flags |
| `packages/database` | Drizzle schema and lazy postgres client |
| `packages/authentication` | Better Auth factory and RBAC |
| `packages/validation` | Zod schemas |
| `packages/localization` | English/Spanish message catalogues |
| `packages/ui` | Shared accessible components |
| `modules/listings` | Listing state machine and ownership rules |
| `modules/geography` | Geographic tree, seed data, location search |
| `modules/search` | Pure search and filtering |
| `docs/` | Architecture, decisions, security, deployment, API, localization |
| `.project/` | Roadmap, backlog, state, decisions, blockers, session log |

## Documentation

- [Architecture](docs/architecture/overview.md)
- [Data model](docs/architecture/data-model.md)
- [Security threat model](docs/security/threat-model.md)
- [Deployment](docs/deployment/deployment.md)
- [Contributing](CONTRIBUTING.md) · [Security policy](SECURITY.md) · [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT — see [LICENSE](LICENSE).
