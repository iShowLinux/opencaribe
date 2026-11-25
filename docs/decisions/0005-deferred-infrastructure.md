# ADR 0005 — Defer optional infrastructure

- Status: Accepted
- Date: 2026-11-25

## Context

The directive lists Meilisearch, Valkey, S3-compatible storage, OpenTelemetry, Prometheus and Grafana, while also requiring minimal costs and no optional infrastructure without justification.

## Decision

Phase 0 includes only PostgreSQL with the PostGIS extension available. The schema stores approximate coordinates as numeric columns; a `geometry(Point, 4326)` column, Meilisearch, Valkey and object storage are deferred until a measured requirement exists.

## Consequences

- Local development needs only one container.
- Full-text search starts with PostgreSQL, which is sufficient for the initial dataset.
- Deferred items remain tracked in the roadmap rather than being forgotten.
