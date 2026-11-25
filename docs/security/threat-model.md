# Threat Model (Phase 0)

## Assets

User accounts and sessions, unpublished drafts, private messages, reported content, approximate location data, and the integrity of public listings.

## Trust boundaries

| Boundary | Control |
| --- | --- |
| Unauthenticated browser → public pages | Read-only access; only `active` listings are returned |
| Browser → server actions | Zod validation with country-derived limits; no role field accepted |
| User → own listings | `assertOwner()` on every protected operation |
| Moderator → listings | Explicit permission checks via RBAC matrix |
| Uploaded file → storage | Not implemented in Phase 0; see below |
| Server → database | Lazy connection, parameterised Drizzle queries |

## Threats addressed

- **Privilege escalation.** `isPrivilegeEscalation()` detects client-supplied privileged roles. Roles are only assigned server-side. Mandatory MFA for admin and platform admin.
- **Cross-currency price confusion.** Price sorting groups by currency; no conversion is performed.
- **Location privacy.** Only approximate city/region labels are shown; exact addresses are neither required nor stored on listings.
- **Injection.** Drizzle parameterises queries; Zod rejects malformed input; no raw SQL from user input.
- **CSV/form smuggling into money fields.** `parseMoneyToMinor` accepts only a strict decimal string and rejects excess precision.
- **Key drift across languages.** Key-parity test prevents partially translated UI.

## Open threats (Phase 1/2)

- No media pipeline yet: file-type validation, re-encoding, EXIF/GPS stripping, private originals and orphan cleanup are required before accepting uploads.
- No rate limiting on auth, posting or reporting endpoints.
- No CSRF token layer beyond Next.js server action protections; verify with security testing.
- No audit-log writes yet, although the table exists.
- No session revocation UI or MFA enforcement flow yet.
- No dependency audit automation beyond lockfile pinning; add to CI in Phase 1.

## Out of scope

Physical security of hosting, provider-level DDoS protection and legal compliance sign-off (see `BLOCKERS.md`).
