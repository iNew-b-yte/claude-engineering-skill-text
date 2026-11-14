# Reliability & Resilience

Reliability is designing for the failures that *will* happen: dependencies time out,
nodes die, networks partition, load spikes. Aim for graceful degradation, contained
blast radius, and automatic recovery.

## Failure is normal — design for it
Enumerate failure modes for each dependency: What if it's slow? Down? Returns errors?
Returns wrong data? Then decide the behavior for each.

## Core techniques
- **Timeouts** — every remote call must have one. No timeout = a hung dependency
  exhausts your threads/connections and takes you down. Set them from the latency
  budget, not defaults (which are often infinite).
- **Retries** — only for **idempotent** ops and **transient** failures. Exponential
  backoff + **jitter** + a cap. Naive retries amplify an outage (retry storms).
- **Circuit breaker** — after N failures, stop calling a dead dependency for a
  cooldown; fail fast and recover automatically. Prevents cascading failure and
  thread exhaustion. Define a fallback.
- **Bulkhead** — isolate resource pools per dependency so one slow downstream can't
  consume all threads/connections. Contains blast radius.
- **Fallback / graceful degradation** — serve cached/default/partial results instead
  of failing the whole request (e.g. hide recommendations if that service is down but
  still show the page).
- **Load shedding & rate limiting** — reject/queue excess load to protect the core
  rather than collapsing under it. Prioritize critical traffic.
- **Idempotency** — safe retries require it (dedup keys). See distributed-systems.

## Redundancy & recovery
- **Redundancy** — no single point of failure; N+1 instances across AZs; automated
  failover with health checks.
- **Health checks** — liveness (restart if dead) vs readiness (don't route traffic
  until ready). Distinguish them.
- **Graceful shutdown** — drain in-flight work, deregister from LB, then exit.
- **Backups & restore** — untested backups don't exist; rehearse restore. Know your
  **RTO** (how fast to recover) and **RPO** (how much data you can lose).

## Reliability targets
- **SLI** = a measured signal (success rate, p99 latency). **SLO** = the target for
  it. **Error budget** = 1 − SLO; spend it on change velocity. (See observability.)
- "Nines": 99.9% ≈ 8.7h/yr down; 99.99% ≈ 52min/yr. Each nine costs a lot — pick the
  target the business needs, not the maximum.

## Testing reliability
- Inject failures (chaos): kill nodes, add latency, drop dependencies — verify
  graceful behavior.
- Load/soak test to find the knee before production does.
- Game-day the runbooks.

## Judgment
- Match reliability investment to the requirement — a background batch job doesn't
  need active-active multi-region.
- The cheapest reliability is **fewer moving parts**. Every dependency is a new way to
  fail; a simpler system is a more reliable system.
- Timeouts + retries-with-backoff + idempotency + a circuit breaker cover the majority
  of real-world resilience needs. Start there.
