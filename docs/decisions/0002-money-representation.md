# ADR 0002 — Integer minor units for money

- Status: Accepted
- Date: 2026-11-25

## Context

Listings span TTD, USD, VES and VED. Currency conversion is out of scope. Floating-point arithmetic would introduce rounding errors, and historical VED amounts must not be silently reinterpreted as VES.

## Decision

- Store all amounts as integer minor units (`bigint` in PostgreSQL, exposed as a safe `number`).
- Parse user input from decimal strings with string arithmetic in `parseMoneyToMinor`.
- Keep VES and VED as separate currency definitions with explicit notes.
- Never sort or compare prices across different currencies; grouping by currency is enforced in search.

## Consequences

- Exact, reproducible monetary values.
- No implicit conversion path exists, so historical amounts remain intact.
- Formatting depends on `Intl.NumberFormat` only at the presentation boundary.
