# Coupling and Cohesion

The two most useful lenses for evaluating any boundary — module, class, service,
package. **Aim: high cohesion within a unit, loose coupling between units.**

## Cohesion — how well a unit's contents belong together (higher is better)

From best to worst:
- **Functional** — everything contributes to one well-defined task. *Target.*
- **Sequential** — output of one part feeds the next (a pipeline). Good.
- **Communicational** — parts operate on the same data. Okay.
- **Temporal** — grouped because they happen at the same time (e.g. `init()` doing
  ten unrelated things). Weak.
- **Logical** — grouped by category, selected by a flag (a `doStuff(type)` switch).
  Weak.
- **Coincidental** — no meaningful relationship (a `Utils` grab-bag). Worst.

**Test:** "What is this module's single responsibility?" If the honest answer needs
"and"/"or", cohesion is low. Low cohesion → changes scatter and unrelated things
break together.

## Coupling — how much units depend on each other (looser is better)

From loosest to tightest:
- **Message/data coupling** — interact only via parameters/simple data. *Target.*
- **Stamp coupling** — pass a whole record when only a field is needed. Minor smell.
- **Control coupling** — one module passes a flag telling another *how* to behave
  (`render(mode)`). Smell — usually two responsibilities.
- **Common/global coupling** — share global mutable state. Bad; hidden dependencies.
- **Content/implementation coupling** — one module reaches into another's internals.
  Worst; breaks encapsulation.

Also:
- **Temporal coupling** — call order matters implicitly (`configure()` must precede
  `start()`), unenforced by the API. Make ordering impossible to get wrong (e.g.
  construct fully-initialized objects).
- **Service coupling** — cross-service: shared DB (tightest), sync RPC (tight),
  async events (looser). Choose deliberately.

## Using them to design boundaries

When proposing a module/service boundary, state:
1. **What belongs together** (and why — they change for the same reason).
2. **What stays separate** (and why — different rate/reason of change).
3. **Dependency direction** — stable things shouldn't depend on volatile things.
4. **What changes independently** — the boundary should let each side evolve alone.

## The connection to change

- Low cohesion → a single logical change touches many modules (**change amplification**).
- High coupling → a change in one module forces changes in others (**ripple**).
- Good design localizes change: most changes touch one module, and that module
  changes for one reason.

## Practical smells
- A change that always edits the same 5 files across different modules → those
  responsibilities are split wrong (cohesion problem, wrong boundary).
- A "core"/"common"/"shared" module everything imports → coupling sink; split by
  actual usage.
- Passing config flags to steer behavior → control coupling; split the behaviors.
