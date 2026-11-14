# SOLID — with judgment

SOLID principles exist to make OO systems tolerate change. They are heuristics,
not laws. Each has a failure mode when over-applied. Understand the *problem* each
solves; apply only when that problem is present.

## S — Single Responsibility Principle
**Statement:** A module should have one reason to change — one axis of variation,
one stakeholder.
**Problem it solves:** Changes for unrelated reasons collide in one place, causing
merge pain and accidental breakage.
**Useful restatement:** Gather what changes together; separate what changes for
different reasons. This is *cohesion*.
**When it matters:** A class mixing e.g. business rules + persistence + formatting
— each changes for different reasons.
**Over-application:** Shattering a cohesive class into many one-method classes you
must reassemble mentally. "One reason to change" ≠ "one method."

## O — Open/Closed Principle
**Statement:** Open for extension, closed for modification — add behavior without
editing existing, tested code.
**Problem it solves:** Every new case forcing edits to a central switch, risking
regressions.
**When it matters:** A genuinely growing set of variants (payment methods, export
formats) where new cases arrive regularly.
**Over-application:** Building plugin frameworks for variation that never comes.
Editing a small function for a second case is fine — abstract on the third.

## L — Liskov Substitution Principle
**Statement:** Subtypes must be usable anywhere the base type is, without
surprising the caller (no strengthened preconditions, no weakened postconditions,
no new exceptions).
**Problem it solves:** Inheritance that breaks callers relying on the base
contract (classic: `Square extends Rectangle`).
**When it matters:** Any time you use inheritance or interface implementations.
**Practical test:** If a subtype throws "unsupported" for a base method, or needs
`instanceof` checks, the hierarchy is wrong — prefer composition.

## I — Interface Segregation Principle
**Statement:** Clients shouldn't depend on methods they don't use; prefer small,
focused interfaces.
**Problem it solves:** Fat interfaces force implementers to stub irrelevant
methods and couple clients to unrelated changes.
**When it matters:** Broad service interfaces consumed by clients with narrow needs.
**Over-application:** One-method interfaces for everything, exploding the type count.

## D — Dependency Inversion Principle
**Statement:** High-level policy shouldn't depend on low-level detail; both depend
on abstractions. Details depend on policy, not vice versa.
**Problem it solves:** Business logic hard-wired to a specific DB/queue/vendor,
making it untestable and hard to swap.
**When it matters:** At true boundaries — persistence, external services, I/O —
where the detail is volatile or must be tested/swapped.
**Over-application:** Interface-ing every internal collaborator. **DIP applies at
boundaries, not between every two cooperating classes in the same module.** A
one-implementation interface with no test/swap need is pure indirection.

## How they interact & conflict
- SRP + ISP push toward smaller units; taken too far they fragment cohesion.
- OCP + DIP add indirection; that indirection is only worth it where variation is real.
- LSP constrains inheritance; combined with "composition over inheritance," it
  often argues *against* inheritance entirely.

**Net rule:** SOLID well-applied reduces coupling and improves cohesion. If
applying a principle *increases* indirection without reducing real coupling,
you're doing pattern theater — stop.
