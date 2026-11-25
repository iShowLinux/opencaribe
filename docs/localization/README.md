# Localization

## Locales

English (`en`) and Spanish (`es`) are supported in both countries. Country defaults are `en` for TT and `es` for VE, but either locale can be selected on either country page.

## Message catalogues

- `packages/localization/messages/en.json`
- `packages/localization/messages/es.json`

Both files must contain identical key sets. `tests/unit/localization.test.ts` flattens both catalogues and fails on drift. Interpolation uses `{name}` placeholders, e.g. `country.subtitle`.

## Adding a string

1. Add the key to `en.json` and `es.json`.
2. Use `useTranslations('namespace')` in client components or `getT()` in server components.
3. Run `pnpm test`.

## Country data

Country names, region names and city names live in `packages/configuration/src/countries.ts` as `LocalizedText` records with both languages. Do not translate country data in the UI layer.

## Formatting

- Dates use `Intl.DateTimeFormat` with `en-TT` or `es-VE`.
- Money uses `Intl.NumberFormat` with the listing's currency and the active locale.
- Monetary values are integer minor units; formatting is the only place they become decimal strings.

## Deferred work

- Translation contributor workflow.
- Locale-specific SEO metadata and hreflang tags.
- RTL support is not planned for the initial locales.
