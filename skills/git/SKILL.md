---
name: git
description: Practice good version-control hygiene — focused atomic commits, meaningful messages, clean branches, safe rebasing, well-structured PRs, and reviewing diffs before committing. Use when committing, branching, preparing a PR, or cleaning up history. Commit or push only when the user asks.
---

# Git & Delivery Hygiene

Version control is a communication tool for your future self and your reviewers. Aim
for a history that's easy to read, review, revert, and bisect.

## Commits
- **Atomic & focused** — one logical change per commit. It should be independently
  understandable and revertible. Don't bundle a feature, a refactor, and a formatting
  sweep together.
- **Separate refactoring from behavior changes** (see `refactoring`) — distinct commits.
- **Review your own diff before committing** (`git diff --staged`). Catch debug prints,
  commented-out code, stray files, secrets, unrelated changes. Stage deliberately (avoid
  reflexive `git add -A`).
- **Message format:** a concise imperative subject (~50 chars, "Add X", "Fix Y"), a
  blank line, then a body explaining **why** (the what is in the diff) — context,
  reasoning, tradeoffs, links to issues. Reference the requirement/doc when relevant.

## Branches
- Short-lived feature branches off the mainline; descriptive names.
- Rebase/merge from mainline regularly to avoid divergence.
- Don't commit directly to a protected/default branch — branch first (unless the
  project's convention is otherwise; follow it).

## Rebasing (rewriting history) — safely
- Rebase/squash to tidy **local, unpushed, unshared** history — fine and useful.
- **Never rewrite shared/published history** others may have based work on (force-push
  to a shared branch) unless explicitly coordinated. Prefer `--force-with-lease` over
  `--force` when you must.
- Interactive rebase (`-i`) is unavailable in non-interactive/agent environments —
  don't invoke it there.

## Pull requests
- **One coherent change per PR**, sized to be reviewable (small PRs get better reviews).
- Description: what changed, **why**, how to test/verify, risks, and any follow-ups.
  Cite the requirement/doc/ticket.
- Ensure CI is green; include tests; call out anything that needs reviewer attention.
- No unrelated changes riding along — they hide the real change and complicate revert.

## Discipline
- **Commit or push only when the user asks** — don't assume.
- Never commit secrets, credentials, or large/generated/local artifacts — check
  `.gitignore`; if a secret was committed, treat it as compromised (rotate).
- Never bypass hooks (`--no-verify`) or skip signing unless the user explicitly asks —
  if a hook fails, fix the cause.
- Follow the project's commit-message/PR conventions and any required trailers over
  these defaults.

## Anti-patterns
- Giant mixed commits ("misc fixes"); vague messages ("update", "fix stuff", "wip").
- `git add -A` without reviewing what got staged.
- Force-pushing shared branches; rewriting published history.
- Committing secrets/build artifacts/local config.
- Unrelated changes bundled into a feature PR.
