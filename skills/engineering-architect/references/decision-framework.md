# Architectural Decision Framework

## The full reasoning pass

Run this for L4/L5 changes; abbreviate for L3; skip for L1/L2.

### 1. Requirements
What must the system do? State it as verifiable outcomes, not features.

### 2. Scale (estimate, don't guess wildly)
- users / concurrent users
- requests per second (peak vs average)
- data volume (now + growth rate)
- read/write ratio
- latency budget (p50 / p99)
- geographic distribution
- concurrency

If you don't know these, say so and pick the option that is cheapest to change
later — **reversibility beats optimality under uncertainty.**

### 3. Reliability
Availability target, failure tolerance, recovery objectives (RTO/RPO), durability.

### 4. Consistency
Pick the weakest that satisfies the requirement:
strong · read-your-writes · causal · eventual · transactional.
**Do not introduce distributed-consistency mechanisms without a stated need.**

### 5. Operational complexity
Deployment, monitoring, debugging, on-call burden, infra cost, team expertise.
A design the team cannot operate is the wrong design.

### 6. Security
Authn, authz, trust boundaries, data sensitivity, attack surface, abuse cases.

### 7. Evolution
Expected changes, team size, domain boundaries, backward compatibility, migration.

## Decision matrix

Use when 3+ viable options exist. **Every cell must be justified**, not invented —
if you can't justify a rating, you haven't understood the option yet.

| Option | Complexity | Performance | Scalability | Reliability | Cost | Maintainability |
|---|--:|--:|--:|--:|--:|--:|
| A (simplest) | Low | Medium | Medium | High | Low | High |
| B | Medium | High | High | Medium | Medium | Medium |
| C | High | High | Very High | High | High | Low |

Then state the recommendation and the *one or two axes that actually decided it*.
Most decisions turn on 1–2 axes, not all six.

## Reversibility test (Bezos one-way/two-way doors)

- **Two-way door** (cheap to reverse) → decide fast, pick the simple option, move on.
- **One-way door** (expensive to reverse: data model, public API, storage engine,
  partitioning scheme, framework) → invest in analysis, prefer options that keep
  future doors open.

## ADR template (for one-way doors only)

```
# ADR-NNN: <title>

## Context
What situation forces a decision. Background, current state.

## Problem
The specific decision to be made.

## Constraints
Hard limits: scale, budget, deadline, team, compliance, existing systems.

## Options considered
- Option A — summary, pros, cons
- Option B — ...
- Option C — ...

## Decision
The chosen option.

## Why this option
The axes that decided it. What the rejected options failed on.

## Tradeoffs
What we give up. What gets harder.

## Consequences
What must now be true / built / monitored. Migration path.

## Future considerations
What would make us revisit this.
```

Do **not** write ADRs for trivial implementation details. Reserve them for
decisions that are costly to reverse and that future engineers will question.
