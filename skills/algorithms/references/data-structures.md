# Data Structures — pick by dominant operation

Choose the structure whose common operations match what your code does most. The
table gives typical complexities; constant factors and cache behavior matter too.

| Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| Array / dynamic array | O(1) | O(n) | O(1)* amortized end / O(n) mid | O(n) | Best cache locality; append-cheap |
| Linked list | O(n) | O(n) | O(1) at node | O(1) at node | Poor cache; rarely worth it vs arrays |
| Stack (LIFO) | — | — | O(1) | O(1) | DFS, undo, expression eval, backtracking |
| Queue / deque | — | — | O(1) | O(1) | BFS, buffering, sliding window (deque) |
| Hash table (map/set) | — | O(1) avg / O(n) worst | O(1) avg | O(1) avg | Unordered; membership & dedup; watch collisions/hashing cost |
| Balanced BST / tree map | O(log n) | O(log n) | O(log n) | O(log n) | **Ordered** keys, range queries, floor/ceil |
| Binary heap / priority queue | peek O(1) | O(n) | O(log n) | pop O(log n) | Top-k, Dijkstra, scheduling |
| Trie | — | O(L) | O(L) | O(L) | Prefix search, autocomplete; L = key length |
| Graph (adj list) | — | — | O(1) edge | O(deg) | Sparse graphs; adj matrix for dense/O(1) edge check |
| Union-Find (DSU) | — | ~O(α(n)) | ~O(α(n)) | — | Connectivity, cycle detection, Kruskal |
| Bloom filter | — | O(k) | O(k) | — | Probabilistic membership; false positives, no false negatives; memory-tiny |

## Choosing quickly
- **Need membership / dedup / count-by-key?** → hash set/map (unless you need order).
- **Need sorted order, ranges, nearest key?** → balanced tree / sorted structure.
- **Need repeated min/max / top-k?** → heap.
- **Need prefix matching?** → trie.
- **Need connectivity / grouping?** → union-find.
- **Need LIFO/FIFO processing?** → stack/queue.
- **Default container?** → dynamic array; it's cache-friendly and often fastest in
  practice even where O() looks worse.

## Practical notes
- **Cache locality** beats theoretical O() at small/medium n: arrays often outrun
  linked lists and node-based trees. Measure before assuming.
- **Hashing cost** is real — hashing long keys repeatedly can dominate. Ordered
  structures avoid hashing but pay log n.
- **Concurrency:** shared mutable structures need synchronization or a concurrent
  variant; prefer immutable or per-thread structures to avoid contention.
- Prefer **stdlib** implementations; they're tuned and correct.
