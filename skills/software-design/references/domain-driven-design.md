# Domain-Driven Design

DDD is about tackling **complexity in the domain** by modeling it explicitly with a
shared language. Its *strategic* half is broadly valuable; its *tactical* patterns
are only worth their ceremony when domain complexity is high.

## Strategic DDD (use whenever the domain is non-trivial)
- **Ubiquitous language** — one shared vocabulary between code and domain experts.
  Names in code match names the business uses. Cheap, high value.
- **Bounded context** — an explicit boundary within which a model and its terms are
  consistent. "Customer" may mean different things in Billing vs Support — model
  them separately rather than forcing one god-model. This is the most important DDD
  idea and it guides service/module boundaries.
- **Context mapping** — how bounded contexts relate (shared kernel, customer/supplier,
  anti-corruption layer). An **anti-corruption layer** protects your model from a
  messy external one — very useful at integration seams.

## Tactical DDD (use when domain invariants are genuinely complex)
- **Value object** — immutable, equality by value, no identity (Money, Address,
  DateRange). Default to these; they remove bugs. Cheap — use freely.
- **Entity** — identity + lifecycle; equality by id.
- **Aggregate** — a cluster of entities/value objects treated as one consistency
  boundary, accessed only through its **aggregate root**. The root enforces
  invariants; external code never reaches inside. Keep aggregates **small** — large
  aggregates cause contention and awkward transactions.
- **Domain service** — domain operation that doesn't belong to a single entity/VO.
- **Domain event** — something meaningful that happened in the domain
  (`OrderPlaced`), used to decouple reactions and integrate contexts.
- **Repository** — one per aggregate root; persists/retrieves whole aggregates.
- **Application service** — thin orchestration; no business rules (those live in the
  domain).

## When to use tactical DDD
- Rich business rules and invariants that are the hard part of the system.
- Domain experts available; language matters.
- Long-lived core system where model clarity pays off for years.

## When NOT to
- CRUD / data-entry apps — aggregates and domain events are overhead.
- Technical/infrastructure code with no "domain."
- Simple domains — a plain service + records is clearer than aggregates.

## Aggregate design rules (if you do use them)
- One transaction = one aggregate (reference other aggregates by id, not object).
- Keep them small; big aggregates → lock contention and bloated loads.
- Enforce invariants at the root; nothing mutates internals directly.
- Cross-aggregate consistency is **eventual**, via domain events — don't fake a
  distributed transaction.

## Common mistakes
- Tactical patterns (aggregates/events) without strategic thinking (bounded
  contexts) — cargo-cult DDD.
- Huge aggregates that try to be consistency boundaries for everything.
- Anemic entities + all logic in services (that's not DDD, it's transaction script
  wearing DDD names — which is *fine* if you call it that and the domain is simple).
