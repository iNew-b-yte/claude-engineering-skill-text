---
name: security
description: Reason about security for a change — authentication, authorization, input validation, injection (SQL/command/XSS), CSRF, SSRF, IDOR, path traversal, file uploads, secrets handling, sensitive-data exposure, rate limiting, and dependency/supply-chain risk. Use for any change touching auth, user input, external requests, file handling, secrets, or sensitive data. Assist only with authorized/defensive security work.
---

# Security

Security is about protecting assets from attacker-controlled inputs crossing trust
boundaries. Treat all external input as hostile until validated. Think in terms of
*what an attacker could do*, not just what a normal user does.

## Threat-model any security-sensitive change

```
Assets (what's worth protecting) → Trust boundaries (where untrusted meets trusted) →
Attacker-controlled inputs → Threats (what could go wrong) → Mitigations → Tests
```

Do this for changes touching auth, user input, external calls, file handling, secrets,
payments, or PII.

## Authentication & session
- Never roll your own crypto/auth — use vetted libraries/providers.
- Passwords: hash with a slow, salted KDF (bcrypt/scrypt/Argon2), never plaintext/MD5/SHA1.
- Tokens/sessions: short-lived, rotated, revocable; secure cookies (`HttpOnly`,
  `Secure`, `SameSite`) or properly-scoped bearer tokens; validate signature, issuer,
  audience, expiry on every request.
- MFA for sensitive access; lockout/backoff on repeated failures.

## Authorization (the most commonly botched)
- Enforce authz **server-side on every request** — never trust the client/UI.
- Check **object-level ownership**, not just "is logged in" — **IDOR** (accessing
  `/orders/123` you don't own) is one of the most common real vulnerabilities. Verify
  the resource belongs to the caller.
- Enforce least privilege; deny by default; check function-level access (don't rely on
  a hidden button).

## Input handling & injection
- **Validate/allowlist input** at the boundary (type, length, format, range). Reject,
  don't sanitize-and-hope.
- **SQL injection** — always use parameterized queries / prepared statements; never
  string-concatenate user input into SQL. Same for NoSQL/ORM raw fragments.
- **Command injection** — never pass user input to a shell; use argument arrays / avoid
  shelling out.
- **XSS** — context-aware output encoding; rely on framework auto-escaping; sanitize any
  HTML you must render; set a Content-Security-Policy. Never `innerHTML` untrusted data.
- **Path traversal** — never build file paths from raw input; canonicalize and confine
  to a base directory; allowlist filenames.
- **SSRF** — validate/allowlist outbound URLs; block internal/metadata IPs
  (169.254.169.254, RFC1918, localhost); this matters wherever the server fetches a
  user-supplied URL.
- **Deserialization** — never deserialize untrusted data into arbitrary types.

## CSRF
State-changing requests need anti-CSRF protection (SameSite cookies + CSRF tokens, or
a non-cookie auth scheme). Not needed for pure token-in-header APIs, but confirm the
cookie situation.

## Secrets & sensitive data
- Secrets from env/secret manager/vault — **never in code, YAML, or VCS**. Rotate them.
- Encrypt sensitive data at rest and in transit (TLS everywhere). Minimize what you
  store; classify PII.
- **Never log secrets, tokens, or PII** — mask them. Logs and error messages leak.
- Don't expose stack traces, internal IDs, or verbose errors to clients.

## Files, rate limiting, abuse
- File uploads: validate type/size, store outside webroot, generate names, scan, never
  execute. Beware content-type spoofing.
- Rate-limit auth and expensive/abusable endpoints; add CAPTCHA/backoff where relevant.

## Dependencies / supply chain
- Keep dependencies updated; scan for known CVEs (audit tooling). Pin/lock versions.
- Vet new dependencies (maintenance, popularity, permissions). Minimize footprint.

## Decision rules
- Default deny; validate at boundaries; least privilege; defense in depth.
- If a change adds an attacker-controlled input path, threat-model it before shipping.
- Prefer framework-provided protections; the moment you're hand-rolling security, stop
  and reconsider.

## Scope note
Assist with authorized, defensive, and educational security work (secure coding,
finding/fixing vulns, pentest/CTF with authorization). Decline to build malware,
attacks on systems you don't own, or evasion for malicious use.

## Anti-patterns
- Client-side-only authz/validation; trusting the UI or hidden fields.
- String-built SQL/shell/paths from user input.
- Secrets in repo/config; PII/tokens in logs; verbose errors to clients.
- Missing ownership checks (IDOR); enumerable sequential IDs without authz.
- Ignoring dependency CVEs; disabling TLS/cert validation for convenience.
