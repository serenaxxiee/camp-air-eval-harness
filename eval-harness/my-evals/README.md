# my-evals/

This is your personal workspace for the workshop. Files here are gitignored via the root `.gitignore` — your personal experiments won't be committed.

## Start here

`my-agent-eval.ts` is ready to run right now — no editing required:

```bash
npm run eval -- --file my-evals/my-agent-eval.ts
```

It contains a working customer support triage agent eval that loads 6 starter
cases from `my-evals/datasets/my-eval-cases.json` (happy-path x2, edge-case x2,
adversarial x1, capability x1) and applies `autoGrader()`, which automatically
applies the right sub-grader for each `expected` field in each case — no manual
wiring needed. Use it as your base: edit the system prompt, swap in your own
dataset cases, adjust the `expected` fields, then re-run.

## Files in this directory

| File | Purpose |
|------|---------|
| `my-agent-eval.ts` | Pre-populated starting point. Edit this. |
| `datasets/my-eval-cases.json` | Starter dataset: 6 cases (happy-path x2, edge-case x2, adversarial x1, capability x1). Edit these. |
| `datasets/` | Put your dataset JSON files here (one file per eval). |

## Starting from scratch instead

Copy the blank template and work through the TODO comments:

```bash
cp examples/starter-eval.ts my-evals/my-second-eval.ts
npm run eval -- --file my-evals/my-second-eval.ts
```

## Model-graded scoring with criteria

Tip: Add a `criteria` field to any expected block to enable model-graded scoring via autoGrader. Example: `"criteria": "Response is helpful and on-topic"`

```json
{
  "id": "case-002",
  "input": { "text": "How do I cancel my subscription?" },
  "expected": {
    "max_length": 400,
    "criteria": "Response is helpful and on-topic"
  },
  "tags": ["happy-path"]
}
```

The `criteria` field is evaluated by Claude (requires ANTHROPIC_API_KEY). Deterministic graders like `max_length` and `must_include_topic` always run without an API key.

## Workshop shortcuts

```bash
npm run eval:workshop                  # Run your eval
npm run eval:workshop:verbose          # Show full model output — use this to understand WHAT your agent is saying
npm run eval:workshop:happy-path       # Run only happy-path cases
npm run eval:workshop:adversarial      # Run only adversarial cases
```

Verbose mode is important for understanding *why* cases pass or fail. A score can look fine in the summary table while the actual output reveals the agent is on the wrong track. Always check a few raw outputs before treating a run as a meaningful signal.

## Type-checking before running

```bash
npm run check
```

This catches TypeScript errors in your eval file without running any API calls.

## Validating your dataset

```bash
npm run validate:workshop
```

This checks that your `my-eval-cases.json` is well-formed — correct field names, array structure, at least one expected field per case — without making any API calls. Run this after pasting `/eval-generator` output to catch any JSON errors before running the full eval.
