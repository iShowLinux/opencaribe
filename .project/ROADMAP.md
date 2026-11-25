# Roadmap

## Phase 0 — Foundation (current)

Goal: a functioning, verified modular monolith with the core domain model, bilingual UI and reproducible tooling.

- [x] Workspace scaffold and pinned dependencies
- [x] Country/category/currency configuration
- [x] Drizzle schema and seed model
- [x] Auth factory and RBAC matrix
- [x] Listing lifecycle rules
- [x] Browsing, search, listing detail and posting wizard
- [x] Tests, lint, typecheck, build, CI

## Phase 1 — Data and identity

- [ ] Connect listing creation, editing and lifecycle to PostgreSQL
- [ ] Complete Better Auth email verification, recovery, sessions and MFA
- [ ] Implement account export and deletion
- [ ] Favorites and private messaging backed by the database
- [ ] Moderation queue and report persistence

## Phase 2 — Media and discovery

- [ ] Secure image upload pipeline (Sharp, WebP, EXIF/GPS removal, thumbnails, private originals)
- [ ] PostgreSQL full-text search in English and Spanish
- [ ] PostGIS proximity search with consent-based approximate coordinates
- [ ] Category-specific attribute filtering
- [ ] Evaluate Meilisearch only if full-text search proves insufficient

## Phase 3 — Operations and scale

- [ ] Prometheus/Grafana and OpenTelemetry where justified
- [ ] Valkey for caching/jobs only if a measured need appears
- [ ] Backup and restore automation
- [ ] Performance budget tests on low-bandwidth profiles

## Phase 4 — Community and expansion

- [ ] Additional countries through configuration only
- [ ] Contributor tooling and translation workflow
- [ ] Public documentation site
