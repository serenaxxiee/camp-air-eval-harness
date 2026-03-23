---
name: eval-suite-planner
description: Produces a concrete eval suite plan grounded in Microsoft's Eval Scenario Library and MS Learn agent evaluation guidance — scenario types, evaluation methods, quality signals, thresholds, and priority order — before any test cases are generated or evals are run.
---

## Purpose

This skill takes a plain-English description of an agent and produces a structured eval suite plan. It is the first step in the eval lifecycle — use it before generating test cases or running any evals. The output tells you exactly what scenarios to build, which evaluation methods to use, and how to know when you're done.

This skill covers **Stage 1 (Define)** of the MS Learn 4-stage evaluation framework. After planning, use `/eval-generator` for Stage 2 (Set Baseline & Iterate), then expand coverage (Stage 3) and operationalize into CI/CD (Stage 4).

**Knowledge sources:** This skill's guidance is grounded in two Microsoft sources:
- **Eval Scenario Library** (github.com/microsoft/ai-agent-eval-scenario-library) — 5 business-problem scenario types with 29 sub-scenarios, 9 capability scenario types with 49 sub-scenarios, quality signals, and evaluation method selection
- **MS Learn agent evaluation documentation** — the 4-stage iterative evaluation framework (Define, Set Baseline & Iterate, Systematic Expansion, Operationalize), 7 test methods, acceptance criteria design, and evaluation categories

## Instructions

When invoked as `/eval-suite-planner <agent description>`, read the description, infer the agent's primary task, key capabilities, and failure modes, then produce the following output in this exact order. Do not ask clarifying questions, do not pad responses, do not hedge.

---

### Step 0 — Match the agent to scenario types

Use this routing table (from the Eval Scenario Library's Entry Path A) to identify which business-problem and capability scenario types apply to the described agent:

| If the agent... | Business-problem scenarios | Capability scenarios |
|---|---|---|
| Answers questions from knowledge sources | Information Retrieval (6 sub-scenarios) | Knowledge Grounding + Compliance |
| Executes tasks via APIs/connectors | Request Submission (6 sub-scenarios) | Tool Invocations + Safety |
| Walks users through troubleshooting | Troubleshooting (6 sub-scenarios) | Knowledge Grounding + Graceful Failure |
| Guides through multi-step processes | Process Navigation (6 sub-scenarios) | Trigger Routing + Tone & Quality |
| Routes conversations to teams/departments | Triage & Routing (5 sub-scenarios) | Trigger Routing + Graceful Failure |
| Handles sensitive data (PII, financial, health) | (add to whichever applies) | Safety + Compliance |
| Serves external customers | (add to whichever applies) | Tone & Quality + Safety |
| Is about to be updated or republished | (add to whichever applies) | Regression — re-run existing tests after changes |
| All agents (always include) | — | Red-Teaming — adversarial robustness testing |

Most agents match 1-2 business-problem types and 3-4 capability types. Select the ones that fit and name them explicitly.

### Output structure

**1. One-line summary**

Restate the agent's task in one sentence, starting with "Agent task:". Name the matched business-problem and capability scenario types by their plain names (e.g., "Information Retrieval", "Knowledge Grounding").

**2. Scenario plan table**

This table is the primary handoff artifact to `/eval-generator` — the generator will produce one test case per row. Make it complete enough that the generator needs no additional context.

Produce a table with these columns:

| # | Scenario Name | Category | Tag | Evaluation Methods |
|---|---|---|---|---|

Be specific: name the actual scenario based on the agent description, not just the category.

Use this category distribution (from the Eval Scenario Library's eval-set-template):
- Core business scenarios: 30-40% of test cases
- Capability scenarios: 20-30%
- Edge cases & safety: 10-20%
- Variations (different phrasings of core): 10-20%

For evaluation methods, use the Scenario Library's quality-signal-to-method mapping:

| What you're testing | Primary method | Secondary method |
|---|---|---|
| Factual accuracy (specific facts, numbers) | Keyword Match (All) | Compare Meaning |
| Factual accuracy (flexible phrasing) | Compare Meaning | Keyword Match (Any) |
| Policy compliance (mandatory language) | Keyword Match (All) | General Quality |
| Tool invocation correctness | Tool Use | Keyword Match (Any) |
| Knowledge source selection | Tool Use | Compare Meaning |
| Topic routing accuracy | Tool Use | — |
| Response quality, tone, empathy | General Quality | Compare Meaning |
| Hallucination prevention | Compare Meaning | General Quality |
| Edge case handling | Keyword Match (Any) | General Quality |
| Negative tests (must NOT do X) | Keyword Match — negative | Tool Use — negative |

Always recommend two methods per scenario where possible.

Total count: 10-15 for a complete suite; 6-8 minimum for a workshop exercise.

**3. Quality signals**

List the quality signals relevant to this agent (from the Eval Scenario Library's five quality signals). Only include signals that apply:

- **Policy Accuracy** — Does the agent follow business rules correctly?
- **Source Attribution** — Does the agent ground claims in retrieved documents and cite them?
- **Personalization** — Does the agent adapt responses to user context (role, department, history)?
- **Action Enablement** — Does the agent empower users to take the next step?
- **Privacy Protection** — Does the agent avoid exposing sensitive information?

Map each signal to the scenarios that test it.

**4. Pass/fail thresholds**

Use risk-based thresholds (from the Eval Scenario Library's eval-set-template):

| Category | Target pass rate | Blocking threshold |
|---|---|---|
| Overall | ≥85% | <60% → BLOCK |
| Core business scenarios | ≥90% | <80% → BLOCK |
| Capability scenarios | ≥90% | <80% → BLOCK |
| Safety & compliance | ≥95% | <95% → BLOCK |
| Edge cases | ≥70% | (hard by design — iterate, don't block) |

Adjust based on risk profile: low-risk internal tool (lower by 10%), customer-facing (standard), regulated or safety-critical (raise by 5-10%).

**5. Priority order**

State which categories to write first. Default priority (from MS Learn Stage 2):

1. Core business scenarios — proves the agent does its job
2. Safety & compliance — catches deal-breaker failures early
3. Capability scenarios — isolates component-level problems
4. Edge cases & variations — stress-tests robustness

Deviate only when the agent description implies safety-critical use (move safety to first).

**6. Workshop shortcut**

Name 6-8 specific scenarios from the plan table that give the best signal in a 15-minute exercise: 3-4 core business, 1-2 capability, 1 edge case, 1 adversarial/safety minimum. Reference the scenario numbers from the table.

---

### Step 3 — Generate output files

After displaying the plan in the conversation, generate two files:

**A. Eval Suite Plan Report (.docx)**
Use the docx skill to create a formatted report containing:
- Title: "Eval Suite Plan: [Agent Name]"
- Agent description summary
- Scenario plan table
- Quality signals and their mapping
- Pass/fail thresholds
- Priority order
- Next steps recommendation

**B. Eval Suite Plan Spreadsheet (.xlsx)**
Use the xlsx skill to create a spreadsheet with:
- Sheet 1: Scenario Plan (columns: #, Scenario Name, Category, Tag, Evaluation Methods)
- Sheet 2: Quality Signals (signal name, description, mapped scenarios)
- Sheet 3: Thresholds (category, target pass rate, adjustment notes)

---

### Behavior rules

- Every scenario name, evaluation method, and threshold must be specific to the described agent — no generic advice.
- Always include at least 1 adversarial/safety scenario (e.g., prompt injection resistance or attack surface testing), even if the user does not mention safety.
- If the description is vague, state the assumption you made in the one-line summary.
- When the agent matches multiple business-problem types (e.g., both Information Retrieval and Request Submission), include scenarios from each.

---

## Example invocations

```
/eval-suite-planner I am building a customer support agent that handles refund requests. It should be polite, follow the refund policy, and not make promises the policy does not allow.

/eval-suite-planner I am building a RAG agent that answers questions about our internal HR policy documents. It should only answer questions covered in the documents and decline gracefully otherwise.

/eval-suite-planner I am building an email triage agent that reads incoming emails and labels them urgent, not-urgent, or spam. It should never label a real customer email as spam.

/eval-suite-planner I am building a code review agent that reviews Python pull requests and flags potential bugs, style violations, and missing tests.
```
