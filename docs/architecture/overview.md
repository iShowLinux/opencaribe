# Architecture Overview

## Shape

OpenCaribe is a modular monolith: one deployable Next.js application plus TypeScript workspace packages and domain modules.

```text
Browser
   │
   ▼
apps/web (Next.js App Router, RSC + client islands)
   │  imports
   ├── packages/configuration   countries, categories, currencies
   ├── packages/validation      Zod schemas
   ├── packages/localization    en/es catalogues
   ├── packages/ui              shared components
   ├── packages/authentication  Better Auth factory, RBAC
   ├── packages/database        Drizzle schema, lazy postgres client
   ├── modules/listings         state machine, ownership
   ├── modules/geography        location tree, seed
   └── modules/search           filters, bounded pagination
              │
              ▼
        PostgreSQL + PostGIS
```

## Request flow

1. `getRequestConfig` resolves the locale from next-intl's request value or the `NEXT_LOCALE` cookie.
2. A route validates the country segment with `toCountryCode()` and renders with the matching `CountryConfig`.
3. Data access goes through `lib/listings-store.ts`, which reads PostgreSQL when configured and otherwise serves deterministic demo data.
4. Search is a pure module function over `PublicListing` records; SQL-backed search is Phase 2.

## Boundaries

- Configuration is the only place country-specific values live.
- Validation owns all input contracts; UI and server actions call the same schemas.
- Authorization is server-side only. Roles never come from client input.
- Modules expose explicit functions; no cross-module database access.

## Non-goals for Phase 0

No external search engine, cache, object storage, job queue or microservice. See [ADR 0005](../decisions/0005-deferred-infrastructure.md).
