# API Surface (Phase 0)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage and country selection |
| `/tt`, `/ve` | Country landing pages |
| `/{country}/c/{category}` | Category browsing |
| `/{country}/search` | Search with filters and pagination |
| `/{country}/l/{id}` | Listing detail and report form |
| `/{country}/post` | Three-step listing wizard |
| `/{country}/favorites`, `/{country}/messages`, `/{country}/account` | User areas |
| `/login`, `/register`, `/forgot-password` | Authentication UI |
| `/admin` | Moderator/administrator area |
| `/info/{slug}` | Legal, safety and project documents |

Country segments are case-insensitive and normalised to `TT` or `VE`; invalid values return 404.

## Server actions (`apps/web/src/app/actions.ts`)

| Action | Input | Result |
| --- | --- | --- |
| `setLocale` | `locale` form field (`en`/`es`) | Sets `NEXT_LOCALE`, revalidates layout |
| `submitListing` | Listing form fields | Validated draft with generated ID, or field errors |
| `reportListing` | `listingId`, `reason`, optional `details` | Validated acceptance (persistence in Phase 1) |

All actions validate with Zod schemas from `@opencaribe/validation`. No role or ownership field is accepted from the client.

## Better Auth endpoints

Handled by `src/app/api/auth/[...all]/route.ts`:

- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-up/email`
- `POST /api/auth/forget-password`
- plus the standard Better Auth session and verification routes.

These endpoints require `DATABASE_URL` and `BETTER_AUTH_SECRET`; without them the UI shows a configuration notice instead of issuing requests.

## Internal contracts

Domain boundaries are TypeScript function contracts rather than HTTP APIs: `@opencaribe/listings` (state transitions), `@opencaribe/search` (filters), `@opencaribe/geography` (location tree), `@opencaribe/authentication` (RBAC).
