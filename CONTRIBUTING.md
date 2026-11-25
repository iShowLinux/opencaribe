# Contributing to OpenCaribe

Thanks for helping build marketplace infrastructure that communities can own.

## Before you start

Read [AGENTS.md](AGENTS.md), the [roadmap](.project/ROADMAP.md), the [current state](.project/PROJECT_STATE.md) and the [open blockers](.project/BLOCKERS.md). Pick a task from the backlog or open an issue first so work is not duplicated.

## Development workflow

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

All five checks must pass before a pull request is reviewed. Tests that need PostgreSQL should be skipped cleanly when `DATABASE_URL` is absent — never fail the suite because a developer did not start Docker.

## Conventions

- TypeScript strict mode; no `any` in new code.
- Relative imports inside a package use extensionless specifiers so both Turbopack and Vitest resolve them.
- Add a workspace dependency rather than duplicating a helper between packages.
- Country-specific behaviour belongs in `packages/configuration`, never scattered through UI code.
- Monetary values are integer minor units. Never use floating-point arithmetic for money.
- All user-facing strings go into both `messages/en.json` and `messages/es.json`.
- New routes must work without JavaScript for browsing; interactive enhancements are progressive.
- Do not add optional infrastructure (Meilisearch, Valkey, object storage) without an accepted decision record.

## Commits

Use conventional prefixes: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`, `security:`. Include the task ID when one exists, e.g. `feat(OC-004): add listing state machine`.

## Reporting security issues

Follow [SECURITY.md](SECURITY.md). Do not open a public issue for a vulnerability.
