---
name: engineering-architect
description: Analyze a software engineering task, classify the problem, surface constraints and risks, weigh options and tradeoffs, and choose the appropriate design principles, patterns, algorithms, and system-design techniques — including deciding what NOT to introduce. Use when a task has meaningful architectural, scalability, design, algorithmic, data-model, API-contract, or cross-cutting engineering implications (not for trivial edits).
---

# Engineering Architect

The orchestration skill. It does **not** implement everything itself — it frames
the problem correctly and routes to specialized knowledge. Its output is a
decision with justification, not an essay.

## When this activates

Any task where a wrong structural choice is expensive to reverse: new subsystems,
data-model or API-contract changes, auth/shared-state changes, performance or
scaling work, or "how should I build X" questions. **Skip it for trivial/local
edits** — see complexity levels in `~/.claude/CLAUDE.md`.

## Workflow

Reason roughly in this order — stop early when the task doesn't warrant more:

```
Requirement → Context → Constraints → Existing architecture →
Problem classification → Risks → Options → Tradeoffs →
Architecture → Design → Algorithms/Data structures →
Implementation → Testing → Security → Performance → Review → Validation
```

1. **Understand the requirement.** What must actually be true when done? What
   does "success" mean? Separate stated wants from underlying need.
2. **Read the existing system first.** Conventions, analogous code, why current
   abstractions exist. Existing architecture constrains the answer (§35 of spec /
   `~/.claude/CLAUDE.md`). Do this before proposing anything.
3. **Classify the problem** (see below) — this selects which techniques are even
   candidates.
4. **Surface constraints and risks** — scale, latency, consistency, availability,
   security, data ownership, team, ops burden, evolution.
5. **Generate options** — always include the *simplest* one that could work.
6. **Weigh tradeoffs** — use `references/tradeoffs.md`; a decision matrix when 3+
   viable options exist (`references/decision-framework.md`).
7. **Decide and route** — name which specialized skills apply and, explicitly,
   which concepts you are deliberately **not** introducing and why.

## Problem classification

- **Application dev** — CRUD, business logic, API, UI, integration, authn/authz, jobs
- **Architecture** — monolith / modular monolith / microservices / event-driven / serverless / DDD / clean / hexagonal
- **Algorithmic** — search, sort, graph, trees, hashing, DP, greedy, recursion, concurrency, streaming
- **Performance** — CPU / memory / DB / network / rendering / complexity / I/O / caching
- **Reliability** — failure handling, retries, idempotency, circuit breakers, replication, failover, recovery
- **Quality** — testing, debugging, refactoring, review, security, maintainability

## Routing map

| Concern | Skill |
|---|---|
| SOLID, OOP, coupling/cohesion, abstraction | `engineering-principles` |
| Design patterns, pattern selection, clean arch, DDD | `software-design` |
| Data structures, algorithms, complexity | `algorithms` |
| Scale, distribution, consistency, caching, messaging, reliability, observability | `system-design` |
| REST/RPC/GraphQL, versioning, pagination, contracts | `api-design` |
| Schema, indexes, transactions, migrations | `database` |
| Handlers/services/repos, jobs, backend structure | `backend` |
| Components, state, rendering, data fetching | `frontend` |
| Threats, authz, injection, secrets | `security` |
| Bottlenecks, measurement, optimization | `performance` |
| Test strategy & levels | `testing` |
| Root-causing a defect | `debugging` |
| Behavior-preserving restructuring | `refactoring` |
| Critiquing a diff | `code-review` |
| Commits, PRs | `git` |
| Pre-merge/pre-deploy validation | `ship` |

## Decision rules

- Prefer the **simplest architecture** that satisfies the actual requirements.
- Do not jump from requirement straight to implementation when the choice has
  architectural consequences — but do exactly that when it doesn't.
- Every proposed abstraction must name the concrete change/failure it prevents.
- Distinguish required vs optional vs future-scaling components. Don't build the
  future one now.
- Existing project conventions and local `CLAUDE.md` **override** these defaults.

## Anti-patterns

- Introducing a pattern/layer/service because it's "best practice" with no problem.
- Producing a large architecture document for a small change.
- Designing for imagined future scale with no evidence.
- Ignoring the existing codebase and imposing a template structure.
- Claiming a tradeoff analysis while inventing the numbers (justify them).

## Output shape (for real decisions)

```
Problem · Constraints · Options · Recommendation · Why · Tradeoffs · Implementation impact
```

Keep it proportional. For an ADR-worthy decision use `references/architecture-analysis.md`.

## References

- `references/decision-framework.md` — the full decision process + decision matrix + ADR template
- `references/tradeoffs.md` — the tradeoff axes and how to reason about them
- `references/architecture-analysis.md` — how to read and evaluate an existing architecture
- `references/pattern-selection.md` — the "should I use a pattern at all" gate
