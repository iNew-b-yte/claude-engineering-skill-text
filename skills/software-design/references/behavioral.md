# Behavioral Patterns

Assign responsibility and manage algorithms/communication between objects. The most
frequently useful group in application code — and the most frequently over-applied.

Format: **Intent · When · When NOT · Tradeoffs · Misuse.**

## Strategy
- **Intent:** Encapsulate interchangeable algorithms behind a common interface;
  select at runtime.
- **When:** 2+ real algorithms varying independently and expected to grow (pricing
  rules, sort orders, compression). Replaces a growing `switch`.
- **When NOT:** One algorithm, or two stable branches — an `if` is clearer.
- **Tradeoffs:** +open/closed, testable in isolation; −more types.
- **Misuse:** Strategy with one strategy; strategies that share so much they should
  be one parameterized function.

## State
- **Intent:** Change an object's behavior when its internal state changes; each state
  is an object; transitions are explicit.
- **When:** Sprawling `switch(state)` logic across many methods; a real state machine.
- **When NOT:** 2–3 states with trivial behavior — an enum + switch is fine.
- **Tradeoffs:** +explicit transitions, no giant conditionals; −many classes.
- **Misuse:** State objects for a flag with two values.

## Template Method
- **Intent:** Define an algorithm's skeleton in a base method, defer specific steps
  to subclasses.
- **When:** A fixed multi-step process with a few varying steps.
- **When NOT:** Prefer **Strategy (composition)** for the varying steps — Template
  Method uses inheritance and its attendant coupling. Use only when inheritance is
  already the right model.
- **Misuse:** Deep hierarchies of hook methods; using it where composition is cleaner.

## Observer / Publish-Subscribe
- **Intent:** Notify multiple dependents when a subject changes, decoupling source
  from reactions.
- **When:** Several independent reactions to an event; source shouldn't know
  listeners (UI events, domain events).
- **When NOT:** A single known reaction — just call it directly. Beware invisible
  control flow and ordering/reentrancy bugs at scale.
- **Tradeoffs:** +decoupling, extensibility; −hard-to-trace flow, lifecycle leaks.
- **Misuse:** Event bus for what could be a direct call in one process.

## Command
- **Intent:** Encapsulate a request as an object (params + action) → queue, log,
  undo, retry.
- **When:** You need undo/redo, queuing, scheduling, or audit of operations.
- **When NOT:** A plain method call suffices.
- **Misuse:** Wrapping every method in a Command object with no undo/queue need.

## Chain of Responsibility
- **Intent:** Pass a request along a chain until a handler handles it.
- **When:** Middleware/filter pipelines; escalation; ordered optional handlers.
- **When NOT:** A single handler, or a simple `if/else`.
- **Misuse:** Chains where order is fragile and handling is ambiguous.

## Mediator
- **Intent:** Centralize complex many-to-many interactions in one object.
- **When:** A tangle of objects referencing each other (complex UI form coordination).
- **When NOT:** Few, simple interactions — the mediator becomes a god object.

## Iterator
- **Intent:** Sequential access to a collection without exposing its structure.
- **When:** Custom traversal / lazy sequences. Mostly built into modern languages.
- **When NOT:** Reinventing what the language/stdlib already gives you.

## Memento
- **Intent:** Capture and restore an object's state without violating encapsulation.
- **When:** Undo/snapshots/checkpoints.
- **When NOT:** No restore requirement.

## Visitor
- **Intent:** Add operations to a stable object structure without changing its
  classes; double dispatch over a fixed type set.
- **When:** Stable set of node types, many operations to add (AST processing).
- **When NOT:** The type set changes often — Visitor makes adding types painful
  (expression problem). Prefer polymorphic methods then.
- **Misuse:** Visitor over a frequently-growing hierarchy.

**Strategy vs State vs Template Method:** Strategy = pick an algorithm (composition);
State = behavior follows a state machine; Template Method = fixed skeleton, varying
steps (inheritance). Prefer the composition-based ones by default.
