# Messaging, Queues & Event Streaming

Asynchronous messaging decouples producers from consumers and levels load. It adds
delivery-semantics, ordering, and eventual-consistency concerns. Use it for genuine
async work, decoupling, and reliable event propagation — not as a default glue.

## Queue vs pub/sub vs stream
- **Queue (point-to-point):** one message consumed by one worker; work distribution,
  task offloading, load leveling (SQS, RabbitMQ). Competing consumers scale throughput.
- **Pub/Sub:** one message fan-out to many independent subscribers; event
  notification, decoupled reactions.
- **Event streaming (log):** durable, ordered, replayable log; multiple consumer
  groups read at their own offset (Kafka, Kinesis). Use for event sourcing, replay,
  high-throughput pipelines, and when consumers need history.

## Delivery semantics
- **At-most-once** — may lose messages; rarely acceptable.
- **At-least-once** — the practical default; messages may be **duplicated** →
  **consumers must be idempotent** (dedup key / idempotent op). Non-negotiable.
- **Exactly-once** — hard and usually partial (e.g. Kafka transactions within its
  boundary). Don't assume it end-to-end; design for at-least-once + idempotency instead.

## Ordering
- Global ordering is expensive and limits parallelism. Most systems need **per-key
  ordering** (order events for one entity), achieved by partitioning on that key.
- Consumers must tolerate out-of-order arrival across keys.

## Reliability building blocks
- **Dead-letter queue (DLQ):** messages that repeatedly fail go here for inspection —
  don't let a poison message block the queue or retry forever.
- **Retry with backoff + jitter**, plus a max-attempts cap → then DLQ.
- **Consumer offsets / acks:** ack only after successful processing (at-least-once);
  commit offsets carefully to avoid loss or double-processing.
- **Backpressure:** bound queues; decide drop vs block vs shed when consumers lag.
- **Outbox pattern** (see application-patterns): to publish reliably *after* a DB
  commit and avoid the dual-write problem.

## Judgment
- A queue is justified by: slow/expensive work to offload, spiky load to smooth,
  decoupling independent components, or reliable event fan-out. If none apply, a direct
  synchronous call is simpler and easier to reason about.
- Async turns one failure domain into two (producer, broker, consumer) plus a new
  operational surface (lag, DLQs, offsets). Count that cost.
- Always design consumers to be **idempotent** and to handle duplicates and
  reordering — the broker will eventually deliver both.
