# Blockers and Open Questions

## B-001 — Directive truncated (OPEN)

The supplied project directive ends mid-sentence at section 15: "Use pagination with bounded query". Sections 16 onward are unavailable. Phase 0 implements sections 1–14 and the visible part of 15. **Action:** obtain the remainder of the directive before starting Phase 1 security and API design, in case further mandatory requirements exist.

## B-002 — Venezuela currency policy (OPEN, non-blocking for Phase 0)

VES and VED are represented explicitly and never converted implicitly. The production default for Venezuela is set to VES, but current local usage and any regulatory requirements must be confirmed with regional expertise before launch. **Action:** research and record in a new ADR before enabling paid features.

## B-003 — No PostgreSQL runtime in Phase 0 (OPEN, non-blocking)

Verification ran without a database. Schema, queries and RBAC code typecheck, but migrations and runtime queries have not been executed against PostGIS. **Action:** run `docker compose up -d db && pnpm db:push && pnpm db:seed` in Phase 1.

## B-004 — Playwright browser download (RESOLVED)

Chromium download exceeded a single 600s foreground window; the install was restarted in the background and completed. All three smoke tests pass.

## B-005 — Legal documents require local review (OPEN)

Privacy policy, terms, guidelines and safety pages are starter templates, explicitly labelled in the UI. **Action:** local counsel review for TT and VE before production launch.

## B-006 — shadcn/ui primitives (OPEN, low priority)

The UI package currently provides shadcn-style components built on CVA/clsx/tailwind-merge rather than generated shadcn/ui files, avoiding a codegen dependency. **Action:** decide whether to adopt the shadcn CLI when the component set grows.
