# CI Integration Guide

This guide walks through adding the Camp AIR eval harness to a GitHub Actions
workflow so your evals run automatically on every pull request or push.

---

## Prerequisites

- The eval harness is checked into your repository (or added as a submodule /
  copied to a subdirectory, e.g. `eval-harness/`).
- You have an Anthropic API key for model-graded scoring. If you only need
  deterministic scoring (length, keyword checks), no key is required — see
  the Mock Grader Mode section at the bottom of this guide.

---

## Step 1 — Add your Anthropic API key as a GitHub secret

1. Go to your repository on GitHub.
2. Click **Settings** > **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Name: `ANTHROPIC_API_KEY`
5. Value: your key (starts with `sk-ant-...`).
6. Click **Add secret**.

The secret is now available to workflows as `${{ secrets.ANTHROPIC_API_KEY }}`.

---

## Step 2 — Basic workflow: run a single eval file

Create `.github/workflows/eval.yml` in your repository:

```yaml
name: Eval

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  eval:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: eval-harness/package-lock.json

      - name: Install dependencies
        working-directory: eval-harness
        run: npm install

      - name: Run summarizer eval
        working-directory: eval-harness
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run eval -- --file examples/summarizer-eval.ts --ci

      - name: Upload eval results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: eval-results
          path: eval-harness/results/
```

The `--ci` flag causes the process to exit with code 1 if any cases fail,
which marks the workflow step (and the overall check) as failed.

The `if: always()` on the upload step ensures results are saved even when
the eval step fails — useful for debugging which cases broke.

---

## Step 3 — Running multiple eval files in one workflow

Use a matrix strategy to run several eval files in parallel:

```yaml
name: Eval Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  eval:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false        # continue running other evals even if one fails
      matrix:
        eval-file:
          - examples/summarizer-eval.ts
          - examples/multi-turn-eval.ts
          - my-evals/customer-support-eval.ts  # add your own here

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: eval-harness/package-lock.json

      - name: Install dependencies
        working-directory: eval-harness
        run: npm install

      - name: Run ${{ matrix.eval-file }}
        working-directory: eval-harness
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run eval -- --file ${{ matrix.eval-file }} --ci

      - name: Upload results for ${{ matrix.eval-file }}
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: results-${{ strategy.job-index }}
          path: eval-harness/results/
```

With `fail-fast: false` each eval runs to completion regardless of whether
another matrix job failed. This gives you a complete picture across all evals
in a single workflow run.

---

## Step 4 — Filtering by tag in CI

You can run only a subset of cases using `--tags`. This is useful for
separating fast smoke tests from slower edge-case suites:

```yaml
- name: Smoke tests (happy-path only)
  working-directory: eval-harness
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: npm run eval -- --file examples/summarizer-eval.ts --tags happy-path --ci

- name: Edge case suite
  working-directory: eval-harness
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: npm run eval -- --file examples/summarizer-eval.ts --tags edge-case --ci
```

---

## Interpreting CI failure output

When a workflow step fails because `--ci` exited with code 1, expand the step
log in GitHub Actions to see the result table:

```
Running eval: summarizer-eval (5 cases)

  CASE ID     STATUS   GRADERS                                         DURATION
  case-001    PASS     length+topic: PASS, model-graded: 0.9 PASS      342ms
  case-002    PASS     length+topic: PASS, model-graded: 0.8 PASS      289ms
  case-003    FAIL     length+topic: FAIL (length 412/400 chars)        301ms
  case-004    PASS     length+topic: PASS, model-graded: 0.7 PASS      318ms
  case-005    PASS     length+topic: PASS, model-graded: 0.6 PASS      892ms

Results: 4/5 passed (80%)
Written to: results/summarizer-eval-2026-03-21T14-22-10.json
```

The GRADERS column shows exactly which grader failed and why. In this example
`case-003` failed because the output was 412 characters, exceeding the 400-char
limit defined in the dataset.

Download the `eval-results` artifact for the full JSON file, which includes the
complete model output for every case.

---

## Running without an API key

The `modelGradedGrader` requires `ANTHROPIC_API_KEY` to be set. If the key is
absent, model-graded cases will **fail** with a visible message:

```
model-graded: 0.0 FAIL  [MOCK] No ANTHROPIC_API_KEY set — model-graded scoring skipped. Set API key to enable.
```

This is intentional — a missing key is surfaced as a failure so CI pipelines
do not silently skip coverage. If you want to run only the deterministic graders
(length, keyword checks) without spending API credits, remove `modelGradedGrader`
from your eval's graders array for that CI step and rely solely on deterministic
checks. Always ensure the full grader suite (including model-graded) runs in at
least one workflow step where the key is available.

---

## Tips

- Pin your Node version to 20 or higher. The harness uses `tsx` to run TypeScript
  directly. Node 18+ is required; Node 20 is recommended.
- Cache `node_modules` using `cache: "npm"` on the setup-node action to speed
  up subsequent runs.
- Store the `results/` directory as an artifact so you can track eval scores
  over time even when the step passes.
- Consider adding a threshold check: use `--ci` and design your dataset so that
  a regression in model quality causes a real case to fail.
