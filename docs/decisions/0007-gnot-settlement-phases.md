# ADR 0007 — Phased GNOT settlement integration (supersedes ADR 0006)

- Status: Accepted
- Date: 2026-11-25
- Supersedes: [ADR 0006](0006-crypto-payments-coming-soon.md)

## Context

ADR 0006 kept crypto payments as a static placeholder. Wallet connection is now useful on its own: buyers can confirm their Adena account, network and testnet balance before any payment exists.

## Decision

Roll out in explicit phases, each independently shippable and reversible:

1. **P1 — read-only wallet connect (done).** `walletConnect.enabled = true` on the current testnet (Onyx, `onyx-1`). The UI shows address, balance and network, warns on chain mismatch, links to the faucet. Settlement stays `enabled: false`.
2. **P2 — direct transfer on testnet.** Orders persisted in PostgreSQL; server verifies the transaction by hash, chain, destination and exact `ugnot` amount. No escrow.
3. **P3 — escrow realm.** A separate gno.land realm with per-order sub-realms, release/cancel/dispute and moderator resolution, audited before use.
4. **P4 — mainnet.** Conversion quotes, compliance review, high-value categories only.

The UI never implies more capability than the phase allows, and tests pin `enabled`/`comingSoon`.

## Consequences

- P1 ships without custody, keys or transaction code, so it carries minimal risk.
- Later phases reuse the same config keys, strings and component placement.
- Direct transfer is the default settlement model; escrow is opt-in per category.
