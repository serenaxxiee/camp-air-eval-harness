---
name: eval-generator
description: Generates eval test cases from an eval suite plan (output of /eval-suite-planner) or a plain-English agent description. Outputs a Copilot Studio test set table and valid JSON for the Camp AIR eval harness.
---

## Purpose

This skill generates concrete eval test cases — with realistic inputs, expected outputs, and evaluation method configurations. It is the second step in the eval lifecycle: plan → **generate** → run → interpret.

**Primary mode**: If the conversation already contains output from `/eval-suite-planner`, use that plan's scenario table, evaluation methods, quality signals, and tags as the blueprint. Generate one test case per row in the plan.

**Fallback mode**: If no plan exists in the conversation, accept a plain-English agent description and generate test cases from scratch (6-8 cases minimum).

## Instructions

When invoked as `/eval-generator` (with or without additional input):

### Step 1 — Detect input mode

Check the conversation history for output from `/eval-suite-planner`. Look for the scenario plan table (a markdown table with columns: #, Scenario Name, Scenario ID, Category, Tag, Evaluation Methods).

- **Plan found**: Use it as the blueprint. Say: "Generating test cases from your eval suite plan (X scenarios)." Generate one test case per row.
- **No plan, but user provides an agent description**: Generate from scratch. Say: "Generating eval scenarios for: [agent task in your own words]." If the description is fewer than two sentences or doesn't mention success criteria, ask exactly one clarifying question, then wait.
- **No plan and no description**: Say: "I need either an agent description or a plan from `/eval-suite-planner`. Run `/eval-suite-planner <your agent description>` first for the best results, or give me a description and I'll generate directly."

### Step 2 — Generate test cases

**When generating from a plan:** Match each scenario row exactly — use its Scenario Name, Tag, and Evaluation Methods. Translate the evaluation methods into the right expected fields and test configurations.

**When generating from scratch (no plan):**
- 6-8 total scenarios
- At least 2 happy-path / core business cases
- At least 2 edge cases (empty input, long input, ambiguous input, malformed input)
- At least 1 adversarial case (prompt injection, out-of-scope request, policy violation attempt)
- Fill remaining with whatever gives the most signal for this agent

### Output — produce both formats

**Format A — Copilot Studio Test Set Table**

This is the primary output. Produce a markdown table matching the Copilot Studio test set format:

| # | Question | Expected Response | Test Method | Pass Score |
|---|---|---|---|---|
| 1 | [realistic user input] | [expected answer, or leave blank for General Quality] | General Quality | — |
| 2 | [realistic user input] | [expected answer for comparison] | Compare Meaning | 50 |
| 3 | [realistic user input] | [keywords to check] | Keyword Match (All) | — |

Map the evaluation methods from the plan (or from your analysis) to Copilot Studio's 7 test methods:
- **General Quality** — use when testing response quality, tone, completeness (no expected response needed)
- **Compare Meaning** — use when the meaning matters but exact wording doesn't (set pass score, default 50)
- **Tool Use** — use when testing if specific tools/topics fired (list expected tools)
- **Keyword Match** — use for must-include or must-not-include checks (list keywords, specify All or Any)
- **Text Similarity** — use when phrasing matters (set pass score)
- **Exact Match** — use for classification labels or structured outputs
- **Custom** — use for domain-specific criteria (write evaluation instructions and labels)

Rules for inputs:
- Every `Question` must be a realistic input the agent would receive in production — specific, not a placeholder
- Every `Expected Response` must be concrete and testable — never vague
- For General Quality, leave Expected Response blank (the LLM judge evaluates without one)
- For Keyword Match, put the required keywords in Expected Response
- For adversarial cases, the Expected Response should describe what the agent should NOT do

**Format B — Camp AIR Harness JSON**

After the Copilot Studio table, output a valid JSON array for the Camp AIR eval harness:

```json
[
  {
    "id": "case-001",
    "input": { "text": "..." },
    "expected": {
      "must_include_topic": "..."
    },
    "tags": ["happy-path"]
  }
]
```

Rules for JSON:
- `id`: `"case-001"` through `"case-0XX"` (zero-padded, sequential)
- `input.text`: Same as the Question from the Copilot Studio table
- `expected`: Map evaluation methods to harness fields:
  - Keyword Match → `must_include_topic` and/or `must_not_contain`
  - Compare Meaning → include reference text via `must_include_topic`
  - General Quality → use `max_length` or let the `modelGradedGrader` handle it
  - Exact Match → `classification`
  - Tool Use → note in tags (harness doesn't have native tool-use grading)
- `tags`: Use tags from the plan if available. Otherwise: `"happy-path"`, `"edge-case"`, `"adversarial"`, `"capability"`, `"safety"`.

**Scenario ID preservation:** When generating from a plan, use the Scenario ID from the plan as the Camp AIR JSON `id` field (e.g., `"id": "BP-IR-01"` instead of `"case-001"`). This preserves traceability back to the Eval Scenario Library.

**Important — save your plan before running evals:** Copilot Studio CSV exports do not include scenario categories, tags, or IDs. Before running evals in Copilot Studio, save the scenario plan table from `/eval-suite-planner` as a reference document. You will need it when interpreting results with `/eval-result-interpreter`.

### Step 3 — Reviewer notes

After both formats, write exactly three items:

1. **Most likely to fail:** Name the case number and explain why it's the hardest case in this set.
2. **One more scenario to consider:** Describe an additional scenario worth adding manually — something that didn't fit but is realistic.
3. **Mandatory reminder:** "Review every generated scenario. Delete any that would not occur in production. AI-generated test cases need human review before use."

---

### Behavior rules

- Each case must be independently understandable — no references to "the previous case"
- JSON must be syntactically valid (no trailing commas, no comments)
- When using a plan, generate exactly the scenarios listed — do not add or remove scenarios without saying why
- The Copilot Studio table is the primary output (users will copy it into Copilot Studio); the Camp AIR JSON is secondary (for workshop participants using the harness)
- Make inputs realistic and specific: use names, dates, product references, and context that a real user would provide

---

## Example invocations

```
/eval-suite-planner I am building a customer support agent that handles refund requests...
[planner outputs scenario plan table]
/eval-generator
← generates from the plan above, one case per scenario row

/eval-generator I am building a meeting notes agent that takes a raw transcript and produces a structured summary with action items.
← generates from scratch, 6-8 cases

/eval-generator
← no plan in conversation, no description provided — asks user to provide input
```
