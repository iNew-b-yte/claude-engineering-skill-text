---
name: ship
description: Run a pre-merge/pre-deploy validation gate before declaring work done — tests, type-check, lint, build, migrations, security, config/secrets, docs, and a clean reviewed diff. Explicitly invoke before finishing a task, opening a PR, or deploying. Never report a step as passing unless it was actually executed and observed.
---

# Ship — Pre-Delivery Validation

A gate to run before calling work "done." The whole value is honesty: **every check is
either actually executed and observed to pass, or reported as not-run/failed.** Fabricated
green checks are worse than no checks — they destroy trust and ship bugs.

## The checklist

Run the ones that apply to the project; skip (and say you skipped) the ones that don't.

- [ ] **Tests** — run the relevant suite (focused first, then broader). Observe the
      result. Report pass/fail counts. If any fail or were skipped, say so.
- [ ] **Type check** — run the type checker (tsc, mypy, etc.); zero new errors.
- [ ] **Lint / format** — run the linter/formatter; no new violations.
- [ ] **Build** — the project builds/compiles cleanly. A passing test suite doesn't
      guarantee a clean production build (different config).
- [ ] **Migrations** — new migrations apply cleanly, are reversible, and are safe on
      production data (expand/contract; no locking surprises). See `database`.
- [ ] **Security** — no secrets committed; input validation and authz on new paths; deps
      have no new known CVEs. See `security`.
- [ ] **Config & env vars** — new config documented and defaulted; app fails fast on
      missing required config; no secrets in YAML/code.
- [ ] **Docs** — README/API docs/changelog updated if behavior or interfaces changed.
- [ ] **Diff review** — read the full diff (`git diff`). No debug prints, dead/commented
      code, stray or generated files, TODOs left dangling, or unrelated changes.
- [ ] **Accidental files / secrets** — nothing that shouldn't be committed (`.env`,
      keys, large artifacts, local config).

## How to run it
1. Detect the toolchain (package.json scripts, Makefile, pom.xml, pyproject, CI config)
   — use the project's own commands, not assumed ones.
2. Run each applicable check and **capture the actual output.**
3. On failure: **stop and diagnose the root cause** — do not bypass with
   `--skip`/`--no-verify`/`-DskipTests` or by commenting out the failing check. A
   failing gate means the work isn't done.
4. Summarize honestly: what ran, what passed, what failed, what was skipped and why.

`scripts/preflight.sh` auto-detects common toolchains and runs what's present — use it
as a starting point, but read its output; a script exiting 0 is not a substitute for
reading results.

## The cardinal rule
> Do not claim any validation step passed unless it was actually executed and its
> success observed.

If you couldn't run something (no command, environment limitation), say that plainly —
never imply it passed.

## Anti-patterns
- Reporting "all tests pass / build is green" without running them.
- Bypassing a failing check to get to done.
- Skipping the diff read and shipping debug code or secrets.
- "Should work" as a substitute for verification.
