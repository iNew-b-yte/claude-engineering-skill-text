---
name: performance
description: Diagnose and fix performance problems methodically — measure before optimizing, find the real bottleneck, identify root cause, then optimize and re-measure. Covers CPU, memory, database, network, I/O, concurrency, caching, and frontend rendering/bundle cost. Use when there is a measured or reported performance problem, or when evaluating the performance impact of a design. Never optimize on a hunch.
---

# Performance

Optimization is a data-driven activity. **Measure, don't guess** — intuition about
bottlenecks is wrong more often than right, and premature optimization adds complexity
that buys nothing. Optimize against a requirement (a latency/throughput budget), not a
feeling that code "looks slow."

## The methodology (do not skip steps)

```
Requirement/budget → Measure (profile) → Identify the bottleneck →
Find root cause → Optimize → Measure again (confirm the win) → Stop
```

- **Establish the target** — what's "fast enough"? p99 latency, throughput, memory
  ceiling. Without a target you can't know when to stop.
- **Measure** — profile the actual system with realistic data/load. Find where time/
  memory actually goes. Most systems spend their time in a small fraction of code
  (Amdahl's law) — optimizing elsewhere is wasted effort.
- **Root cause, not symptom** — a slow endpoint might be an N+1 query, a missing index,
  a serial remote call, or lock contention — each has a different fix.
- **Re-measure** — confirm the change actually helped and didn't regress elsewhere.

## Where real bottlenecks usually are (check in this order)
Most application slowness is **I/O-bound, not CPU-bound**:
1. **Database** — N+1 queries (the #1 offender), missing indexes, `SELECT *`,
   unbounded results, table scans. Check the query plan. Usually the biggest win.
2. **Network / remote calls** — serial calls that could be parallel/batched; chatty
   APIs; no connection pooling; large payloads.
3. **Serialization / data volume** — moving/parsing more data than needed; N× object
   allocation.
4. **Caching opportunity** — expensive, frequently-read, rarely-changed data (add a
   cache only here, and own invalidation — see system-design/caching).
5. **Algorithmic complexity** — a genuinely quadratic hot path over large n (see
   `algorithms`). Real but less common than DB/network issues.
6. **Concurrency** — lock contention, thread-pool starvation, blocking I/O on hot paths.
7. **Memory** — leaks, excessive allocation/GC pressure, unbounded caches/collections.

## Frontend performance
- Bundle size and un-split routes (biggest win); lazy-load; audit heavy deps.
- Excess re-renders; unvirtualized long lists; unoptimized images/fonts/3rd-party scripts.
- Measure with real device/network + Core Web Vitals (LCP/CLS/INP), not a fast laptop.

## Optimization levers (after you've found the bottleneck)
Better query/index · batching · caching · parallelizing independent I/O · reducing
payload/allocation · a better data structure/algorithm · connection pooling · lazy
loading. Pick the one that targets the measured bottleneck.

## Judgment
- **Don't optimize cold paths** — startup code, once-a-day jobs, code off the hot path.
- Weigh the tradeoff: optimized code is often less readable and more fragile. Only
  spend that where the budget demands it. A clear O(n²) over n≤100 beats a clever
  fragile O(n log n).
- The cheapest optimization is doing less work: fewer queries, fewer round-trips, less
  data, pagination, not rendering what isn't seen.
- Stop when you hit the target. Diminishing returns are real.

## Anti-patterns
- Optimizing without profiling; micro-optimizing while an N+1 query dominates.
- Adding a cache to mask a fixable slow query (and inheriting an invalidation bug).
- Sacrificing readability for unmeasured "performance."
- Optimizing average latency while p99 (the user-felt tail) is the problem.
- Chasing complexity classes that don't matter at the actual input size.
