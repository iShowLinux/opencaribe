# ADR 0004 — Cookie-based localization without a locale URL prefix

- Status: Accepted
- Date: 2026-11-25

## Context

Both languages must be available in both countries. Country is a URL segment (`/tt`, `/ve`). A locale URL prefix would lengthen paths on low-bandwidth devices and complicate country routing.

## Decision

Use next-intl with a `NEXT_LOCALE` cookie read in `getRequestConfig`. Do not register a locale middleware/proxy. The locale switcher is a server action that sets the cookie and revalidates the layout.

## Consequences

- `/tt` and `/ve` render in either language.
- Locale is not shareable in a URL; that is acceptable for the MVP.
- Removing middleware avoids an internal path rewrite that initially caused all country routes to return 404.
- Every new string must be added to both catalogues; a key-parity test enforces this.
