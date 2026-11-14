# Complexity Analysis — in context

## Notation
- **Big O** — upper bound (worst case ceiling). The common currency.
- **Big Ω** — lower bound. **Big Θ** — tight bound (matching upper+lower).
- **Amortized** — average per operation over a sequence (e.g. dynamic-array append is
  O(1) amortized though occasional resizes are O(n)).
- Distinguish **average vs worst case** (hash lookup O(1) avg / O(n) worst;
  quicksort O(n log n) avg / O(n²) worst).

## Common classes (fastest → slowest)
`O(1)` < `O(log n)` < `O(n)` < `O(n log n)` < `O(n²)` < `O(n³)` < `O(2ⁿ)` < `O(n!)`

Rough ceilings for a ~1s budget (order-of-magnitude, language-dependent):
- O(n): ~10⁸ ok · O(n log n): ~10⁶–10⁷ · O(n²): ~10⁴ · O(2ⁿ): n≲25 · O(n!): n≲11.

## How to analyze
- Count operations as a function of input size; keep the **dominant term**, drop
  constants and lower-order terms.
- **Nested loops over the same n** → multiply. Sequential loops → add (keep the max).
- **Recurrences:** Master Theorem for `T(n)=aT(n/b)+f(n)` — e.g. merge sort
  `2T(n/2)+O(n)=O(n log n)`; binary search `T(n/2)+O(1)=O(log n)`.
- **Space complexity** counts too: recursion stack depth, auxiliary structures, copies.
  A memoization table trades space for time.

## The judgment part (this is the point)
`O(n²)` is not inherently bad. Before "improving" it, ask:
- **How large is n, realistically?** If n≤100 and bounded, O(n²) is ~10⁴ ops —
  instant. Don't complicate it.
- **Hot path or one-off?** A slow one-off at startup rarely matters.
- **How frequent?** Per-request in a tight loop is very different from nightly batch.
- **Is the simple version safer/clearer?** A correct O(n²) beats a buggy O(n log n).
- **Is the win measurable and needed?** Optimize against a budget, not a feeling.

## When it does matter
- n is large and/or unbounded (user-supplied, dataset-sized).
- The code is on a hot path / per-request / inner loop.
- There's a measured latency or cost problem.

Then: reduce the dominant term (better structure/algorithm) rather than
micro-optimizing constants. And re-measure (see `performance` skill).
