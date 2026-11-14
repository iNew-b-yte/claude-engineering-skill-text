# Observability

You cannot operate what you cannot see. Observability = being able to answer "what is
happening and why" from the system's outputs, including questions you didn't
anticipate. Non-optional for anything running in production.

## The three pillars
- **Logs** — discrete, timestamped events. Use **structured** logs (key-value/JSON),
  not free text — they're queryable. Include a **correlation/trace id** on every line
  so you can stitch a request across services. **Never log secrets or PII** (mask).
  Log at the right level; noisy logs hide signal.
- **Metrics** — cheap numeric time series for aggregate health and alerting. Track the
  **RED** method for services (Rate, Errors, Duration) and **USE** for resources
  (Utilization, Saturation, Errors). Use histograms for latency (so you can see p99,
  not just averages — averages lie).
- **Traces** — follow one request across services/spans; find where latency and errors
  originate in a distributed call graph. Propagate trace context end to end.

## SLIs, SLOs, error budgets
- **SLI** — a measured indicator of user-visible health (success rate, p99 latency,
  freshness).
- **SLO** — the target (e.g. 99.9% of requests < 300ms over 30 days).
- **Error budget** — 1 − SLO. It's the allowed unreliability; spend it on shipping.
  Budget exhausted → slow down and stabilize. This aligns reliability with velocity.
- Alert on **SLO burn / symptoms users feel**, not on every internal metric — page on
  "users are being hurt," not "CPU is 80%."

## Good alerting
- Alert on symptoms (error rate, latency, budget burn), not causes.
- Every page must be **actionable** and urgent; everything else is a dashboard/ticket.
- Tune out flapping and noise — alert fatigue makes real pages get ignored.
- Attach a runbook link to each alert.

## Practical guidance
- Instrument at boundaries (inbound requests, outbound calls, queue consume) — that's
  where most questions get answered.
- Emit a trace id at the edge and propagate it; put it in error responses so users can
  report it.
- Prefer high-cardinality structured events for debugging novel issues; pre-aggregated
  metrics for cheap, always-on health.
- Build the dashboard and alerts **with** the feature, not after the first incident.

## Judgment
- Observability is proportional to operational risk: a critical payment path warrants
  full traces + tight SLOs; an internal tool needs basic logs + error alerting.
- Don't drown in telemetry — a few well-chosen SLIs beat a thousand unwatched metrics.
