---
name: engineering-principles
description: Apply SOLID, OOP concepts, coupling/cohesion analysis, abstraction, and composition-vs-inheritance judgment to structure code well — and to decide when NOT to apply them. Use when designing classes/modules, evaluating whether an abstraction is warranted, assessing module boundaries, or reviewing code for structural quality.
---

# Engineering Principles

Principles are diagnostic tools, not rules to satisfy. Each exists to solve a
specific maintenance problem. Apply one only when that problem is present.

## The governing question

Before introducing any interface, base class, or abstraction:

> What change or maintenance problem would this abstraction solve — and is that
> problem real and present, or hypothetical?

If you can't answer concretely, don't add it.

## Quick reference

- **SOLID** is about *managing change* in OO systems, not about maximizing
  abstraction. Over-applied, it produces indirection soup. See `references/solid.md`.
- **OOP** (encapsulation, polymorphism, composition) is one tool among several.
  Functional/procedural/data-oriented styles are often simpler. `references/oop.md`.
- **Coupling & cohesion** are the primary evaluation criteria for any boundary.
  High cohesion within, loose coupling between. `references/coupling-cohesion.md`.
- **Abstraction** has a cost (indirection). Abstract on evidence, not anticipation.
  `references/abstraction.md`.
- **Composition over inheritance** — default to composition; use inheritance only
  for genuine, stable is-a substitutability. `references/composition.md`.

## Decision rules

- Cohesion first: put things that change together in the same place; separate
  things that change for different reasons (this *is* the Single Responsibility
  Principle, stated usefully).
- Depend on abstractions only where the concrete thing genuinely varies or must be
  swapped/tested. A one-implementation interface is usually noise.
- Prefer composition; reach for inheritance only when subtypes are fully
  substitutable for the base (Liskov) and the hierarchy is stable.
- Loose coupling is a means, not an end — don't add indirection that buys no
  independence.

## Anti-patterns

- Mechanically extracting an interface for every class ("DIP theater").
- Splitting a cohesive class into anemic fragments to "honor SRP."
- Deep inheritance hierarchies modeling variation that composition handles better.
- "Utils"/"Manager"/"Helper" god-modules (logical cohesion, low functional cohesion).
- Abstractions with a single caller and no expected second one.

## References

`references/solid.md` · `references/oop.md` · `references/coupling-cohesion.md` ·
`references/abstraction.md` · `references/composition.md`
