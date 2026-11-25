# Deployment

## Local development

```bash
pnpm install
docker compose up -d db
cp .env.example .env
pnpm db:push
pnpm db:seed
pnpm dev
```

The app runs without Docker too; without `DATABASE_URL` it serves demo listings.

## Production containers

```bash
docker compose --profile edge up -d --build
```

Services:

| Service | Role |
| --- | --- |
| `db` | PostgreSQL 16 with PostGIS |
| `app` | Next.js production server on port 3000 |
| `edge` | Caddy reverse proxy, only with the `edge` profile |

Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` in the environment before starting the stack. The default Compose values are for development only.

## Caddy

`infrastructure/caddy/Caddyfile` sets HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and removes `X-Powered-By`. Replace `{$DOMAIN}` with the real hostname.

## CI

`.github/workflows/ci.yml` runs install, typecheck, unit/security tests, lint, build and Playwright on pushes and pull requests to `main`. The build step provides a non-production secret placeholder; no real credentials are stored in CI configuration.

## Backups

Backups are not yet automated (roadmap Phase 3). Until then, use `pg_dump` from the `db` container and store dumps encrypted off-host. Do not commit dumps to the repository.

## Pre-launch checklist

- [ ] Local counsel review of privacy, terms, guidelines and safety pages for TT and VE.
- [ ] Confirm Venezuela currency policy (ADR pending; see blocker B-002).
- [ ] Enable rate limiting and dependency auditing.
- [ ] Complete the media pipeline before accepting image uploads.
- [ ] Replace development secrets and restrict database network access.
