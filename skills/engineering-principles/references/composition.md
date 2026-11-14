# Composition over Inheritance

Default to composition. Inheritance is a powerful but rigid tool with a narrow
correct use. "Composition over inheritance" is a default, not an absolute.

## Why composition is the default
- **Flexible** — assemble behavior from parts; change at runtime.
- **Loose coupling** — depend on small interfaces, not a base class's internals.
- **No fragile base class** — base changes don't silently break subclasses.
- **Avoids the hierarchy trap** — real domains vary along multiple axes at once,
  which single inheritance can't model (you get combinatorial subclasses).

## When inheritance is genuinely right
Use it only when **all** hold:
1. A true **is-a** relationship (a `SavingsAccount` *is an* `Account`).
2. Full **Liskov substitutability** — subtypes work everywhere the base does, with
   no surprises, no "unsupported" overrides, no `instanceof` checks by callers.
3. The hierarchy is **stable** — you're not expecting new orthogonal axes.
4. You're inheriting a **contract**, not just sharing a few lines of code.

Framework extension points (extending a framework base class as designed) are a
legitimate, common case.

## The classic failure
`Square extends Rectangle`: setting width on a Square must also change height,
violating the Rectangle contract callers rely on. The is-a is real in geometry but
false in mutable-object terms. → model with composition or value objects instead.

## Techniques that replace inheritance
- **Strategy** — inject the varying behavior as a collaborator.
- **Delegation** — hold an instance and forward calls, exposing only what you mean to.
- **Mixins/traits** (where the language supports them) — compose orthogonal
  capabilities without a base-class spine.
- **Higher-order functions** — pass behavior as a function for simple variation.

## Decision
```
Need to share/vary behavior?
   ├─ Is it a true, stable, fully-substitutable is-a?  ── yes ─▶ inheritance is OK
   └─ Otherwise (sharing code, multiple axes, runtime variation) ─▶ compose
```

## Smells that you should have composed
- Deep hierarchies (3+ levels) modeling variation.
- Subclasses overriding methods to throw "not supported."
- Classes that combine two independent axes into one hierarchy (e.g.
  `RedBigButton`, `BlueSmallButton`) — compose color × size instead.
- Reaching for `protected` to let subclasses touch base internals (implementation
  coupling).
