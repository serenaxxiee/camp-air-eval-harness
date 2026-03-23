---
name: eval-generator
description: Generates eval test cases from an eval suite plan (output of /eval-suite-planner) or a plain-English agent description. Outputs a Copilot Studio test set table, a CSV file for import, and a docx report for human review.
---

## Purpose

This skill generates concrete eval test cases — with realistic inputs, expected outputs, and evaluation method configurations. It is the second step in the eval lifecycle: plan → **generate** → run → interpret.

**Primary mode**: If the conversation already contains output from `/eval-suite-planner`, use that plan's scenario table, evaluation methods, quality signals, and tags as the blueprint. Generate one test case per row in the plan.

**Fallback mode**: If no plan exists in the conversation, accept a plain-English agent description and generate test cases from scratch (6-8 cases minimum).

## Instructions

When invoked as `/eval-generator` (with or without additional input):

### Step 1 — Detect input mode

Check the conversation history for output from `/eval-suite-planner`. Look for the scenario plan table (a markdown table with columns: #, Scenario Name, Category, Tag, Evaluation Methods).

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

### Output

**Copilot Studio Test Set Table (displayed in conversation)**

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

### Output files

After displaying the test cases in conversation, generate two files:

**A. Copilot Studio Import CSV (.csv)**

Generate a CSV file ready for direct import into Copilot Studio Evaluation. Use the `/xlsx` skill to write the file, or write a CSV file directly with proper quoting. Format:

```csv
"question","expectedResponse"
"How do I return an item?","The agent should explain the return policy..."
"I want to speak to a manager NOW","The agent should de-escalate and offer to connect to a human agent..."
```

Rules for the CSV:
- Two columns only: `question` and `expectedResponse`
- Every value must be enclosed in double quotes
- Any double quotes inside a value must be escaped as `""`
- `question` maps to the Question column from the table
- `expectedResponse` maps to the Expected Response column from the table (leave empty string `""` for General Quality rows)

**B. Eval Test Set Report (.docx)**

Generate a formatted .docx document for human review using the `/docx` skill. Contents:

- **Title:** "Eval Test Set: [Agent Name]" (derive agent name from the plan or description)
- **Plan summary:** Brief summary of the eval suite plan this was generated from (or the agent description if generated from scratch)
- **Test cases:** Each test case formatted clearly with:
  - Scenario name
  - Input / question
  - Expected response
  - Test method
  - Pass score (if applicable)
- **Reviewer notes:** The three reviewer notes from Step 3 below

**Important — save your plan before running evals:** Copilot Studio CSV exports do not include scenario categories or tags. Before running evals in Copilot Studio, save the scenario plan table from `/eval-suite-planner` as a reference document. You will need it when interpreting results with `/eval-result-interpreter`.

### Step 3 — Reviewer notes

After the table and before generating the output files, write exactly three items:

1. **Most likely to fail:** Name the case number and explain why it's the hardest case in this set.
2. **One more scenario to consider:** Describe an additional scenario worth adding manually — something that didn't fit but is realistic.
3. **Mandatory reminder:** "Review every generated scenario. Delete any that would not occur in production. AI-generated test cases need human review before use."

---

### Behavior rules

- Each case must be independently understandable — no references to "the previous case"
- When using a plan, generate exactly the scenarios listed — do not add or remove scenarios without saying why
- The Copilot Studio table is the primary output displayed in conversation; the CSV and docx files are generated afterward
- Make inputs realistic and specific: use names, dates, product references, and context that a real user would provide
- The CSV must be valid and importable into Copilot Studio without manual editing

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
