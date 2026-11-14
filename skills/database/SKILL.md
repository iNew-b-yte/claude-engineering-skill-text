---
name: database
description: Design and change data models and queries — relational modeling, normalization/denormalization, indexing, transactions, isolation levels, locking, migrations, replication, partitioning, and query performance. Use when designing a schema, writing a migration, diagnosing a slow query, or choosing a storage engine. Never make casual destructive schema changes.
---

# Database & Data Modeling

The data model is the most durable, most consequential part of a system — harder to
change than code and often a one-way door. Design it deliberately; change it carefully.

## Before any schema change (mandatory)
1. **Inspect the existing schema** and how it's actually used (queries, code, reports).
2. **Assess production-data implications** — row counts, locks, downtime of the change.
3. **Plan the migration** — expand/contract (add new → backfill → switch reads/writes →
   drop old) so it's reversible and zero-downtime.
4. **Backward compatibility** — old and new code may run concurrently during deploy.
5. **Indexes** — will the new access pattern need one? Will the change lock the table?
6. **Rollback plan** — how to undo without data loss.

**Never** casually `DROP`/rename a column/table or run an unbounded `UPDATE`/`DELETE`
on production. Destructive changes are one-way doors — treat them as such.

## Relational modeling
- **Normalize first** (3NF): each fact in one place → no update anomalies, cheap
  writes, integrity. This is the correct default.
- **Denormalize deliberately** only for a measured read problem, accepting the
  consistency cost (duplicated data must be kept in sync). Don't pre-denormalize.
- Use the right **types** and **constraints** (NOT NULL, UNIQUE, FK, CHECK) — the DB is
  your last line of data integrity; enforce invariants there, not only in app code.
- Keys: prefer stable surrogate keys; be careful exposing sequential IDs (enumeration).

## Indexing (the #1 query-performance lever)
- Index columns used in **WHERE, JOIN, ORDER BY**. An index turns a table scan into a
  seek.
- **Composite index column order matters** — leftmost-prefix rule; order by
  selectivity/usage. `(a,b)` helps `WHERE a` and `WHERE a AND b`, not `WHERE b` alone.
- **Covering index** (includes selected columns) avoids table lookups.
- Indexes **cost writes** and storage — each write updates every index. Don't
  over-index; drop unused ones.
- Verify with the query planner (`EXPLAIN/EXPLAIN ANALYZE`) — don't guess.

## Transactions, isolation, locking
- Wrap multi-statement invariants in a transaction; keep transactions **short** (long
  transactions hold locks and bloat).
- **Isolation levels:** read-committed (default) → repeatable-read → serializable.
  Higher prevents more anomalies (dirty/non-repeatable reads, phantoms, **write skew**)
  at concurrency cost. Use serializable/explicit locks only where an invariant needs it.
- **Optimistic concurrency** (version column) scales better than pessimistic locks for
  low-contention updates; use row locks (`SELECT ... FOR UPDATE`) for hot contended rows.
- Beware **deadlocks** — acquire locks in a consistent order.

## N+1 and query hygiene
- The most common real-world DB performance bug is **N+1 queries** (a query per row in
  a loop). Batch/join/eager-load instead. Check this before blaming the DB.
- Select only needed columns; paginate; avoid `SELECT *` in hot paths.

## SQL vs NoSQL
- **Relational** — default. Strong consistency, transactions, flexible queries,
  integrity. Handles far more scale than assumed.
- **Document** — flexible/denormalized aggregates, schema-varied data.
- **Key-value** — simple lookups at scale, caching, sessions.
- **Wide-column / time-series / search / graph** — specific access patterns.
Choose by **access pattern and consistency need**, not hype. Polyglot only when one
store genuinely can't serve a pattern.

## Anti-patterns
- Destructive changes without expand/contract + backup.
- Missing indexes on filtered/joined columns (or over-indexing write-heavy tables).
- Enforcing invariants only in app code, not in the schema.
- N+1 queries; `SELECT *`; unbounded result sets.
- Long-running transactions; storing money as float (use integer minor units/decimal).
- EAV / "one giant JSON blob" as a substitute for modeling.
