---
name: algorithms
description: Choose appropriate data structures and algorithms, analyze time/space complexity, and reason about whether algorithmic optimization is warranted. Covers arrays through graphs/tries/heaps, search/sort/graph/DP/greedy algorithms, and Big-O analysis. Use when selecting a data structure, designing an algorithm, analyzing complexity, or deciding whether a hot path needs a better algorithm. Do NOT force sophisticated algorithms into ordinary application code.
---

# Algorithms & Data Structures

The goal is correct, maintainable code with adequate performance — not the fanciest
algorithm. Most application code is I/O-bound, not CPU-bound; the biggest wins are
usually a better data structure or one fewer database round-trip, not a cleverer
algorithm.

## Selection first, cleverness last

Choosing the right **data structure** usually determines the algorithm and the
complexity for free. Ask:
- What operations dominate? (lookup, insert, delete, ordered iteration, range query,
  min/max, membership)
- How big is the input, and is it bounded?
- How often does this run, and is it on a hot path?
- What are the memory and cache constraints?

Then pick the structure whose dominant-operation complexity fits. See
`references/data-structures.md`.

## Complexity, in context

`O(n²)` is not automatically bad. Before optimizing, answer (`references/complexity.md`):
- How large is n, realistically? Is it bounded (e.g. ≤ 100)?
- Hot path or one-off? How frequent?
- Is the simple version safer/clearer, and is the win measurable?

A simple `O(n²)` over n≤100 beats a subtle `O(n log n)` you'll misimplement.

## Algorithm families

`references/algorithms.md` — search, sort, sliding window, two pointers, prefix sums,
recursion/backtracking, divide-and-conquer, greedy. `references/graphs.md` — BFS,
DFS, Dijkstra, Bellman-Ford, Floyd-Warshall, topological sort, union-find.
`references/trees.md` — BST, balanced trees, heaps, tries, segment/Fenwick.
`references/dynamic-programming.md` — memoization, tabulation, recognizing DP.

## Decision rules

- Reach for the stdlib structure/algorithm before hand-rolling. It's tested and fast.
- Match algorithm to input size, data characteristics, latency budget, frequency,
  and maintainability — not to elegance.
- In app code, prefer the clear solution; optimize only a measured bottleneck
  (`performance` skill).
- Know the dominant cost. Often it's the DB query or network call, not the loop —
  don't micro-optimize the loop and ignore the N+1 query.

## Anti-patterns

- Importing a graph algorithm for a problem that's a simple filter.
- Premature micro-optimization of cold paths.
- Reinventing sort/heap/hashmap the language already provides.
- Choosing an array and doing repeated linear scans where a hash set is O(1).
- Ignoring worst-case blowups (unbounded recursion, quadratic string building).

## References
`references/data-structures.md` · `references/algorithms.md` · `references/complexity.md`
· `references/graphs.md` · `references/trees.md` · `references/dynamic-programming.md`
