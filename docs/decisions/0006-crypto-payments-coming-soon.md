# ADR 0006 — Adena crypto payments are a coming-soon placeholder

- Status: Accepted
- Date: 2026-11-25

## Context

Users who connect an Adena wallet should eventually be able to pay with crypto. Payment infrastructure, custody, chain selection, dispute handling and regulatory review are not ready. Shipping a half-built wallet flow would risk real funds and mislead users.

## Decision

- Add a country-level `cryptoPayments` configuration with `enabled: false`, `comingSoon: true` and `wallets: ['adena']` for both TT and VE.
- Expose the feature only as UI: a disabled "Connect Adena wallet" button, a disabled payment-method option in the posting wizard, and a `/payments` explainer page.
- Never read wallet state, request signatures, or initiate a transaction in this phase.
- Label the feature "coming soon" in both languages in every location where it appears.

## Consequences

- The option is discoverable and clearly non-functional, which supports the product roadmap without pretending capability exists.
- A future implementation only has to flip configuration and replace the placeholder component; strings and placement already exist.
- Tests assert `enabled === false` and `comingSoon === true` so the placeholder cannot silently become live.
