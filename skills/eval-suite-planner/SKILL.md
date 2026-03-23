---
name: eval-suite-planner
description: Produces a concrete eval suite plan for an agent — scenario categories, counts, graders, thresholds, and priority order — before any scenarios are generated or code is written.
---

## Purpose

This skill takes a plain-English description of an agent and produces a structured eval suite plan for it. It is the "Plan" step in the eval lifecycle — use it before writing any scenario files or running the harness. The output tells you exactly what to build, in what order, and how to know when you're done.

## Instructions

When invoked as `/eval-suite-planner <agent description>`, read the description, infer the agent's primary task, key capabilities, and failure modes, then produce the following output in this exact order. Follow these rules exactly — do not ask clarifying questions, do not pad responses, do not hedge.

---

### Output structure

**1. One-line summary**

Restate the agent's task in one sentence, starting with "Agent task:". This confirms your interpretation before the user reads the rest.

**2. Scenario category breakdown**

Produce a table with four columns: Category, Count, Tag, Rationale.

Always include these four rows, in this order:

| Category | Count | Tag | Rationale |
|---|---|---|---|
| Business-problem | 4–6 | `happy-path` | End-to-end task completion; the most important category. Covers the agent's primary job. |
| Capability | 3–5 | `capability` | Isolated ability tests (e.g., classification accuracy, retrieval precision, format compliance). |
| Edge case | 2–4 | `edge-case` | Empty input, max-length input, ambiguous phrasing, malformed structure. |
| Adversarial | 1–3 | `adversarial` | Prompt injection, out-of-scope requests, contradictions, policy violations. Always include at least 1. |

Adjust counts based on the agent description. A focused single-task agent warrants fewer capability scenarios; a multi-step pipeline warrants more. Always keep the total between 12–20 for a complete suite and note a 6–8 case workshop minimum.

Be specific: name the actual scenarios, not just the category. For example, for an email triage agent, the business-problem row should name cases like "urgent customer complaint," "routine billing inquiry," and "newsletter unsubscribe request" — not just "end-to-end task."

**3. Recommended graders**

List which harness graders to use, in this format:

- `graderName()` — which cases to apply it to, and why
- For `modelGradedGrader()`, always write out the exact criteria string to pass in (e.g., `modelGradedGrader("The response correctly classifies the email as urgent, not-urgent, or spam, and does not label a real customer email as spam.")`)

Apply this layering rule: always start with a deterministic grader (`lengthAndTopicGrader`, `keywordPresenceGrader`, `jsonOutputGrader`) when the criterion is checkable without a model. Add `modelGradedGrader` only when the criterion requires judgment (tone, relevance, completeness, absence of hallucination). Never use `modelGradedGrader` as the only grader on a case that could be checked deterministically.

**4. Pass/fail thresholds**

State an overall pass rate target for the first run. For a new eval, recommend 75–85%. If the agent has safety or policy requirements (e.g., "never label a real email as spam," "never reveal PII"), state that those cases require 100% pass rate and should trigger BLOCK if any fail. Note per-category guidance:

- Business-problem: aim for ≥80% before shipping
- Capability: aim for ≥80%
- Edge case: aim for ≥70% (these are hard by design)
- Adversarial: 100% on safety/policy checks; no exceptions

**5. Priority order**

State which category to write first, second, third, fourth, and explain why in one sentence each. The default priority is:

1. Business-problem — proves the agent does its job
2. Capability — isolates what breaks when business-problem cases fail
3. Edge case — stress-tests the happy path
4. Adversarial — confirms safety before shipping

Deviate from this order only when the agent description implies a safety-critical use case (e.g., medical, financial, legal), in which case adversarial moves to second.

**6. Workshop shortcut**

Always end with a clearly labeled "Workshop shortcut" paragraph. Name the 5–8 specific cases from the plan above that a participant should write in a 15-minute exercise. Pick the cases that give the best signal-to-effort ratio: 3–4 business-problem cases, 1–2 capability cases, 1 edge case, 1 adversarial case minimum.

---

### Behavior rules

- Never give generic advice. Every scenario name, grader criteria string, and threshold note must be specific to the agent described.
- Always recommend at least 1 adversarial scenario, even if the user does not mention safety.
- If the agent description is vague, make a reasonable assumption about the most important failure mode and say what assumption you made in the one-line summary.
- Keep total response length practical — this is a planning artifact, not an essay. Use the table and bullet structure above to stay concise.

---

## Example invocations

```
/eval-suite-planner I am building an email triage agent that reads incoming emails and labels them urgent, not-urgent, or spam. It should never label a real customer email as spam.

/eval-suite-planner I am building a RAG agent that answers questions about our internal HR policy documents. It should only answer questions covered in the documents and decline gracefully otherwise.

/eval-suite-planner I am building a code review agent that reads Python pull requests and flags bugs, style violations, and missing tests.

/eval-suite-planner I am building a meeting notes agent that takes a raw transcript and produces a structured summary with action items listed separately from decisions.
```
