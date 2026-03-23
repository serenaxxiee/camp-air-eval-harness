---
name: eval-generator
description: Generates eval test cases from an eval suite plan (output of /eval-suite-planner) or a plain-English agent description. Outputs a Copilot Studio test set table, a CSV file for import, and a docx report for human review.
---

## Purpose

This skill generates concrete eval test cases — with realistic inputs, expected outputs, and evaluation method configurations. It is the second step in the eval lifecycle: plan → **generate** → run → interpret.

**Primary mode**: If the conversation already contains output from `/eval-suite-planner`, use that plan's scenario table, evaluation methods, quality signals, and tags as the blueprint. Generate one test case per row in the plan.

**Fallback mode**: If no plan exists in the conversation, accept a plain-English agent description and generate test cases from scratch (6-8 cases minimum).

**Authoritative source:** The CSV import format and testing methods in this skill MUST follow the latest guidance at [MS Learn: Generate and import test sets for agent testing](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create#create-a-test-set-file-to-import). Before generating CSV output, if WebFetch is available, fetch that page to confirm the current column headers, testing method values, and any format constraints. If the page shows different columns or method names than what is documented below, use the page's version — the MS Learn page is always authoritative.

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

| # | Question | Expected Response | Testing Method |
|---|---|---|---|
| 1 | [realistic user input] | [expected answer, or leave blank for General quality] | General quality |
| 2 | [realistic user input] | [expected answer for comparison] | Compare meaning |
| 3 | [realistic user input] | [keywords to check] | Keyword match |

Map the evaluation methods from the plan (or from your analysis) to Copilot Studio's 5 importable testing methods (per [MS Learn: Create a test set file to import](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create#create-a-test-set-file-to-import)):

- **General quality** — use when testing response quality, tone, completeness (no expected response needed)
- **Compare meaning** — use when the meaning matters but exact wording doesn't (requires expected response)
- **Similarity** — use when phrasing matters, tests text similarity between actual and expected (requires expected response)
- **Exact match** — use for classification labels or structured outputs where the response must match exactly (requires expected response)
- **Keyword match** — use for must-include checks (put the required keywords in Expected Response)

Additional test methods available in Copilot Studio UI (cannot be set via CSV import — must be configured after import):
- **Tool Use** — tests whether specific tools/topics fired
- **Custom** — domain-specific criteria with custom evaluation instructions and labels

Rules for inputs:
- Every `Question` must be a realistic input the agent would receive in production — specific, not a placeholder
- Every `Expected Response` must be concrete and testable — never vague
- For General quality, leave Expected Response blank (the LLM judge evaluates without one)
- For Keyword match, put the required keywords in Expected Response
- For adversarial cases, the Expected Response should describe what the agent should NOT do
- Each question can be up to 1,000 characters including spaces

### Output files

After displaying the test cases in conversation, generate two files:

**A. Copilot Studio Import CSV (.csv)**

Generate a CSV file ready for direct import into Copilot Studio Evaluation. The CSV must follow the exact format specified by Microsoft ([MS Learn reference](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-agent-evaluation-create#create-a-test-set-file-to-import)):

```csv
Question,Expected response,Testing method
"How do I wash my Premium Hand-Wash T-shirt?","Use cold or room temperature water below 30°C with neutral detergent. Gently press-wash, do not rub. Rinse with cold water. Do not wring — press with a towel to remove moisture.","Compare meaning"
"Can I put this t-shirt in the washing machine?","","Keyword match"
"What are your store hours?","","General quality"
```

Rules for the CSV:
- **Three columns exactly:** `Question`, `Expected response`, `Testing method`
- Column headers must be in the first row, in this exact order
- Values containing commas or quotes must be enclosed in double quotes
- Any double quotes inside a value must be escaped as `""`
- `Testing method` must be one of exactly: `General quality`, `Compare meaning`, `Similarity`, `Exact match`, `Keyword match`
- Expected response is optional for import but required for Compare meaning, Similarity, Exact match, and Keyword match tests
- The file can contain up to 100 questions
- Save as .csv or .txt format

**B. Eval Test Set Report (.docx)**

Generate a formatted .docx document for human review using the `/docx` skill. Contents:

- **Title:** "Eval Test Set: [Agent Name]" (derive agent name from the plan or description)
- **Plan summary:** Brief summary of the eval suite plan this was generated from (or the agent description if generated from scratch)
- **Test cases:** Each test case formatted clearly with:
  - Scenario name
  - Input / question
  - Expected response
  - Testing method
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
- Testing method values in the CSV must exactly match one of the 5 allowed values — do not use variations like "KeywordMatch" or "Keyword Match (All)"

---

## Example invocations

```
/eval-suite-planner I am building a customer support agent for a premium t-shirt brand. It answers questions about product care (washing, drying, ironing), sizing, warranty, and escalates issues it cannot resolve.
[planner outputs scenario plan table]
/eval-generator
← generates from the plan above, one case per scenario row

/eval-generator I am building a customer support agent that helps customers with product care instructions, sizing questions, and warranty claims for a premium hand-wash t-shirt product.
← generates from scratch, 6-8 cases

/eval-generator
← no plan in conversation, no description provided — asks user to provide input
```
