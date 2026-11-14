# claude-engineering-skills

A set of 17 software-engineering [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) for **Claude Code**. They give Claude a consistent, senior-engineer way of working on architecture, design, data, APIs, security, testing, debugging, performance and shipping. Each skill also says when **not** to add complexity.

```bash
npx claude-engineering-skills
```

This one command installs every skill into `~/.claude/skills`, so the skills work in every project on your machine.

---

## Skills included

| Skill | Use it for |
| --- | --- |
| `engineering-architect` | Analyzing a non-trivial task: classify the problem, surface risks, weigh tradeoffs, pick techniques, and decide what *not* to introduce |
| `engineering-principles` | SOLID, OOP, coupling/cohesion, abstraction, and composition vs inheritance |
| `software-design` | GoF and application patterns (Repository, CQRS, Saga, Outbox, Circuit Breaker), clean architecture, DDD |
| `system-design` | Scale, reliability, caching, messaging, consistency, observability, and "how would you design X" questions |
| `algorithms` | Data-structure and algorithm choice, plus Big-O analysis |
| `api-design` | REST, RPC and GraphQL contracts, pagination, idempotency, versioning, errors, rate limits |
| `backend` | Handlers, services, repositories, validation, jobs, transactions |
| `frontend` | Components, client vs server state, data fetching, rendering strategy, accessibility |
| `database` | Schema design, indexing, transactions, isolation, safe migrations, query tuning |
| `security` | Auth, input validation, injection, CSRF, SSRF, IDOR, secrets, supply chain |
| `testing` | Choosing test levels, behavior-focused tests, regression coverage |
| `debugging` | Finding root causes from evidence: reproduce, form hypotheses, isolate, fix, add a regression test |
| `performance` | Measuring before optimizing, finding the real bottleneck, then re-measuring |
| `refactoring` | Small, behavior-preserving steps behind a test safety net |
| `code-review` | Reviewing diffs for defects and risk, ordered by priority |
| `git` | Atomic commits, clear messages, safe rebases, well-structured PRs |
| `ship` | A pre-merge or pre-deploy gate that runs tests, type-check, lint, build, an audit and a secret scan (includes `scripts/preflight.sh`) |

Run `npx claude-engineering-skills list` to see every skill's full description and whether it is installed.

---

## Installation

Requires **Node.js 18.17+** and **Claude Code**.

### Option 1: Global install (recommended)

Use this to make the skills available in every project:

```bash
npx claude-engineering-skills install
```

Skills are copied to:

| OS | Location |
| --- | --- |
| macOS / Linux | `~/.claude/skills/<skill-name>/` |
| Windows | `%USERPROFILE%\.claude\skills\<skill-name>\` |

If you set `CLAUDE_CONFIG_DIR`, skills go to `$CLAUDE_CONFIG_DIR/skills` instead.

### Option 2: Project install (shared with your team)

Run this from the root of a repository:

```bash
npx claude-engineering-skills install --project
```

This copies the skills into `./.claude/skills/`. Commit that folder so everyone who uses Claude Code in the repo gets the same skills.

### Option 3: Install only some skills

```bash
npx claude-engineering-skills install --only security,testing,debugging
```

### Option 4: Install the package itself

If you'd rather pin a version in a project:

```bash
npm install --save-dev claude-engineering-skills
npx claude-engineering-skills install --project
```

### Option 5: Manual copy

Copy any folder from [`skills/`](./skills) into `~/.claude/skills/` (global) or `<repo>/.claude/skills/` (project). Each skill is self-contained: one `SKILL.md`, plus optional `references/` and `scripts/` folders.

After any install, **restart Claude Code** (or open a new session) so it picks up the new skills.

---

## Using the skills

### Automatic (default)

You don't need to do anything special. Claude Code reads each skill's `description` and loads the full skill when your request matches it. For example:

| You say | Claude loads |
| --- | --- |
| "Why does this endpoint return 500 intermittently?" | `debugging` |
| "Design a URL shortener that handles 10k req/s" | `system-design` (and `engineering-architect`) |
| "Add a `PATCH /orders/:id` endpoint" | `api-design`, `backend` |
| "This query is slow on 5M rows" | `database`, `performance` |
| "Add login with JWT" | `security`, `backend` |
| "Clean up this 600-line service class" | `refactoring`, `engineering-principles` |

Skills load progressively. Only the short descriptions sit in context until a skill is needed, and `references/*.md` files are read only when the skill points to them. Installing all 17 therefore costs very little context.

### Explicit

To force a specific skill, call it by name as a slash command:

```text
/ship
/security review the changes in src/auth
/engineering-architect we need to add multi-tenant support to the billing service
```

Or just ask in plain language: *"Use the debugging skill to find out why the worker hangs."*

### Running the ship preflight script yourself

The `ship` skill bundles a validation script that auto-detects Node, Java, Python, Go and Rust projects. It runs the checks that exist and reports which ones it skipped:

```bash
bash ~/.claude/skills/ship/scripts/preflight.sh            # current directory
bash ~/.claude/skills/ship/scripts/preflight.sh path/to/repo
```

On Windows, run it from Git Bash or WSL.

---

## CLI reference

```text
npx claude-engineering-skills [command] [options]

Commands:
  install      Copy the skills into a Claude skills folder (default command)
  uninstall    Remove the skills this package installed
  list         List the bundled skills and whether they are installed

Options:
  -g, --global       Target ~/.claude/skills (default)
  -p, --project      Target ./.claude/skills in the current directory
  -d, --dir <path>   Target a custom skills directory
  -o, --only <list>  Comma-separated skill names
  -f, --force        Overwrite skills that already exist in the target
  -n, --dry-run      Print what would happen without changing anything
  -h, --help         Show help
  -v, --version      Show the version
```

The installer never overwrites a skill folder that already exists unless you pass `--force`. Your local edits are safe by default.

---

## Updating

```bash
npx claude-engineering-skills@latest install --force
```

`--force` replaces each skill folder with the new version. **This discards any local edits you made to those skills**, so if you customized one, back it up or leave it out with `--only`.

## Uninstalling

```bash
npx claude-engineering-skills uninstall             # global
npx claude-engineering-skills uninstall --project   # project
```

This removes only the folders whose names match skills in this package. Other skills you have installed are left alone.

---

## Customizing

Every skill is plain Markdown, so you can edit it to match your team's conventions after installing. The frontmatter at the top of each `SKILL.md` controls when Claude uses the skill:

```markdown
---
name: testing
description: Decide what and how to test ... Use when adding tests, changing tested code, or deciding a test strategy.
---
```

- `name` is the slash-command name (`/testing`).
- `description` tells Claude when to load the skill. Make it more or less specific to change how often the skill triggers.

> **Note on `code-review`:** Claude Code has a built-in `/code-review` command. If the two clash in your setup, rename this skill's folder and its `name:` field (for example to `eng-code-review`).

---

## Troubleshooting

- **Skills don't show up:** restart Claude Code, then run `npx claude-engineering-skills list` to confirm the files exist where Claude looks for them.
- **"already exists" when installing:** the skill is already there. Add `--force` to replace it.
- **Using a custom config location:** set `CLAUDE_CONFIG_DIR`, or pass `--dir <path>`.

## License

[MIT](./LICENSE)
