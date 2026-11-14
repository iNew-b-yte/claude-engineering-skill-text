# Scalability

Scalability is the ability to handle growth by adding resources. Don't design for
scale you don't have — but don't paint yourself into a corner that's expensive to
escape (one-way doors: data model, partitioning scheme).

## Capacity estimation (do this first)
- **QPS:** DAU × actions/user/day ÷ 86,400; then peak = avg × (3–10×).
- **Storage:** items/day × bytes/item × retention; add index/replication overhead.
- **Bandwidth:** QPS × payload size.
- **Read/write ratio:** shapes caching and replication (read-heavy → caches + read
  replicas; write-heavy → partitioning, batching).
- **Working set:** how much hot data must fit in memory/cache.

Round to orders of magnitude — the goal is "does one box suffice, or do I need 10 or
1000?", not false precision.

## Vertical vs horizontal
- **Vertical (bigger box):** simplest, no distribution complexity, no code changes.
  **Do this first.** Limited by biggest machine; single point of failure.
- **Horizontal (more boxes):** near-unlimited, gives redundancy; requires
  statelessness, load balancing, and distributed-data handling. Necessary for HA.

## Enabling horizontal scale
- **Statelessness** — keep app servers stateless; push session/state to a shared store
  (Redis/DB). Stateless servers scale and fail over trivially.
- **Load balancing** — L4/L7; round-robin / least-connections / consistent hashing.
  Health checks remove bad nodes.
- **Read replicas** — scale reads; beware replication lag (read-your-writes issues).

## Partitioning / sharding (a one-way door — delay it)
Split data across nodes when it exceeds one node's capacity.
- **Shard key choice is critical** — pick one that spreads load evenly and matches
  query patterns. A bad key → hotspots and cross-shard queries.
- **Strategies:** hash (even spread, poor range queries), range (good ranges, hotspot
  risk), directory (flexible, extra lookup), consistent hashing (minimizes reshuffling
  when nodes change).
- **Costs:** cross-shard joins/transactions are hard; rebalancing is painful. Exhaust
  vertical scaling, replicas, and caching first.

## Other levers
- **Caching** (see caching.md) — often the highest-leverage read win.
- **CDN** — cache static/edge content near users.
- **Async / queues** — smooth spikes (load leveling), offload slow work.
- **Connection pooling, batching** — reduce per-request overhead.

## Judgment
- The cheapest scaling is **not doing the work**: better queries, fewer round-trips,
  caching, pagination.
- Scale the actual bottleneck (measure), not the component that's easiest to scale.
- Keep the design **evolvable**: it's fine to start on one box if moving to N boxes
  later doesn't require a rewrite (statelessness + a sane data model buy this).
