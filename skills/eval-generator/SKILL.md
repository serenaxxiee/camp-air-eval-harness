---
name: eval-generator
description: Generates eval scenarios (dataset cases) from a plain-English agent task description
---

## Purpose

Given a plain-English description of what an agent does and what success looks like, generate a diverse set of eval scenarios covering happy-path, edge, and adversarial cases. Output is formatted as valid JSON ready to paste directly into a `datasets/my-eval-dataset.json` file and run with the Camp AIR eval harness — no modification required.

## Instructions

When invoked as `/eval-generator <description>`, generate a complete set of eval scenarios for that agent. Follow these rules exactly:

**Before generating:**
- If the description is fewer than two sentences or does not mention what a good response looks like, ask exactly one clarifying question: "What does a successful response look like for this agent — is there a specific format, length limit, policy, or topic it must address?" Then wait for the answer before generating.
- If the description is clear enough to proceed, generate immediately without asking questions.

**Output format — generate in this exact order:**

1. A one-line summary: "Generating eval scenarios for: [agent task in your own words]"
2. The full JSON array of cases (see schema below) — this must be valid, copy-pasteable JSON
3. A "Reviewer notes" section after the JSON (plain text, not inside the JSON)

**Scenario count and mix — always follow this minimum:**
- 6–8 total scenarios by default
- At least 2 happy-path cases (realistic, well-formed inputs that should produce a good response)
- At least 2 edge cases (empty input, very long input, ambiguous input, malformed input, or unusual but plausible inputs)
- At least 1 adversarial case (input designed to produce wrong behavior: out-of-scope request, prompt injection attempt, contradictory instructions, or a trap question)
- Fill remaining slots with whatever scenario type gives the most signal for this specific agent

**JSON schema — every case must match this structure exactly:**

```json
[
  {
    "id": "case-001",
    "input": { "text": "..." },
    "expected": {
      "max_length": 300,
      "must_include_topic": "..."
    },
    "tags": ["happy-path"]
  }
]
```

Rules for the JSON:
- `id` values: `"case-001"` through `"case-008"` (zero-padded, sequential)
- `input.text`: A realistic sample input the agent would actually receive in production. Make it specific, not a placeholder.
- `expected`: Include only fields that are testable by the harness. Use concrete values — never vague strings. Appropriate fields:
  - `max_length` (integer, character count) — use when response length is a quality signal
  - `must_include_topic` (string) — a topic, keyword, or phrase the response must address
  - `must_not_contain` (string) — a phrase that should never appear (use for policy violations, hallucinations, forbidden content)
  - `format` (string, e.g., `"json"`, `"bullet-list"`, `"plain-text"`) — use when output structure is required
  - `classification` (string) — use for agents that output a label or category
  - `min_items` (integer) — use when the agent should return a list with a minimum number of entries
- `tags`: Use one or more of: `"happy-path"`, `"edge-case"`, `"adversarial"`, `"long-input"`, `"empty-input"`, `"policy"`, `"format"`, `"classification"`. Add a descriptive custom tag if none of these fit.

**After the JSON, write a "Reviewer notes" section with exactly three items:**

1. **Most likely to fail:** Name the specific case ID and explain in one sentence why it is the hardest case in this set.
2. **One more scenario to consider:** Describe one additional scenario the user should add manually — something that did not fit in the generated set but is realistic for this agent.
3. **Mandatory reminder:** Always include this exact text as the third item: "Delete any scenario that would not actually occur in production. AI-generated scenarios need human review before use in CI."

**Tone and format notes:**
- Each case must be independently understandable — no references to "the previous case"
- The JSON must be syntactically valid. Double-check bracket matching and trailing commas before outputting.
- Do not include comments inside the JSON (JSON does not support comments)
- The "Reviewer notes" section is plain text and lives outside the JSON code block

## Example invocations

```
/eval-generator I am building a customer support agent that handles refund requests. It should be polite, follow the refund policy, and not make promises the policy does not allow.

/eval-generator I am building a meeting notes agent. It takes a raw meeting transcript and produces a structured summary with action items listed separately from decisions.

/eval-generator I am building an email triage agent that reads incoming emails and labels each one as urgent, not-urgent, or spam. It should never label a real customer email as spam.

/eval-generator I am building a code review agent that reviews Python pull requests and flags potential bugs, style violations, and missing tests.
```
