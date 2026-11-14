---
name: debugging
description: Find the root cause of a defect systematically — reproduce, gather evidence, form and test hypotheses, isolate the cause, fix it, and add a regression test. Use when investigating a bug, failure, crash, or unexpected behavior. Do not change code on a plausible-sounding guess without evidence.
---

# Debugging

Debugging is a search for the root cause guided by **evidence**, not by guessing. The
cardinal sin is changing code because a hypothesis *sounds* right — that fixes symptoms
by luck, masks the real bug, and often adds new ones. Understand *why* before you fix.

## The workflow

```
Observe symptom → Reproduce reliably → Collect evidence → Form hypotheses →
Test hypotheses (one variable at a time) → Isolate root cause → Fix →
Add regression test → Verify (and check for siblings)
```

1. **Observe precisely.** What exactly is wrong? Exact error, stack trace, inputs,
   environment, frequency (always / intermittent / specific conditions). Vague symptom
   → vague investigation.
2. **Reproduce.** A reliable repro is most of the battle. Find the minimal input/steps
   that trigger it. If it's intermittent, find what varies (data, timing, concurrency,
   environment). Can't reproduce → you can't confirm a fix.
3. **Collect evidence.** Read the actual stack trace/logs (top of your code in the
   trace = start there). Add targeted logging, use a debugger, inspect state at the
   failure point, check recent changes (`git log`/blame — what changed near when it
   started?). Follow the data.
4. **Form hypotheses** ranked by likelihood given the evidence. "The value is null
   here because X isn't set when Y runs" — specific and testable, not "maybe it's a
   race condition somewhere."
5. **Test one at a time.** Change one variable, observe, keep or discard. Binary-search
   the problem space (bisect commits, comment out halves, check inputs vs outputs at
   midpoints) to localize fast. Don't change five things at once.
6. **Confirm root cause.** You've found it when you can *explain the mechanism* and
   *predict* how changing X changes the symptom. If you can't explain why the fix
   works, you haven't found the cause.
7. **Fix at the root**, not the symptom. Then check whether the same bug pattern exists
   elsewhere (sibling bugs).
8. **Add a regression test** that fails before the fix and passes after — proves the
   fix and prevents recurrence (see `testing`).
9. **Verify** in a realistic scenario, not just the minimal repro.

## Techniques
- **Read the error properly** — the message and stack usually point very close to the
  cause; don't skim it.
- **Bisect** — `git bisect` for "it worked before"; binary search in code/data for
  where good becomes bad.
- **Reduce** — shrink to a minimal reproducing case; the bug often becomes obvious.
- **Rubber-duck / state the assumptions** — bugs hide in a false assumption; list them
  and verify each.
- **Trust evidence over memory** — verify what the code actually does/returns, don't
  assume.

## Common root-cause families
Off-by-one/boundary; null/undefined/uninitialized; wrong assumption about input or an
API's behavior; state/ordering/concurrency (races, stale cache); type coercion;
environment/config difference; error swallowed upstream; time zone / encoding; the
change is in a dependency, not your code.

## Judgment
- Intermittent/"heisenbug" → suspect concurrency, ordering, external state, or timing.
- "Works on my machine" → suspect environment, config, data, or version differences.
- If the fix works but you don't know why → keep going; a mystery fix is a future bug.
- Time-box wide searches, then step back and question assumptions/reproduction.

## Anti-patterns
- Changing code on a guess without reproducing or confirming the cause.
- Fixing the symptom (swallowing the error, patching the output) not the cause.
- Changing multiple things at once so you can't tell what worked.
- Shipping without a regression test for the bug.
- Ignoring the stack trace / logs and speculating instead.
