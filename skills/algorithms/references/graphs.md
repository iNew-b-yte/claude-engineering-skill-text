# Graph Algorithms

Model a problem as a graph when it's about **relationships/connectivity/paths**
(dependencies, networks, states+transitions, grids). Represent with an **adjacency
list** (sparse, typical) or **adjacency matrix** (dense / need O(1) edge checks).

## Traversal
- **BFS** — explore level by level (queue). Gives **shortest path in unweighted
  graphs**. O(V+E). Use for: shortest hops, level order, nearest, bipartite check.
- **DFS** — go deep (recursion or explicit stack). O(V+E). Use for: connectivity,
  cycle detection, topological order, path existence, flood fill, components.

## Shortest paths (weighted)
- **Dijkstra** — non-negative weights, single source. With a binary heap:
  O((V+E) log V). The default weighted shortest path.
- **Bellman-Ford** — handles **negative edges**, detects negative cycles. O(V·E).
  Slower; use only when negatives are possible.
- **Floyd-Warshall** — **all-pairs** shortest paths. O(V³). Small dense graphs only.
- **A\*** — Dijkstra + heuristic; faster when a good admissible heuristic exists
  (grids, maps).
- Unweighted shortest path → just **BFS** (don't reach for Dijkstra).

## Ordering & structure
- **Topological sort** — linear order of a DAG respecting dependencies (build order,
  task scheduling, course prereqs). Kahn's algorithm (BFS on in-degree) or DFS
  post-order. Detects cycles (no valid topo order ⇒ cycle). O(V+E).
- **Union-Find (DSU)** — dynamic connectivity, cycle detection in undirected graphs,
  Kruskal's MST. Near-O(1) per op with path compression + union by rank.
- **MST** — Kruskal (sort edges + DSU) or Prim (heap); minimum-cost spanning tree.
- **SCC** (Tarjan/Kosaraju) — strongly connected components in directed graphs.

## Choosing
- Unweighted shortest path → BFS.
- Weighted, non-negative → Dijkstra.
- Negative weights / cycle detection → Bellman-Ford.
- All pairs, small graph → Floyd-Warshall.
- Dependency ordering → topological sort.
- Connectivity/grouping/MST → union-find / Kruskal/Prim.

## Watch out
- Mark visited to avoid infinite loops on cycles.
- Recursion depth on large/deep graphs → iterative DFS.
- Adjacency matrix is O(V²) memory — infeasible for large sparse graphs.
- Many "graph" problems in app code are actually simple lookups — don't over-model.
