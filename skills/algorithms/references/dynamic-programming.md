# Dynamic Programming

DP solves problems by combining solutions to overlapping subproblems, storing each
subproblem's result once. It applies **only** when the problem has:
1. **Optimal substructure** — the optimal solution is built from optimal solutions to
   subproblems, and
2. **Overlapping subproblems** — the same subproblems recur (otherwise it's just
   divide-and-conquer).

If subproblems don't overlap → divide-and-conquer. If a greedy choice is provably
optimal → greedy (simpler). Use DP when greedy fails and brute force is exponential.

## Recognizing DP
Signals: "count the number of ways", "min/max cost/length", "can we reach/partition",
choices with consequences, and a naive recursion that recomputes the same states.
Classic families: knapsack, longest common subsequence/edit distance, coin change,
longest increasing subsequence, matrix-path/grid, interval DP, DP on trees, bitmask DP.

## Two implementations
- **Top-down (memoization)** — write the natural recursion, cache results by state.
  Easiest to derive; computes only needed states; recursion-depth risk.
- **Bottom-up (tabulation)** — fill a table in dependency order iteratively. No
  recursion overhead; often allows **space optimization** (keep only the last row/two).

## Method
1. **Define the state** — the minimal parameters identifying a subproblem (this is
   the hard part; get it right).
2. **Recurrence** — express a state's answer via smaller states.
3. **Base cases.**
4. **Order** — memoize (any order) or tabulate (topological order of dependencies).
5. **Answer** — which state(s) hold the result.
6. **Optimize space** — drop dimensions you no longer need.

## Complexity
Usually **(number of states) × (work per state)**. E.g. edit distance: O(m·n) states,
O(1) each → O(m·n) time, reducible to O(min(m,n)) space.

## Judgment
- DP is often unnecessary in application code — most real problems aren't
  combinatorial optimization. Don't pattern-match every loop to DP.
- If n is tiny and bounded, plain recursion/brute force may be clearer and fine.
- Memoization is the lowest-friction way to speed up a correct exponential recursion —
  reach for it before rewriting as tabulation.
- Getting the **state definition** wrong is the usual failure; verify base cases and a
  small example by hand before trusting it.
