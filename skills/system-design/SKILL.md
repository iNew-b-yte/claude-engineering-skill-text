---
name: system-design
description: Design systems for scale, reliability, and distribution — capacity/latency estimation, data modeling, storage/caching/messaging choices, consistency models, failure modes, and observability. Use for high-scale, high-availability, or distributed-system design and for "how would you design X" questions. Do NOT apply distributed-system machinery to problems a single service/DB handles.
---

# System Design

Design the **simplest system that meets the actual requirements and survives its
realistic failure modes.** Most systems do not need to be distributed. Add
distribution, sharding, queues, and caches only when a stated requirement forces it.

## Start with numbers, not diagrams

Before drawing boxes, estimate (`references/scalability.md`):
- users / concurrent users, requests/sec (peak vs avg)
- data volume now + growth, read/write ratio
- latency budget (p50/p99), availability target
- geographic distribution, consistency needs

These numbers decide almost everything. "We might need scale someday" is not a
number — build for the requirement, keep the design cheap to evolve.

## Decision flow

```
Requirements → Scale/latency/availability numbers → Data model → API/interface →
High-level architecture → Components → Data flow → Storage → Caching → Messaging →
Consistency → Failure modes → Security → Observability → Capacity → Tradeoffs
```

Label every component: **required now / optional / future-scaling**. Don't build the
future one now.

## The building blocks (and when each is justified)

- **Scaling** — vertical first (simplest); horizontal + load balancing when one box
  can't cope or you need redundancy. Partition/shard only when data/traffic exceeds a
  single node. `references/scalability.md`.
- **Distributed systems** — CAP/PACELC, replication, consensus, idempotency. Every
  distributed feature adds failure modes; justify each. `references/distributed-systems.md`.
- **Consistency** — pick the weakest model that satisfies correctness.
  `references/consistency.md`.
- **Caching** — only against a measured read bottleneck; caching adds an invalidation
  problem. `references/caching.md`.
- **Messaging/queues** — for async work, decoupling, load-leveling, and reliable
  event delivery; adds delivery-semantics and ordering concerns. `references/messaging.md`.
- **Reliability** — timeouts, retries, circuit breakers, redundancy, graceful
  degradation. `references/reliability.md`.
- **Observability** — logs, metrics, traces, SLIs/SLOs. Non-optional for anything
  operated in production. `references/observability.md`.

## Decision rules

- Monolith / modular monolith is the correct default. Microservices solve
  *organizational and independent-scaling* problems, at a large operational cost —
  adopt only when those problems are real.
- One relational database handles far more than people assume. Reach for NoSQL/sharding
  when the access pattern or scale genuinely demands it.
- Prefer synchronous simplicity until async is required by scale/decoupling/latency.
- Every new moving part = new failure mode + new thing to monitor. Count the cost.

## Anti-patterns

- Microservices for a small team / small system ("distributed monolith").
- Adding Kafka/Redis/a queue with no measured need.
- Designing for millions of users a system that will serve thousands.
- Multi-region/active-active without an availability requirement demanding it.
- Sharding prematurely (huge complexity, hard to reverse).

## References
`references/scalability.md` · `references/distributed-systems.md` ·
`references/consistency.md` · `references/caching.md` · `references/messaging.md` ·
`references/reliability.md` · `references/observability.md`
