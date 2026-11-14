# Distributed Systems

The moment state lives on more than one machine, you inherit partial failure, network
unreliability, and consistency problems. **Every distributed feature adds failure
modes.** The best distributed system is often the one you didn't build.

## The 8 fallacies (assume the opposite)
The network is NOT reliable, latency is NOT zero, bandwidth is NOT infinite, the
network is NOT secure, topology changes, there's more than one admin, transport cost
isn't zero, the network is NOT homogeneous. Design as if messages are lost, delayed,
duplicated, and reordered — because they are.

## CAP (under a network partition, pick two of three — really: pick C or A)
- **Consistency** — every read sees the latest write.
- **Availability** — every request gets a (non-error) response.
- **Partition tolerance** — the system keeps working despite dropped messages.
Partitions are unavoidable, so P is mandatory → the real choice under partition is
**CP** (refuse/stale-error to stay consistent) vs **AP** (stay up, serve possibly
stale data). Choose per use case: payments/inventory lean CP; feeds/catalogs lean AP.

## PACELC (the fuller picture)
If **P**artitioned, choose **A**/**C**; **E**lse (normal operation) choose
**L**atency/**C**onsistency. Even without partitions, strong consistency costs
latency (coordination). Most "eventually consistent" stores are AP/EL.

## Replication
- **Leader-follower (primary-replica):** writes to leader, reads from followers.
  Scales reads; **replication lag** breaks read-your-writes. Failover needs leader
  election.
- **Multi-leader / leader-less (quorum):** higher availability, write conflicts →
  need conflict resolution (LWW, version vectors, CRDTs). Complex.
- **Quorum:** with N replicas, if R + W > N you get overlap → strong-ish reads. Tune
  R/W for read vs write latency.

## Consensus (agreeing despite failures)
Raft/Paxos give a consistent replicated log for leader election, config, metadata.
Expensive (multiple round-trips, majority required). Use a proven system
(etcd/ZooKeeper/Consul) — **don't implement consensus yourself.**

## Idempotency (mandatory in distributed systems)
Because messages get retried/duplicated, operations must be safe to apply more than
once. Use **idempotency keys**, dedup tables, or naturally idempotent operations
(set-to-value vs increment). This is the single most important reliability habit.

## Distributed transactions
- Two-phase commit (2PC) is slow and blocks on coordinator failure — avoid.
- Prefer **Saga** (local transactions + compensations) or the **Outbox** pattern for
  reliable eventing (see software-design/application-patterns).
- Best of all: design so a single node's local transaction covers the invariant.

## Time & ordering
No global clock. Wall clocks skew — don't order events by timestamp across nodes. Use
logical clocks (Lamport), version vectors, or a sequencer when ordering matters.

## Judgment
- Prefer a single-node/single-DB design until scale or availability forces distribution.
- Each added node/replica/broker = more failure modes + more to operate.
- Lean on managed, proven building blocks; don't hand-roll replication/consensus.
