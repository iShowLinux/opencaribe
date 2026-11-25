# OpenCaribe Agent & Engineering Conventions

This file is the authoritative instruction set for human and automated contributors.

## Session start

1. Read `.project/PROJECT_STATE.md`, `.project/BACKLOG.md`, `.project/BLOCKERS.md` and the most recent entry in `.project/SESSION_LOG.md`.
2. Inspect the repository before changing anything. Never restart implementation from scratch.
3. Confirm the current task ID and its acceptance criteria before editing code.

## Engineering rules

- Strict TypeScript everywhere. No `any` in new code.
- Modular monolith first. Do not introduce microservices or optional infrastructure without an accepted decision record.
- Data-driven country behaviour. `packages/configuration` is the single source of truth for TT and VE settings.
- Integer minor units for all money. VES and VED are distinct; no implicit conversion.
- Server-side authorisation on every protected operation; roles are never accepted from client input.
- Privacy by default: approximate locations only; no exact residential addresses.
- English and Spanish ship together; every new message key exists in both catalogues.
- Mobile-first, low-bandwidth pages; no heavy animation libraries.
- Pin dependency versions; commit the pnpm lockfile.

## Task lifecycle

`BACKLOG → READY → IN PROGRESS → TESTING → REVIEW → DONE`, with `BLOCKED` when a dependency prevents progress.

A task is not DONE until the relevant tests, typecheck, lint and build have actually run and the results are recorded. Never invent a passing result.

## Verification commands

```bash
pnpm test        # Vitest unit + security
pnpm typecheck   # tsc across workspaces
pnpm lint        # ESLint
pnpm build       # Next.js production build
pnpm test:e2e    # Playwright smoke
```

## Project memory files

| File | Responsibility |
| --- | --- |
| `ROADMAP.md` | Phases and milestones |
| `BACKLOG.md` | Prioritised, structured tasks |
| `PROJECT_STATE.md` | What actually exists now, with evidence |
| `DECISIONS.md` | Technical decision index |
| `BLOCKERS.md` | Unresolved dependencies and ambiguities |
| `SESSION_LOG.md` | Concise execution history |

Never store secrets, credentials, personal information or hidden reasoning in project memory.
