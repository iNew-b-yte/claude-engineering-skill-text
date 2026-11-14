# Tradeoff Reasoning

Every engineering decision trades one property for another. Naming the trade
explicitly is the job — an option with "no downside" usually means you haven't
found it yet.

## The core tensions

- **Simplicity ↔ flexibility.** Abstraction buys future flexibility at the cost of
  present complexity. Pay only when the future change is likely and near.
- **Performance ↔ readability.** Optimized code is often harder to maintain. Only
  trade readability where measurement shows the hot path needs it.
- **Consistency ↔ availability** (under partition — CAP). You cannot have both when
  the network splits. Choose per use case, not per system.
- **Latency ↔ throughput.** Batching improves throughput, worsens per-item latency.
- **Latency ↔ durability.** Sync replication/fsync is durable but slow; async is
  fast but can lose recent writes.
- **Coupling ↔ duplication.** DRY reduces duplication but increases coupling. A
  little duplication is cheaper than the wrong abstraction (AHA: "prefer
  duplication over the wrong abstraction").
- **Normalization ↔ read performance.** Normalized data is consistent and
  write-cheap; denormalized data is read-cheap and consistency-risky.
- **Build ↔ buy.** Building gives control and cost; buying gives speed and a
  dependency.
- **Cost ↔ everything.** More reliability/performance/scale usually costs money and
  ops effort. Match spend to the actual requirement.

## How to weigh

1. **Identify which properties the requirement actually demands.** Most systems
   need 2–3 properties strongly and are indifferent to the rest. Optimize for the
   ones that matter; spend nothing on the ones that don't.
2. **Find the binding constraint.** The decision usually turns on one axis (e.g.
   "must survive an AZ outage" or "p99 < 100ms"). Lead with it.
3. **Prefer reversible choices under uncertainty.** When you can't quantify the
   trade, pick the option cheapest to undo.
4. **Cost the complexity.** Complexity is paid every day by everyone who touches
   the system, not once at build time. Weight it accordingly.
5. **State what you're giving up.** "This gives us X at the cost of Y; Y is
   acceptable because Z."

## Common mis-weightings

- Treating performance as free to chase (it costs readability + time).
- Treating flexibility as always good (unused flexibility is pure cost).
- Optimizing an axis the requirement never asked for.
- Ignoring operational cost because it doesn't show up in code review.
- Choosing the "scalable" option for a system that will never need to scale.
