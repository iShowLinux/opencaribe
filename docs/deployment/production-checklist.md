# Production checklist

The application has two storage modes selected by the presence of `DATABASE_URL`:

- **Configured** — PostgreSQL via Drizzle (`apps/web/src/lib/store.ts` picks `db-store.ts`).
- **Absent** — JSON/memory demo store (`lib/local-store.ts`) for local development and previews.

## 1. Provision PostgreSQL

Done for this project: the Neon marketplace integration was installed through
the authenticated Vercel CLI, which created a free Neon project and connected it
to opencaribe (Production/Preview/Development), injecting `DATABASE_URL`
automatically.

```sh
vercel integration accept-terms neon --yes
vercel integration add neon --name opencaribe-db --json
```

For other projects, any Postgres URL works — just `vercel env add DATABASE_URL production`.

## 2. Apply the schema once

```sh
pnpm install
DATABASE_URL='postgresql://user:pass@host:5432/db' pnpm db:push
# or apply the generated migration:
#   pnpm db:generate
#   docker exec -i <pg> psql -U <user> -d <db> < packages/database/drizzle/<file>.sql
```

Tables are created idempotently from `packages/database/src/schema.ts` (users,
sessions, accounts, listings, message_threads, thread_participants, messages,
payment_orders, reports, audit_log, geography).

## 3. Required Vercel environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (pooled, TLS) |
| `BETTER_AUTH_SECRET` | Random 32+ characters |
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` | `https://opencaribe.vercel.app` |
| `GOOGLE_CLIENT_ID`/`SECRET`, `TWITTER_CLIENT_ID`/`SECRET` | Optional social sign-in |

## 4. Verify on the deployed URL

Run the walkthrough manually or with Playwright:

1. Register an account, confirm redirect home.
2. Post a listing; it must appear in search immediately.
3. From a second browser profile, open the listing and message the seller.
4. The seller inbox shows the thread and replies persist.
5. Connect Adena, post a listing with the wallet attached, then pay it from a
   second wallet; `/payments` lists the transaction.

## Notes

- Wallet and anonymous sellers get synthetic `users` rows so foreign keys hold;
  their ids are `wallet:<address>` / `anonymous-draft`.
- Sessions live in the `sessions` table (30-day httpOnly cookie `oc_session`).
- Password hashes use scrypt with a per-user salt stored in `accounts.password`
  as `salt:hash`.
- No credentials are ever written to the repository or Vercel build output.
