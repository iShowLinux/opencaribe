# Security Policy

## Supported versions

Only the latest tagged release and the `main` branch receive security fixes.

## Reporting a vulnerability

Do **not** open a public issue. Email the maintainers with:

- a description of the issue and its impact,
- steps to reproduce,
- the affected version or commit,
- any suggested mitigation.

You should receive an acknowledgement within seven days. Please allow time for a fix before public disclosure.

## Scope

In scope: the Next.js application, workspace packages, authentication and authorisation logic, database schema, deployment configuration and translations when they affect safety messages.

Out of scope: third-party services, reporter's own local machine, and issues already fixed on `main`.

## Security design commitments

- Passwords are handled only by Better Auth; no custom cryptography.
- Administrative roles cannot be granted through registration or client input.
- Privileged accounts require MFA.
- Uploaded images are re-encoded with metadata stripped (planned; see roadmap).
- Exact residential addresses are never required or published.
- Monetary values use integer minor units to avoid rounding errors.
