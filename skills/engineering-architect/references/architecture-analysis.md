# Reading and Evaluating an Existing Architecture

Before changing a system, understand it. Imposing a preferred structure over a
working one without justification is a top failure mode.

## How to read a codebase fast

1. **Entry points & boundaries.** Where do requests/jobs/events enter? What are
   the deployable units? Where are the network hops?
2. **Module map.** Top-level directories/packages = the intended domain split.
   Note which depend on which (dependency direction tells you the intended layering).
3. **Data model.** Schema/entities are the most stable, most revealing artifact.
   The data model *is* the architecture, more than the code is.
4. **The "spine."** Trace one representative request end to end. This reveals the
   real layering, where logic actually lives, and where the seams are.
5. **Conventions.** How are errors handled? How is validation done? Naming? Test
   style? Match these — consistency is worth more than your preferences.
6. **Why abstractions exist.** An interface with one implementation may be a seam
   for testing, a plugin point, or genuine over-engineering. Find out which before
   removing it.

## Evaluation lenses

- **Coupling & cohesion** (see `engineering-principles`): do modules that change
  together live together? Do dependencies point inward toward stable code?
- **Dependency direction.** Do volatile details depend on stable policy, or the
  reverse? Cycles are a smell.
- **Change amplification.** For a typical change, how many files/modules must move?
  High amplification = poor boundaries.
- **Blast radius.** When component X fails, what else fails? Are failures contained?
- **Consistency of approach.** One way to do each thing, or five?
- **Testability.** Can units be tested without spinning up the world?

## Deciding: extend, reuse, or replace

- **Extend** when the existing abstraction fits and just needs another case.
- **Reuse** when analogous code exists — copy the pattern, don't invent a new one.
- **Replace** only when the existing approach actively blocks the requirement AND
  the migration cost is justified. Replacement is a one-way door — treat it as one.

## Red flags that justify structural change

- The same change repeatedly touches many unrelated files (bad cohesion).
- A "utils"/"common"/"helpers" module that everything depends on (coupling sink).
- Business logic embedded in controllers/UI/ORM entities (leaked layering).
- Cyclic dependencies between modules.
- Cannot test without external systems.

## Red flags that you are over-reaching

- You want to rename/restructure code another part of the system depends on
  without checking callers (STOP — check consumers first).
- You're introducing a layer "for consistency" that solves no current problem.
- You're replacing working code because it's not how *you* would have written it.
