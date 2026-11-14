---
name: code-review
description: Critically review a diff for defects and risk — correctness, security, data integrity, concurrency, error handling, API compatibility, performance, architecture, maintainability, tests, and observability, in that priority order. Use when reviewing changes (a diff/PR/working tree). Find what can break; do not merely summarize the code.
---

# Code Review

The job of a review is to **find what can break** and to protect the codebase's
long-term health — not to summarize what the code does or to nitpick style a linter
should catch. Assume the code is wrong until you've checked the ways it could be.

## Review in priority order (stop spending effort as severity drops)

1. **Correctness** — Does it do what it's supposed to, including edge cases (empty,
   null, boundary, large, concurrent, failure)? Off-by-ones, wrong conditions,
   incorrect assumptions about inputs/APIs. The core question.
2. **Security** — Untrusted input validated? Injection (SQL/command/XSS)? Authz and
   **object-level ownership** (IDOR)? Secrets/PII in code or logs? (See `security`.)
3. **Data integrity** — Transactions around multi-step invariants? Migrations safe and
   reversible? Money/units correct? Any path that can corrupt or lose data? Append-only/
   audit constraints respected?
4. **Concurrency** — Races, shared mutable state, deadlocks, non-idempotent operations
   on retriable paths, missing locks/atomicity.
5. **Error handling** — Failures handled or swallowed? Correct status/errors returned?
   Resources released? Partial-failure states? Does it fail safe?
6. **API / contract compatibility** — Breaking changes to a public API/schema/event
   without versioning? Backward compatibility during rollout? (See `api-design`.)
7. **Performance** — N+1 queries, missing indexes, unbounded results, obvious hot-path
   waste. Only flag real, likely issues — not speculative micro-optimizations.
8. **Architecture** — Fits existing patterns and boundaries? Logic in the right layer?
   Coupling/cohesion sound? Unnecessary abstraction/pattern added? Or duplication that
   should be shared?
9. **Maintainability** — Clear names, reasonable complexity, no dead code, intent
   obvious. Would the next engineer understand it?
10. **Tests** — Do tests exist for new behavior and its edges/failure paths? Do they
    test behavior not implementation? Do they actually run/pass?
11. **Observability** — Adequate logging (no secrets/PII), metrics/traces for new
    critical paths, useful errors.

## How to review well
- **Understand the intent first** — what problem is this solving? Review against that,
  and against whether it actually achieves it.
- **Check the change against the existing codebase** — conventions, analogous code, and
  anything the change might break elsewhere (search for consumers of what changed).
- **Trace the risky paths** — error handling, boundaries, concurrency, data mutations —
  don't just read the happy path.
- **Verify claims** — if the PR says "tests pass" or "no behavior change," check.
- **Separate severity:** must-fix (correctness/security/data) vs should-fix (design/
  maintainability) vs nit (style/preference — mark as optional). Don't drown real issues
  in nits.
- **Be specific and actionable** — cite file:line, explain the failure scenario, suggest
  a fix. "This breaks when the list is empty (line 42): X returns null and line 45
  dereferences it."

## Judgment
- Match rigor to risk: a payment/auth/migration change gets deep scrutiny; a copy tweak
  doesn't.
- Don't demand abstraction/patterns the code doesn't need (that's the opposite failure).
  Also flag *over*-engineering, not just under-engineering.
- A review that only says "LGTM" or only restates the diff has done no work.

## Anti-patterns (in the review itself)
- Summarizing the code instead of finding risks.
- Only style/nit comments while missing a correctness/security bug.
- Rubber-stamping; not checking edge cases or the failure paths.
- Vague comments ("this seems off") with no scenario or location.
- Requiring the reviewer's personal style over working, conventional code.
