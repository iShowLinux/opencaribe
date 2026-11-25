# ADR 0003 — Country behaviour is data-driven

- Status: Accepted
- Date: 2026-11-25

## Context

Trinidad and Tobago and Venezuela differ in language, currency, telephone prefix, timezone, moderation needs and likely future feature flags. Hardcoding branches would make additional countries expensive.

## Decision

`packages/configuration` holds a `CountryConfig` per market with all country-specific settings, including regions and cities. Business logic accepts a country configuration instead of branching on a country code. Geography seed rows are derived from the same configuration.

## Consequences

- Adding a country means adding configuration and geographic data, not editing business logic.
- Tests can assert country invariants in one place.
- A country code must be normalised from URL segments (`toCountryCode`) before indexing configuration.
