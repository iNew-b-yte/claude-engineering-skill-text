# Creational Patterns

Control object creation when construction is complex, conditional, or should be
decoupled from use. If construction is a simple `new`, you need none of these.

Format: **Intent · When · When NOT · Tradeoffs · Misuse.**

## Factory Method
- **Intent:** Defer which concrete type to instantiate to a method/subclass.
- **When:** Creation is conditional/duplicated across call sites; callers shouldn't
  know concrete types.
- **When NOT:** One type, or a plain constructor call. A factory that just returns
  `new X()` is noise.
- **Tradeoffs:** +decoupling from concretes; −an extra indirection.
- **Misuse:** `XxxFactory.create()` everywhere wrapping trivial constructors.

## Abstract Factory
- **Intent:** Create *families* of related objects without naming concretes (e.g. a
  UI toolkit per platform, a driver set per DB).
- **When:** Multiple products must vary together as a consistent set.
- **When NOT:** Only one product, or the products don't need to stay consistent.
- **Tradeoffs:** +consistency across a family; −many types, real ceremony.
- **Misuse:** Applied to a single product — that's just Factory (or nothing).

## Builder
- **Intent:** Construct a complex object step-by-step; avoid telescoping
  constructors; support optional params and validation-at-build.
- **When:** Many optional fields, invariants to check at build, immutable result.
- **When NOT:** 2–3 fields — use a constructor or named args / a plain record.
- **Tradeoffs:** +readable construction, immutability; −more code than a constructor.
- **Misuse:** Builders for trivial value objects; builders that allow invalid
  partial states to escape.

## Prototype
- **Intent:** Create new objects by cloning an existing configured instance.
- **When:** Object creation is expensive and a preconfigured template exists; or you
  need runtime-defined types.
- **When NOT:** Construction is cheap. Beware shallow-vs-deep-copy bugs.
- **Tradeoffs:** +cheap creation from a template; −clone semantics are error-prone.
- **Misuse:** Cloning where a fresh construct is clearer and safe.

## Singleton
- **Intent:** Exactly one instance, globally reachable.
- **When:** Genuinely one shared resource (a connection pool, a registry) AND you
  control lifecycle. In DI-based apps, **prefer a container-managed single instance**
  over the classic static Singleton.
- **When NOT:** Almost always. It's global mutable state in disguise: hidden
  dependencies, test-hostile, concurrency hazards.
- **Tradeoffs:** +one instance; −global coupling, untestable, init-order and
  thread-safety pitfalls.
- **Misuse:** Using Singleton to smuggle global state; static singletons that make
  unit tests share state. Prefer passing the dependency in (DI).
