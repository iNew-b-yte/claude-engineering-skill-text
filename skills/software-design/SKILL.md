---
name: software-design
description: Select and apply design patterns (GoF creational/structural/behavioral plus application patterns like Repository, CQRS, Saga, Outbox, Circuit Breaker), and decide when clean architecture or domain-driven design is warranted. Emphasizes choosing the pattern that fits a real, present problem — and rejecting patterns that add indirection without benefit. Use when structuring code around varying behavior, integration seams, or non-trivial domains.
---

# Software Design

Patterns are named solutions to recurring problems. They are a vocabulary, not a
checklist. **Identify the problem first; then, and only then, ask whether a known
pattern improves the simplest solution.**

## The gate (always run this first)

Before applying any pattern, pass `engineering-architect/references/pattern-selection.md`:
does the problem repeat/vary, is the complexity significant, does the abstraction
reduce future change cost, and does the benefit beat the indirection cost? If not:

> "No design pattern is necessary here."

That conclusion is a valid, expected outcome.

## What each pattern group is for

- **Creational** (`references/creational.md`) — control *how objects are made* when
  construction is complex, conditional, or should be decoupled from use. Factory,
  Abstract Factory, Builder, Prototype, Singleton.
- **Structural** (`references/structural.md`) — compose objects into larger
  structures / adapt interfaces. Adapter, Bridge, Composite, Decorator, Facade,
  Flyweight, Proxy.
- **Behavioral** (`references/behavioral.md`) — assign responsibility and manage
  algorithms/communication. Chain of Responsibility, Command, Iterator, Mediator,
  Memento, Observer, State, Strategy, Template Method, Visitor.
- **Application/architectural** (`references/application-patterns.md`) — Repository,
  Unit of Work, Service Layer, DI, Specification, CQRS, Event Sourcing, Saga,
  Outbox, Circuit Breaker, Retry, Bulkhead.

Each pattern entry documents: intent · problem · when to use · when NOT to · tradeoffs
· complexity · maintenance cost · example · alternatives · common misuse.

## Higher-level structure

- **Clean / hexagonal architecture** (`references/clean-architecture.md`) — the
  dependency rule and ports/adapters. Use when the domain is complex and long-lived
  enough to justify the boundaries. **Not** for a small CRUD service.
- **Domain-driven design** (`references/domain-driven-design.md`) — bounded
  contexts, aggregates, value objects, domain events. Use when domain complexity is
  the dominant challenge; skip the tactical ceremony for simple domains.

## Decision rules

- Choose the pattern that names *your* problem, not the one you find elegant.
- The simplest thing (a function, a plain module, a conditional with 2 branches)
  usually wins. Introduce a pattern when the simple thing is demonstrably straining.
- Match the codebase's existing patterns before importing new ones.
- Don't layer clean-arch/DDD onto a problem that doesn't have the complexity.

## Anti-patterns

- Singleton as a global-variable smuggler.
- Factory that wraps a plain constructor.
- Strategy/State with one strategy/state.
- Facade over an already-simple API.
- Full CQRS + Event Sourcing on a CRUD app.
- Repository over an ORM that is already a repository/abstraction.
- Clean-architecture folder explosion for a 3-endpoint service.

## References
`references/creational.md` · `references/structural.md` · `references/behavioral.md`
· `references/application-patterns.md` · `references/clean-architecture.md` ·
`references/domain-driven-design.md`
