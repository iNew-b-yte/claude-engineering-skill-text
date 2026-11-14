# Abstraction — cost-aware

Abstraction hides detail behind an interface. It has real benefits and a real,
recurring cost: **indirection**. Every abstraction is a level the reader must
traverse to understand what actually happens.

## What abstraction buys
- **Substitutability** — swap implementations (test double, alternate vendor).
- **Reduced change cost** — callers unaffected when the hidden detail changes.
- **Comprehension** — a good name lets you reason at intent-level without the mechanics.

## What abstraction costs
- **Indirection** — jumping through layers to find where work happens.
- **Wrong-abstraction risk** — a premature abstraction guesses the axis of variation
  and usually guesses wrong; then everyone contorts code to fit it. **The wrong
  abstraction is more expensive than duplication** (Sandi Metz).
- **Leaky abstractions** — details that leak through force callers to know the
  mechanism anyway, giving cost without benefit.

## The rule of three
Don't abstract on the first occurrence. Duplicate once. On the **third** real
occurrence, the shared shape is clear enough to abstract correctly. Abstracting on
the first is guessing.

## Good abstraction checklist
- Hides something that **genuinely varies or is genuinely complex**.
- Has a **name that expresses intent**, not implementation.
- **Doesn't leak** — callers never need to know what's behind it.
- Serves **≥2 real callers** (or a proven test/swap need), not one hypothetical.
- Reduces total cognitive load rather than adding a layer to trace through.

## Premature-abstraction smells
- Interface with one implementation and no test/swap requirement.
- Generic/parameterized code serving exactly one concrete use.
- Config-driven "flexibility" no one asked for.
- Framework-building inside application code.
- "We might need to support X someday" with no roadmap for X.

## The decision
> Prefer a concrete, duplicated, obvious implementation until the **shape of the
> variation is proven**. Then abstract precisely along that proven axis.

Under-abstraction is cheap to fix later (extract when the third case arrives).
Over-abstraction is expensive to fix (everything depends on the wrong seam). When
unsure, err toward concrete.
