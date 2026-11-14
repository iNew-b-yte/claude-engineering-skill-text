---
name: refactoring
description: Restructure code without changing its behavior — improving clarity, cohesion, and coupling in small, safe, continuously-verified steps behind a test safety net. Use when improving existing code's structure, reducing duplication or complexity, or preparing code for a change. Do not mix refactoring with behavior changes.
---

# Refactoring

Refactoring = changing structure **without changing behavior**. Its power and its
safety both come from that constraint: because behavior is preserved, you can verify
each step against the same tests. The moment you also change behavior, it's no longer
refactoring and the safety net is gone.

## Before you start
- **Understand the current behavior** — including the edge cases and quirks that may be
  load-bearing. Don't "clean up" something you don't fully understand.
- **Ensure a test safety net.** Refactoring without tests is just editing and hoping.
  If coverage is missing, add **characterization tests** first (capture current
  behavior, even if it seems odd) so you can detect any change.
- **Identify consumers, dependencies, and public contracts.** Know what depends on
  what you're touching — especially anything another module/service/session relies on.
  (If a rename/move affects a public API or another component, confirm before doing it.)

## During: small, safe, verified steps
- Make **one small transformation at a time** — rename, extract function, inline, move,
  introduce parameter object, replace conditional with polymorphism, etc.
- **Run tests after each step.** Green → continue; red → the last step broke behavior,
  revert it. Small steps make failures trivial to locate.
- Commit frequently at green points, so you can always retreat to a working state.
- Keep the code compiling/passing throughout — never a long "it'll work when I'm done"
  window.

## What to improve (map to `engineering-principles`)
- **Raise cohesion / lower coupling** — group what changes together, separate what
  doesn't, cut unnecessary dependencies.
- **Remove genuine duplication** — but remember the wrong abstraction is worse than
  duplication; extract only when the shared shape is proven (rule of three).
- **Reduce complexity** — deep nesting → guard clauses; long functions → extracted,
  named steps; long parameter lists → parameter objects; primitive obsession → value
  objects.
- **Improve names** — a good name removes the need for a comment and reveals intent.
- **Simplify, don't add abstraction** for its own sake — refactoring can also mean
  *removing* premature abstraction.

## Critical discipline
- **Do not mix refactoring with feature work or bug fixes.** Separate commits/PRs. A
  diff that both moves code and changes behavior is unreviewable and dangerous. If a
  change needs a refactor first, do the refactor (behavior-preserving, verified), then
  the change — as distinct steps.
- Don't expand scope mid-refactor ("while I'm here...") — note it and do it separately.

## Judgment
- Refactor when it makes an upcoming change easier ("make the change easy, then make
  the easy change") or when complexity is actively slowing work — not to satisfy taste.
- Working code has value; a risky rewrite for elegance can be net-negative. Weigh the
  benefit against the risk and the tests available.
- Prefer many small refactors over one big-bang rewrite; big rewrites lose behavior and
  institutional knowledge.

## Anti-patterns
- Refactoring without tests / without understanding current behavior.
- Mixing structural and behavioral changes in one diff.
- Big-bang rewrites; broad renames without checking consumers.
- Scope creep; introducing new abstractions "while cleaning up."
- Calling a behavior change a "refactor."
