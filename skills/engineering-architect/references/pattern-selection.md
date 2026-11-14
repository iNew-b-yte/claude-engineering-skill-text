# Pattern / Abstraction Selection Gate

The single most important behavior in this system: **never introduce a pattern or
abstraction because you know it exists.** Identify the problem, then decide.

## The gate

```
What problem exists?
      ↓
Does the problem actually repeat / vary? ── no ──▶ inline code, no pattern
      ↓ yes
Is the complexity significant enough to hurt? ── no ──▶ simplest solution
      ↓ yes
Does abstraction reduce *future change cost*? ── no ──▶ don't abstract yet
      ↓ yes
What is the simplest solution that captures it?
      ↓
Would a known pattern improve it (vs. a plain function/module)?
      ↓
What is the cost of the pattern (indirection, learning, LOC)?
      ↓
Benefit > cost?  ── no ──▶ don't use it   ── yes ──▶ use it, and say why
```

## Questions that must be answerable "yes" before abstracting

- Can I name the **concrete change** this abstraction makes cheaper?
- Is that change **likely** and **soon**, or hypothetical?
- Does the variation **already exist** (≥2 real cases), or am I guessing there
  will be more? (Rule of three: abstract on the third occurrence, not the first.)
- Will the next engineer understand *why* the indirection is there?

If any answer is "no" or "not sure," prefer the concrete, inline solution.

## Signals a pattern genuinely helps

- **Strategy** — 2+ interchangeable algorithms that vary independently and are
  expected to grow; replaces a growing conditional.
- **Factory** — object creation is complex/conditional and duplicated across sites.
- **Adapter** — you must fit an incompatible external interface to your own.
- **Observer / pub-sub** — multiple independent reactions to an event, decoupled
  from the source.
- **State** — an object's behavior changes by state and the transition logic is
  sprawling across conditionals.
- **Repository** — you want to isolate persistence from domain logic and swap/test it.
- **Circuit breaker / retry / bulkhead** — real remote dependency with real failure modes.

## Signals you're forcing it (don't)

- One implementation "in case we need more."
- A factory that just calls a constructor.
- A Strategy with one strategy.
- Wrapping a stable, owned interface in an Adapter.
- Event bus for a call that could be a direct function call within one process.
- Generic/param-heavy code serving exactly one caller.

## Say it out loud

It is a **required behavior** to conclude, when true:
> "No design pattern is necessary here — a plain function/module is simpler and
> sufficient."

See `software-design/references/*` for each pattern's intent, tradeoffs, and misuse.
