# Backlog

Task IDs are stable. Lifecycle: `BACKLOG → READY → IN PROGRESS → TESTING → REVIEW → DONE`.

| ID | Objective | Role | Priority | Dependencies | Status |
| --- | --- | --- | --- | --- | --- |
| OC-001 | Scaffold pnpm monorepo with strict TS, pinned deps and CI | DevOps | P0 | — | DONE |
| OC-002 | Country, currency and category configuration for TT/VE | Architecture | P0 | OC-001 | DONE |
| OC-003 | Drizzle schema and lazy PostgreSQL client | Backend | P0 | OC-002 | DONE |
| OC-004 | RBAC matrix and Better Auth factory | Security | P0 | OC-003 | DONE |
| OC-005 | Listing state machine, ownership and expiry rules | Backend | P0 | OC-002 | DONE |
| OC-006 | Bilingual UI, country pages, search, wizard, legal pages | Frontend | P0 | OC-002, OC-005 | DONE |
| OC-007 | Unit/security tests, lint, typecheck, build verification | QA | P0 | OC-001..006 | DONE |
| OC-008 | Persist listing CRUD to PostgreSQL with ownership checks | Backend | P1 | OC-003, OC-005 | READY |
| OC-009 | Complete auth flows: verification, recovery, sessions, MFA | Security | P1 | OC-004 | READY |
| OC-010 | Favorites and messaging persistence | Backend | P1 | OC-008 | BACKLOG |
| OC-011 | Moderation queue and report persistence | Backend | P1 | OC-008 | BACKLOG |
| OC-012 | Secure image processing pipeline | Backend/Security | P1 | OC-008 | BACKLOG |
| OC-013 | PostgreSQL full-text search (en/es) | Backend | P2 | OC-008 | BACKLOG |
| OC-014 | PostGIS proximity search with consent | Backend | P2 | OC-012, OC-013 | BACKLOG |
| OC-015 | Backups, monitoring and load-time budgets | DevOps | P2 | OC-008 | BACKLOG |
| OC-016 | Implement real Adena wallet payments behind an enabled flag (P1 done; P2-P4 pending) | Security/Backend | P2 | OC-004, legal review | IN PROGRESS |
| OC-017 | Replace Unsplash demo images with the licensed media pipeline | Backend | P1 | OC-012 | BACKLOG |

## Task template

```markdown
### OC-xxx — Objective
- Role:
- Priority:
- Dependencies:
- Modules:
- Acceptance criteria:
- Required tests:
- Security considerations:
- Status: BACKLOG | READY | IN PROGRESS | TESTING | REVIEW | DONE | BLOCKED
- Actual test results:
```

Detailed records for completed Phase 0 tasks are in `tasks/`.
