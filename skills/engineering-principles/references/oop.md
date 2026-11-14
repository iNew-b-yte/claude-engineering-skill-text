# OOP — concepts and when to use them (and not)

OOP is a tool for organizing behavior and state around domain concepts. It is not
mandatory just because the language supports classes. Functional, procedural, and
data-oriented styles are frequently simpler and clearer.

## Core concepts

- **Encapsulation** — bundle data with the operations that maintain its invariants;
  hide the internals. The real value: *protecting invariants*, not just hiding
  fields. If a class exposes getters/setters for everything, it isn't encapsulating.
- **Abstraction** — expose intent, hide mechanism. A good interface says *what*,
  not *how*.
- **Inheritance** — reuse + subtype polymorphism via an is-a relationship. The most
  overused OO feature; see `composition.md`.
- **Polymorphism** — one interface, many implementations, dispatched at runtime.
  The mechanism that makes Strategy/State/Template-Method work. Prefer it over
  `switch(type)` when the set of types is open and behavior varies by type.
- **Interfaces** — contracts decoupling callers from implementations. Add at true
  seams, not everywhere.

## Object roles (DDD-flavored, broadly useful)

- **Value object** — defined by its attributes, immutable, no identity (Money,
  DateRange, Email). Default to these; they eliminate whole classes of bugs.
- **Entity** — has identity and a lifecycle; equality by id, not attributes.
- **Service** — stateless operation that doesn't naturally belong to an entity or
  value object (e.g. a cross-aggregate calculation).
- **Immutable object** — no mutation after construction; safe to share, easy to
  reason about, concurrency-friendly. Prefer immutability by default.

## When OOP fits
- Rich domain with invariants worth protecting (money, orders, accounts).
- Runtime-varying behavior best expressed via polymorphism.
- Long-lived entities with lifecycle and identity.

## When to prefer something simpler
- **Data transformation pipelines** → functions + immutable data beat objects.
- **Stateless computation** → a pure function, not a class with one method.
- **Simple DTOs/records** → plain data structures, no behavior, no ceremony.
- **Scripts / glue code** → procedural is clearer.
- **Performance-critical, cache-sensitive loops** → data-oriented layout (arrays of
  values) often beats object graphs.

## Anemic vs rich
An *anemic* model (data classes + separate "service" that manipulates them) is not
automatically wrong — it's fine for CRUD and simple flows. It becomes a problem
when business invariants get scattered across services and duplicated. Push
invariant-enforcing behavior into the object that owns the data **when invariants
are non-trivial**; leave simple data as data.

## Anti-patterns
- Classes named `-Manager`, `-Helper`, `-Util`, `-Processor` holding unrelated
  static methods (low cohesion; usually functions in disguise).
- Getter/setter-only "objects" that are just structs with extra ceremony.
- Deep inheritance to share a few lines of code.
- Modeling a verb as a noun-class when a function would do.
