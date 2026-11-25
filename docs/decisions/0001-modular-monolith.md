# ADR 0001 — Modular monolith with pnpm workspaces

- Status: Accepted
- Date: 2026-11-25

## Context

The directive requires a modular architecture with clear boundaries that permits future service extraction, while avoiding premature microservices and unnecessary infrastructure.

## Decision

Use a single Next.js application plus small TypeScript packages in a pnpm workspace. Packages are consumed as source through workspace dependencies and `transpilePackages`. Domain logic lives in `modules/*`; shared primitives in `packages/*`.

## Consequences

- One deployable unit, one database, low operational cost.
- Boundaries are enforced by imports, not network calls.
- Extracting a service later means replacing an import with a client — the module APIs are already explicit.
- No empty packages are created; deferred modules are recorded in the backlog instead.
