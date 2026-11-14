#!/usr/bin/env bash
# preflight.sh — auto-detect the project toolchain and run the validation gate.
#
# Usage:  bash preflight.sh [project-dir]   (defaults to current directory)
#
# Philosophy: run the checks that exist, report exactly what ran and what didn't.
# A green exit here is a STARTING point — read the output. Do not treat a passing
# script as a substitute for reading results (see SKILL.md).
#
# Exit code: 0 only if every check that RAN passed. Skipped checks don't fail it,
# but they are reported so nothing is silently assumed.

set -uo pipefail
cd "${1:-.}" || { echo "cannot cd to ${1:-.}"; exit 2; }

FAIL=0
RAN=()
SKIPPED=()

hr() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

# Run a check: run "$@"; record pass/fail; mark FAIL on non-zero.
check() {
  local label="$1"; shift
  hr "$label"
  echo "\$ $*"
  if "$@"; then
    RAN+=("PASS  $label")
  else
    RAN+=("FAIL  $label")
    FAIL=1
  fi
}

skip() { SKIPPED+=("$1"); }

# ---- Node / pnpm / yarn / npm -------------------------------------------------
if [ -f package.json ]; then
  PM="npm"; RUN="npm run"
  if [ -f pnpm-lock.yaml ] && have pnpm; then PM="pnpm"; RUN="pnpm";
  elif [ -f yarn.lock ] && have yarn; then PM="yarn"; RUN="yarn"; fi
  has_script() { grep -q "\"$1\"[[:space:]]*:" package.json; }

  has_script test        && check "test ($PM)"        $RUN test        || skip "node: no test script"
  has_script typecheck   && check "typecheck ($PM)"   $RUN typecheck   || \
    { [ -f tsconfig.json ] && have npx && check "typecheck (tsc)" npx tsc --noEmit || skip "node: no typecheck"; }
  has_script lint        && check "lint ($PM)"        $RUN lint        || skip "node: no lint script"
  has_script build       && check "build ($PM)"       $RUN build       || skip "node: no build script"
  have npm && check "audit (npm, high+)" npm audit --audit-level=high || skip "node: npm audit unavailable"
else
  skip "node: no package.json"
fi

# ---- Java / Maven / Gradle ----------------------------------------------------
if [ -f pom.xml ]; then
  MVN="mvn"; [ -x ./mvnw ] && MVN="./mvnw"; [ -f ./mvnw.cmd ] && MVN="./mvnw.cmd"
  check "maven verify" $MVN -q verify
elif [ -f build.gradle ] || [ -f build.gradle.kts ]; then
  GRADLE="gradle"; [ -x ./gradlew ] && GRADLE="./gradlew"
  check "gradle build" $GRADLE build
else
  skip "jvm: no pom.xml/build.gradle"
fi

# ---- Python -------------------------------------------------------------------
if [ -f pyproject.toml ] || [ -f setup.py ] || [ -f requirements.txt ]; then
  have ruff   && check "ruff"   ruff check .            || skip "python: no ruff"
  have mypy   && check "mypy"   mypy .                  || skip "python: no mypy"
  have pytest && check "pytest" pytest -q               || skip "python: no pytest"
else
  skip "python: no project files"
fi

# ---- Go -----------------------------------------------------------------------
if [ -f go.mod ]; then
  check "go build" go build ./...
  check "go vet"   go vet ./...
  check "go test"  go test ./...
else
  skip "go: no go.mod"
fi

# ---- Rust ---------------------------------------------------------------------
if [ -f Cargo.toml ]; then
  check "cargo test"  cargo test
  check "cargo clippy" cargo clippy -- -D warnings
else
  skip "rust: no Cargo.toml"
fi

# ---- Secret / accidental-file scan (best effort) ------------------------------
hr "diff & secret scan (best effort)"
if have git && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Staged files:"; git diff --cached --name-only
  if git diff --cached | grep -nEi '(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|password[[:space:]]*=|secret[[:space:]]*=|api[_-]?key[[:space:]]*=)' ; then
    echo "!! possible secret in staged diff — REVIEW MANUALLY"; RAN+=("FAIL  secret-scan"); FAIL=1
  else
    RAN+=("PASS  secret-scan (no obvious secrets in staged diff)")
  fi
else
  skip "git: not a repo / git unavailable — review diff manually"
fi

# ---- Summary ------------------------------------------------------------------
hr "SUMMARY"
printf '%s\n' "${RAN[@]:-  (no checks ran)}"
if [ "${#SKIPPED[@]}" -gt 0 ]; then
  echo; echo "Skipped (not applicable / tool missing — verify manually if relevant):"
  printf '  - %s\n' "${SKIPPED[@]}"
fi
echo
if [ "$FAIL" -eq 0 ]; then
  echo "All checks that RAN passed. Remember: read the output; skipped checks are not passed."
else
  echo "One or more checks FAILED. Do not ship — diagnose the root cause (do not bypass)."
fi
exit "$FAIL"
