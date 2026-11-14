---
name: testing
description: Decide what and how to test — choosing the right test level (unit/integration/contract/component/e2e/load/security), testing behavior over implementation, covering regression risk and edge cases, and actually running tests before claiming they pass. Use when adding tests, changing tested code, or deciding a test strategy.
---

# Testing

Tests exist to give confidence that behavior is correct and stays correct as code
changes. Test **behavior and contracts**, not implementation details — tests coupled to
internals break on every refactor and provide false security.

## Choose the right level (test pyramid)
Favor many fast, focused tests low in the pyramid; few slow tests high up.
- **Unit** — a single function/class/module in isolation. Fast, most numerous. For
  business logic, pure functions, edge cases, algorithms.
- **Integration** — components working together across a real boundary (DB, cache,
  another module). Catches wiring/query/serialization bugs unit tests miss. Often the
  highest-value tests for backend code.
- **Contract** — verify the agreement between a provider and consumer (API/message
  schema) so services can evolve independently without breaking each other.
- **Component / UI** — a rendered component with its interactions (Testing Library:
  assert on what the user sees/does, not internal state).
- **End-to-end** — full user flow through the real system. High value, high cost/
  flakiness — keep few, cover critical journeys only.
- **Load / performance** — validate latency/throughput under realistic load (see
  `performance`).
- **Security** — authz, input validation, injection paths (see `security`).

Pick the **lowest level that gives real confidence** for the risk. Don't write an e2e
test for logic a unit test covers; don't unit-test-mock away the integration bug.

## Writing good tests
- **Test behavior, not implementation.** Assert observable outcomes/outputs/effects,
  not private methods or call counts (unless the interaction *is* the contract).
- **Arrange–Act–Assert**; one logical behavior per test; descriptive names stating the
  scenario and expectation.
- **Cover the edges:** empty/null, boundaries (0, 1, max, off-by-one), duplicates,
  concurrency, failure paths, invalid input, large input. Bugs live at edges and error
  paths, not the happy path.
- **Deterministic** — no reliance on real time, randomness, network, or ordering; inject
  clocks/seeds; control external systems with fakes/containers.
- **Mock at boundaries, sparingly.** Over-mocking tests the mocks, not the code, and
  couples tests to structure. Prefer real collaborators / test containers for
  integration; mock only external, slow, or nondeterministic dependencies.
- Prefer **fakes/stubs over heavy mock frameworks** where they give clearer tests.

## Workflow for a change
1. **Inspect existing tests** — learn the project's style/framework; find related tests.
2. **Identify regression risk** — what could this change break? Test that.
3. **Add coverage** at the right level for the new behavior and its edges.
4. **Run the focused tests**, then broader validation.
5. **Never claim tests pass without executing them and observing the result.** Report
   actual output; if something fails or was skipped, say so.

## Judgment
- Coverage % is a weak proxy — 100% coverage of trivial getters proves nothing;
  well-chosen tests of core logic and edges prove a lot. Aim for confidence, not a number.
- For a bug fix: **write a failing test that reproduces it first**, then fix (see
  `debugging`). This proves the fix and prevents regression.
- Match test investment to risk: critical/complex/edge-heavy code gets thorough tests;
  trivial glue code needs little.

## Anti-patterns
- Testing implementation details; asserting on private state or exact call sequences.
- Over-mocking until the test only exercises mocks.
- Flaky tests (time/network/order dependent) left in the suite.
- Only happy-path coverage; no error/edge tests.
- Claiming "tests pass" without running them.
- One giant e2e test as the only coverage.
