# Application & Architectural Patterns

Patterns for persistence, service structure, and distributed reliability. These
carry more weight than GoF patterns — several are one-way doors. Apply on evidence.

Format: **Intent · When · When NOT · Tradeoffs · Misuse.**

## Repository
- **Intent:** Abstract data access behind a collection-like interface; isolate domain
  from persistence.
- **When:** You want to test domain logic without a DB, or keep query logic in one
  place, or the ORM is leaking into the domain.
- **When NOT:** A thin CRUD app where the ORM/query builder *is* already a good
  abstraction — a repository over it is a redundant wrapper.
- **Misuse:** Repositories that just forward to the ORM one-to-one; generic
  `Repository<T>` with 30 methods most callers don't need (ISP violation).

## Unit of Work
- **Intent:** Track changes and commit them as one transaction.
- **When:** Multiple writes must be atomic across repositories.
- **When NOT:** Single-write operations; framework transactions already cover it.
- **Misuse:** Hand-rolling one where the ORM/session already provides it.

## Service Layer
- **Intent:** A layer that expresses application operations/use cases, orchestrating
  domain + infrastructure.
- **When:** Non-trivial orchestration reused across entry points (HTTP, jobs, CLI).
- **When NOT:** A pass-through service that only forwards to a repository — collapse it.
- **Misuse:** Anemic services that add a layer without adding behavior.

## Dependency Injection
- **Intent:** Provide a component's dependencies from outside rather than
  constructing them internally.
- **When:** Almost always for testability and decoupling at boundaries. Prefer
  **constructor injection**.
- **When NOT:** Over-configuring a DI container for a tiny app; injecting things that
  never vary and could be plain imports.
- **Misuse:** Service-locator anti-pattern (hiding deps); field injection that hides
  what a class needs.

## Specification
- **Intent:** Encapsulate a business rule/predicate as a composable object.
- **When:** Reusable, combinable query/validation rules that change together.
- **When NOT:** One-off conditions — a plain function/predicate is simpler.

## CQRS (Command Query Responsibility Segregation)
- **Intent:** Separate the write model from the read model.
- **When:** Reads and writes have very different shapes/scale; complex reporting over
  a complex write domain.
- **When NOT:** **Most apps.** It doubles the model and adds sync complexity. Start
  with one model; split only when the strain is real.
- **Misuse:** CQRS-by-default; treating "separate DTOs for read/write" (which is
  fine and normal) as if it required full CQRS infrastructure.

## Event Sourcing
- **Intent:** Persist state as an append-only sequence of events; derive current
  state by replay.
- **When:** Audit/temporal requirements are first-class; you need full history and
  replay (ledgers, some financial/domain-event systems).
- **When NOT:** Most systems. High complexity: versioning events, snapshots,
  projections, eventual consistency. A one-way door.
- **Misuse:** Adopting it for "flexibility"; underestimating schema-evolution pain.

## Saga
- **Intent:** Coordinate a distributed transaction as a sequence of local
  transactions with compensating actions (no distributed 2PC).
- **When:** A business process spans services and must maintain consistency without a
  shared transaction (orchestration or choreography).
- **When NOT:** Everything fits one local DB transaction — use that.
- **Misuse:** Sagas within a single service/DB; ignoring compensation/idempotency.

## Outbox
- **Intent:** Atomically persist state change + an event in the same DB transaction;
  a relay publishes the event afterward — guarantees "publish iff committed."
- **When:** You must reliably publish events after DB writes (dual-write problem).
- **When NOT:** No cross-system event needed.
- **Misuse:** Publishing to a broker inside the business transaction (the very
  dual-write bug outbox exists to fix).

## Circuit Breaker
- **Intent:** Stop calling a failing dependency for a cooldown to let it recover and
  fail fast.
- **When:** Remote dependency with real failure modes; prevent cascading failure and
  thread exhaustion.
- **When NOT:** In-process calls; dependencies that don't fail independently.
- **Misuse:** Breakers with untuned thresholds that flap; no fallback defined.

## Retry
- **Intent:** Re-attempt a transient failure.
- **When:** Idempotent operations with transient faults (network blips, throttling).
- **When NOT:** Non-idempotent operations without dedup; deterministic failures
  (retrying won't help).
- **Rules:** Exponential backoff + jitter; a cap; combine with a circuit breaker and
  idempotency keys. Naive tight retries amplify outages.

## Bulkhead
- **Intent:** Isolate resources (thread/connection pools) per dependency so one
  slow dependency can't sink the whole service.
- **When:** Multiple downstreams share a process and you must contain blast radius.
- **When NOT:** Single dependency, trivial load.
