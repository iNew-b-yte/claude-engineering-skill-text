---
name: frontend
description: Design frontend architecture — component structure, client vs server state, data fetching and caching, rendering strategy (CSR/SSR/SSG/streaming), forms, accessibility, performance, optimistic UI, and error/loading states. Use when building UI features or structuring a frontend app. Prefer the simplest architecture compatible with the app; avoid unnecessary client-side complexity.
---

# Frontend Architecture

Build the simplest UI architecture that meets the product's needs. Most frontend
complexity is self-inflicted — over-abstracted components, unnecessary global state,
and premature performance work. Match the framework's idioms and the existing app.

## State: the central decision
Classify each piece of state and store it in the right place — **most bugs come from
putting state in the wrong bucket:**
- **Server state** (data from the API) — use a data-fetching/caching library (React
  Query/SWR/RTK Query). It handles caching, revalidation, loading/error, dedup. **Do
  not** hand-roll this in global state — server cache ≠ client state.
- **URL state** (filters, tab, page, selected id) — keep in the URL. Shareable,
  back-button-friendly, survives reload. Underused.
- **Local component state** — UI-only, ephemeral (input value, open/closed). Keep it as
  local as possible; lift only when genuinely shared.
- **Global client state** (auth/session, theme, cross-cutting UI) — a small store
  (Zustand/Context/Redux). Keep it minimal; global state is the biggest complexity sink.

## Component design
- Compose small, focused components; prefer composition over deep prop-drilling
  (composition/context, not a prop passed through 6 levels).
- Separate presentational from data/container concerns where it aids testing/reuse —
  but don't over-fragment tiny UIs.
- Keep components pure where possible; isolate side effects (data fetching, subscriptions).
- Reuse comes from the design system/shared components — check for an existing component
  before building a new one.

## Rendering strategy (pick per route/content)
- **CSR** — app-shell/SPA behind auth; interactive dashboards. Slower first paint, no
  SEO by default.
- **SSR** — dynamic, personalized, SEO-relevant pages; freshness per request.
- **SSG / static export** — content that's the same for everyone; fastest, cacheable
  on a CDN.
- **Streaming / progressive** — large pages where you want fast first paint + progressive
  hydration.
Choose by freshness, personalization, SEO, and latency needs — not by default.

## Correctness & UX essentials
- **Always handle loading, empty, and error states** — not just the happy path. This is
  the most common gap.
- **Forms** — a library (react-hook-form) + schema validation (Zod) shared with the
  backend contract where possible; validate on the client for UX but never trust it for
  security (server re-validates).
- **Optimistic UI** — update immediately then reconcile, for high-latency actions;
  always define the rollback on failure.
- **Accessibility is not optional** — semantic HTML, labels, keyboard navigation, focus
  management, adequate contrast, ARIA only when semantic HTML can't express it. Bake it
  in, don't retrofit.

## Performance (measure first — see `performance`)
- Biggest wins: **code-split / lazy-load** routes and heavy components; reduce
  **bundle size** (audit deps, tree-shake); avoid shipping data/render work the user
  doesn't need.
- Virtualize long lists; memoize only measured-expensive renders (don't sprinkle memo
  everywhere — it has its own cost and can mask real issues).
- Optimize images (format/size/lazy), fonts, and third-party scripts (often the
  heaviest cost).
- Core Web Vitals (LCP/CLS/INP) reflect real user experience — profile with real
  devices/network.

## Decision rules
- Follow the existing app's patterns, framework idioms, and design system first.
- Reach for global state / a new abstraction only when local/URL/server state can't
  express the need.
- Don't add a state library, a render mode, or a memoization layer without a concrete
  problem it solves.

## Anti-patterns
- Server data duplicated into global state and manually synced.
- Everything in one global store; prop-drilling avoided via a giant context.
- Missing loading/error/empty states.
- Premature `memo`/`useMemo`/`useCallback` everywhere with no measurement.
- Inaccessible custom widgets (div-buttons, no keyboard support).
- Huge bundles from un-audited dependencies and un-split routes.
