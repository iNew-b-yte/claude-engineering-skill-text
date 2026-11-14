# Consistency Models

Pick the **weakest model that keeps the system correct.** Stronger consistency costs
latency, availability, and throughput. Match the model to the business invariant, not
to a general preference for "strong."

## The spectrum (strong → weak)
- **Linearizable / strong** — reads always reflect the most recent write; the system
  behaves as if there's one copy. Costliest (coordination on every op). Use for:
  money balances, inventory decrement, uniqueness constraints, locks.
- **Sequential** — all nodes see operations in the same order (not necessarily
  real-time).
- **Causal** — operations that are causally related are seen in order everywhere;
  concurrent ops may differ. Good for comments/threads, collaborative apps.
- **Read-your-writes** — a user always sees their own writes (even if others see them
  later). Common UX requirement; cheap to provide (sticky routing / read from leader
  for that user).
- **Monotonic reads** — you never see time go backwards.
- **Eventual** — replicas converge if writes stop; reads may be stale meanwhile.
  Cheapest, highest availability. Fine for: view counts, feeds, catalogs, caches.

## Choosing per use case (not per system)
Different data in the same product wants different models:
- Account balance / payment / stock level → **strong** (or a single-node transaction).
- "Add to cart" / profile edit → **read-your-writes**.
- Product reviews ordering → **causal**.
- Like counts / trending / recommendations → **eventual**.

## Transactions & isolation (single-DB consistency)
Within a database, consistency is governed by **isolation levels** (see `database`):
read-committed → repeatable-read → serializable. Higher isolation prevents more
anomalies (dirty/non-repeatable reads, phantoms, write skew) at the cost of
concurrency. Most apps run read-committed and use explicit locking / serializable only
where write skew would corrupt an invariant.

## Techniques to strengthen perceived consistency cheaply
- Route a user's reads to the leader (or their own writes' shard) for read-your-writes.
- Version numbers / ETags + optimistic concurrency to detect conflicting writes.
- Idempotency keys so retries don't double-apply.
- Client-side reconciliation (CRDTs) for collaborative, offline-capable apps.

## Judgment
- "Eventually consistent" is acceptable far more often than people fear — but **never**
  for money, stock, or uniqueness without a guarding transaction.
- Don't impose global strong consistency to fix a problem that's local to one
  aggregate/row — use a single-node transaction there instead.
