---
name: api-design
description: Design and evolve APIs (REST, RPC, GraphQL) — resource modeling, request/response contracts, validation, authn/authz, pagination, filtering, idempotency, versioning, error handling, rate limiting, and backward compatibility. Use when adding or changing an endpoint, defining a contract between services or with clients, or evolving a public interface.
---

# API Design

An API is a contract with consumers you don't control and can't easily change. Design
for the caller and for evolution. The cost of a bad API is paid at every integration
and every future change.

## Choose the style for the problem
- **REST** — resource-oriented CRUD over HTTP; the default for public/web APIs.
  Cache-friendly, ubiquitous, simple.
- **RPC (gRPC, JSON-RPC)** — action/verb-oriented; great for internal
  service-to-service, low latency, streaming, strong typing (protobuf).
- **GraphQL** — client-specified queries; shines when many clients need different
  shapes of a rich graph and over/under-fetching is a real problem. Costs: caching,
  rate-limiting, and N+1 are harder. Don't adopt for a simple CRUD service.

## REST essentials
- **Model resources (nouns), not actions.** `POST /orders`, `GET /orders/{id}`, not
  `/createOrder`. Use HTTP methods for semantics.
- **HTTP methods & idempotency:** GET/PUT/DELETE idempotent & safe-ish; POST not
  idempotent → support an **idempotency key** for safe retries on create/pay.
- **Status codes with meaning:** 200/201/204; 400 validation, 401 unauthenticated, 403
  unauthorized, 404, 409 conflict, 422 semantic, 429 rate-limited, 5xx server. Be
  consistent.
- **Consistent error body** — a single machine-readable shape (e.g. RFC 7807
  problem+json: `type, title, status, detail, code, traceId`). Include a code clients
  can branch on and a trace id for support.

## Cross-cutting contract concerns
- **Validation** — validate at the boundary; reject early with clear field-level
  errors. Never trust client input (see `security`).
- **Pagination** — cursor-based for large/changing sets (stable, scalable); offset for
  small/simple ones. Always paginate list endpoints — unbounded lists are a latency
  and memory bomb.
- **Filtering/sorting** — explicit allowed fields; never interpolate client input into
  queries. Bound sort fields to indexed columns.
- **Authn/authz** — authenticate at the edge, authorize per resource/action. Check
  object-level ownership (prevent IDOR — see `security`).
- **Rate limiting** — protect against abuse and overload; per-key/tier; return 429 +
  `Retry-After`.
- **Timeouts/retries** — document expected latency; make retriable ops idempotent.

## Versioning & compatibility
- **Additive changes are safe** (new optional fields, new endpoints). Breaking changes
  (removing/renaming fields, changing types/semantics, tightening validation) require a
  new version.
- Version via URL (`/v1/`) or header; be consistent. Support the old version through a
  deprecation window.
- **Never break existing consumers silently** — this is the cardinal rule. Treat a
  live contract as immutable; extend, don't mutate.
- Be liberal in what you accept, conservative in what you send; tolerate unknown
  fields.

## Decision rules
- Follow the existing API's conventions in this codebase over these defaults.
- Design the response around what the consumer needs, not around your table schema.
- Make the common case easy and the contract hard to misuse (sane defaults, explicit
  required fields).

## Anti-patterns
- RPC verbs bolted onto REST URLs (`/getUserData`), inconsistent status codes.
- Unbounded list endpoints (no pagination).
- Leaking DB schema/internal fields directly to clients.
- Breaking changes without a version bump.
- Exposing internal IDs/enumerable sequential IDs enabling IDOR/enumeration.
- Different error shapes per endpoint.
