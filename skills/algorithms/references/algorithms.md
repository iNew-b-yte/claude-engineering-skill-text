# Algorithms — families and when each applies

## Searching
- **Linear search** O(n) — unsorted data, small n, or one-off. Perfectly fine often.
- **Binary search** O(log n) — sorted data / monotonic predicate. Also "binary search
  on the answer" for optimization problems with a monotone feasibility check.
- **Hashing** O(1) avg — membership/lookup by key. Usually the right answer for
  "have I seen this?"

## Sorting
- Use the **stdlib sort** (typically O(n log n), often Timsort — stable, adaptive).
- Know **stability** (preserves equal-key order) when sorting by multiple keys.
- Special cases: counting/radix sort O(n) for small integer ranges; partial sort /
  heap for **top-k** (O(n log k)) instead of full sort.
- Rarely hand-roll a sort in application code.

## Array/sequence techniques
- **Two pointers** — pair/subarray problems on sorted or partitioned data; O(n)
  instead of O(n²).
- **Sliding window** — contiguous-subarray/substring problems with a running metric;
  O(n). Use a deque for window min/max.
- **Prefix sums / difference arrays** — O(1) range-sum queries after O(n) prep; range
  updates.

## Recursion & backtracking
- **Recursion** — natural for tree/divide-and-conquer problems. Watch stack depth;
  convert to iteration + explicit stack if depth can be large.
- **Backtracking** — systematic search of combinatorial spaces (permutations, subsets,
  constraint problems like N-Queens/Sudoku). Prune early; exponential worst case, so
  bound the input.

## Divide and conquer
Split → solve subproblems → combine (merge sort, quickselect, fast exponentiation).
Analyze with the Master Theorem (`complexity.md`).

## Greedy
Make the locally optimal choice each step. **Only correct when the problem has the
greedy-choice property + optimal substructure** (interval scheduling, Huffman,
Dijkstra, MST). If a counterexample exists, greedy is wrong — use DP.

## Choosing
- Match to **input size** (n≤20 → exponential may be fine; n=10⁷ → need ~O(n)/O(n log n)).
- Match to **data shape** (sorted? bounded values? graph? strings?).
- Prefer the **simplest correct** approach that meets the latency budget.
- Reach for advanced algorithms only when profiling or clear size limits demand it.

## Don't
- Force graph/DP machinery onto a plain filter/aggregate.
- Reimplement stdlib primitives.
- Optimize a cold path.
