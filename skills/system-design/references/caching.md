# Caching

Caching trades **freshness and complexity** for **latency and load reduction**. Add it
against a *measured* read bottleneck — never by default. "There are only two hard
things in CS: cache invalidation and naming things" is a warning, not a joke.

## Where caches live
- **Client / browser** — HTTP cache headers, local storage.
- **CDN / edge** — static assets, cacheable API responses near users.
- **In-process** — fastest, but per-instance (inconsistent across nodes; memory-bound).
- **Distributed (Redis/Memcached)** — shared across instances; a network hop; the
  common app cache.
- **Database** — buffer pool, query cache, materialized views.

## Patterns
- **Cache-aside (lazy):** app checks cache; on miss, load from DB and populate. Most
  common. Stale risk until TTL/invalidced; first request pays the miss.
- **Read-through:** cache library loads on miss transparently.
- **Write-through:** write to cache and DB together — consistent, slower writes.
- **Write-behind (write-back):** write to cache, flush to DB async — fast writes, risk
  of loss on crash. Use carefully.

## Invalidation (the hard part)
- **TTL** — simplest; accept staleness up to the TTL. Pick TTL from how stale the data
  may safely be.
- **Explicit invalidation / write-through** — evict/update on write; correct but more
  coupling and race-prone.
- **Versioned keys** — include a version/hash in the key so new data uses a new key;
  old entries age out. Avoids explicit deletes.

## Failure modes to design for
- **Stampede / thundering herd** — many misses hit the DB at once when a hot key
  expires. Mitigate: request coalescing/single-flight, jittered TTLs, early/async
  refresh, locks.
- **Stale data** — ensure the staleness window is acceptable for that data.
- **Cache penetration** — misses for non-existent keys hammer the DB; cache negatives
  (short TTL) or use a bloom filter.
- **Hot keys** — one key overwhelms a node; replicate or local-cache it.
- **Cold start / eviction storms** — after restart or mass eviction, the DB gets
  hammered; warm critical caches.

## Judgment
- First reduce the load: better queries, indexes, pagination, fewer round-trips. A
  cache is a band-aid over an expensive read — sometimes the right one, sometimes
  masking a fixable query.
- Cache the expensive, frequently-read, rarely-changed data. Don't cache cheap or
  highly-volatile data.
- Every cache introduces a consistency question — answer "how stale is OK?" explicitly
  before adding it.
- Measure hit rate. A low-hit-rate cache is pure overhead + a consistency risk.
