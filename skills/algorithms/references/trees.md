# Trees & Hierarchical Structures

## Binary search tree (BST)
Ordered: left < node < right. Operations O(h) where h = height. **Balanced** → O(log
n); **degenerate** (sorted inserts into a plain BST) → O(n). In practice use a
**self-balancing** variant.

## Balanced trees (use the stdlib version)
- **Red-Black tree** — most common backing for ordered maps/sets (Java `TreeMap`,
  C++ `std::map`). Good all-round; fewer rotations on insert/delete.
- **AVL tree** — more strictly balanced → faster lookups, more rotations on write.
  Read-heavy workloads.
- **B-tree / B+ tree** — high fan-out, disk/page friendly; the backbone of **database
  and filesystem indexes**. B+ tree keeps values in leaves linked for range scans.
  This is why a DB index makes range queries fast — see `database` skill.

You rarely implement these; you *use* them (ordered map/set, DB index). Know their
properties to reason about performance.

## Heaps / priority queues
Complete binary tree with heap order. `peek` O(1), `push`/`pop` O(log n). Backs:
- top-k (size-k heap, O(n log k)), Dijkstra/Prim, scheduling, median-of-stream (two
  heaps), merge k sorted lists.

## Tries (prefix trees)
Keys stored along paths; operations O(L) in key length L, independent of number of
keys. Use for autocomplete, prefix matching, dictionary/IP-routing. Memory-heavy;
compress (radix/PATRICIA trie) if needed.

## Specialized (know they exist)
- **Segment tree / Fenwick (BIT)** — range queries + point/range updates in O(log n)
  (range sum/min/max). Competitive-programming and analytics windows.
- **Interval tree** — overlapping-interval queries.
- **Suffix tree/array** — substring search over large text.

These are advanced; in application code they're rarely warranted. Reach for them only
with a measured need and bounded scope.

## Traversal
- **DFS:** pre-order (copy/serialize), in-order (BST → sorted output), post-order
  (delete/aggregate children first).
- **BFS / level-order:** queue-based; level-by-level processing.
- Watch recursion depth on deep trees — convert to iterative with an explicit stack.

## Choosing
- Ordered keys + range queries → balanced BST / DB index (B-tree).
- Repeated min/max, top-k → heap.
- Prefix/dictionary → trie.
- Range aggregates with updates → segment/Fenwick tree (only if truly needed).
