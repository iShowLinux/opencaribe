# Data Model

Schema source of truth: `packages/database/src/schema.ts`.

## Groups

| Group | Tables |
| --- | --- |
| Identity | `users`, `sessions`, `accounts`, `verifications` |
| Catalogue | `categories`, `geography_regions`, `geography_cities`, `geography_communities` |
| Listings | `listings`, `listing_images`, `favorites` |
| Interaction | `message_threads`, `thread_participants`, `messages`, `reports` |
| Audit | `audit_log` |

## Key constraints

- `listings.amount_minor` is `bigint` exposed as a safe number; currency is a separate text column. No float column exists.
- `listings.status` and `moderation_status` are PostgreSQL enums; transitions are enforced in `modules/listings`.
- Only `active` listings are publicly visible; other statuses require an authenticated owner or moderator.
- `favorites` and `thread_participants` use composite primary keys to prevent duplicates.
- `reports` has a unique index on `(listing_id, reporter_id)`; anonymous reports need application-level deduplication.
- Approximate coordinates are `double precision` on `geography_cities`; precise residential coordinates are never stored on listings.

## Indexes

- `listings(country_code, category_id)` for browse queries.
- `listings(status, created_at)` for recent active listings.
- `listings(seller_id)` for owner dashboards.
- `geography_regions(country_code)` and `geography_cities(region_id)`.

## Migrations

Generate with `pnpm db:generate`, apply with `pnpm db:push`, seed geography with `pnpm db:seed`.
