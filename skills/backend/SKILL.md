---
name: backend
description: Structure backend/server code — request handlers/controllers, services, domain logic, repositories, validation, authn/authz, background jobs, transactions, caching, error handling, and observability. Use when building or organizing server-side features. Prefer existing project conventions; do not add layers for theoretical purity.
---

# Backend Architecture

Organize server code so responsibilities are clear and business logic is testable and
independent of transport/infrastructure. Match the codebase's existing layering — do
not import a new structure into a project that already has one.

## The common layering (use as much as the complexity warrants)
- **Handler / controller** — transport concerns only: parse/validate input, authn,
  call a service, map result/errors to the response. **No business logic here.**
- **Service / use case** — orchestrates the operation: business rules, transactions,
  coordinating repositories and external calls. The heart of the feature.
- **Domain** — entities/value objects and invariants (rich domain) or plain data
  (simple domain). Keep framework/DB out of here where it's worth it.
- **Repository / data access** — persistence, isolated so the service is testable.

For a **simple CRUD endpoint**, controller → (thin service) → repository is enough. Do
**not** create domain/use-case/port/adapter layers for a 3-field resource. Add layers
when logic and reuse justify them, not for symmetry.

## Cross-cutting concerns
- **Validation** — at the boundary, fail fast with field-level errors. Re-check
  authorization at the service layer (don't trust the controller alone).
- **Authn/authz** — authenticate at the edge; authorize per action *and per object*
  (ownership checks — IDOR is a top bug). See `security`.
- **Transactions** — own the transaction boundary at the service/use-case level, around
  the full invariant; keep them short. Don't scatter commits across layers.
- **Error handling** — one consistent strategy: domain/expected errors → typed
  results/exceptions mapped to proper status codes; unexpected → 500 + log with trace
  id. Never swallow errors silently. Return a consistent error contract (see `api-design`).
- **Idempotency** — for create/pay/side-effecting endpoints, support idempotency keys so
  client/network retries don't double-apply.
- **Background jobs / async** — offload slow or retriable work to a queue/worker
  (emails, exports, third-party calls). Jobs must be **idempotent and retriable**;
  record state; handle poison messages (DLQ). Don't do slow work inline in a request.
- **Caching** — only against a measured read hotspot; own the invalidation story (see
  system-design/caching).
- **Observability** — structured logs with a trace id, RED metrics per endpoint,
  spans around outbound calls. Build it with the feature. Never log secrets/PII.
- **Configuration & secrets** — from env/secret manager, never hard-coded or in VCS.
  Fail fast on missing required config at startup.

## External calls & resilience
Every outbound call needs a **timeout**; retries only for idempotent+transient
failures (backoff+jitter); a **circuit breaker** + fallback for critical dependencies.
Isolate pools (bulkhead) so one slow downstream can't sink the service. See
`system-design/reliability`.

## Decision rules
- Follow existing conventions (error handling, validation, structure) over these defaults.
- Keep business logic out of controllers and out of the ORM entities-as-god-objects.
- Push a layer's concern down/up to where it belongs; collapse pass-through layers.
- Prefer synchronous simplicity; go async when latency/decoupling/reliability requires.

## Anti-patterns
- Fat controllers with business logic and direct DB access.
- Anemic pass-through services that only forward to a repository (collapse them) — *or*
  the opposite, over-layered CRUD.
- Swallowed exceptions; inconsistent error responses; leaking stack traces to clients.
- Slow third-party calls inline in the request path with no timeout.
- Secrets in code/YAML; config read ad-hoc deep in the stack.
- Non-idempotent side effects on retriable endpoints/jobs.
