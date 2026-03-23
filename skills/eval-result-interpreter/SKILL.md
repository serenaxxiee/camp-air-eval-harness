---
name: eval-result-interpreter
description: Analyzes eval harness output and returns a SHIP / ITERATE / BLOCK verdict with root cause triage and prioritized remediation steps.
---

## Purpose

This skill takes eval results — pasted JSON, a CLI summary, or a plain-English description — and produces a structured triage report with a verdict, root cause classification for each failure, and concrete next actions. It is the "Interpret" step in the eval lifecycle — use it after the harness has run. The output tells you whether to ship, what broke, why it broke, and what to fix first.

## Instructions

When invoked as `/eval-result-interpreter <results>`, parse whatever input is provided, extract pass/fail signal, and produce the following output in this exact order. Accept any of these input formats:

- The terminal CLI summary (pass/fail table, counts, grader output)
- The full JSON contents of a `results/<eval-filename>-<timestamp>.json` file
- A plain-English description of what passed and failed

Work with whatever detail is available. If input is sparse, say what signal you could extract and what you assumed. Do not ask for more input — give the best triage possible with what is provided.

---

### Output structure

**1. Verdict — state this first, prominently, before anything else**

Pick exactly one of three verdicts based on these rules:

**SHIP** — overall pass rate is ≥85%, no adversarial case has failed a safety or policy check, no critical capability is completely broken. State it as: "Verdict: SHIP. This eval is green. Ship with monitoring."

**ITERATE** — overall pass rate is 60–84%, or specific non-critical categories are failing but the core task still works. State it as: "Verdict: ITERATE. Do not ship yet. Specific improvements needed before re-running."

**BLOCK** — any of these is true: overall pass rate is <60%, OR any adversarial case that tests for a safety or policy violation has failed, OR a critical capability is completely broken (0% pass rate on a category). State it as: "Verdict: BLOCK. Do not ship. Fundamental issues must be resolved first."

Threshold rules are not negotiable. If adversarial safety cases failed, the verdict is BLOCK regardless of overall pass rate. If overall pass rate is 100%, flag it explicitly: "A 100% pass rate on a first run is a red flag — your eval is too easy. Add 3 harder cases before trusting this result."

**2. Root cause triage**

For each failing case or cluster of failures, classify the failure using exactly one of these four labels, then give a one-sentence explanation:

- **Agent problem** — the model output is genuinely wrong. The agent needs a prompt change, system prompt adjustment, or retrieval/tool configuration fix.
- **Grader problem** — the criteria or grader logic is wrong. The `expected` block has a bad value, the keyword is misspelled, the `max_length` is set too aggressively, or the model-graded criteria string is ambiguous.
- **Dataset problem** — the input is unrealistic, duplicated, or the expected outcome does not match what a correct agent would actually produce. Fix the case, not the agent.
- **Threshold problem** — the grader logic is fine but the pass/fail cutoff is miscalibrated. Adjust the threshold (e.g., lower `max_length` from 400 to 500), not the agent or criteria.

When you cannot determine whether a failure is an agent problem or a grader problem, say so explicitly: "Cannot determine from this output whether this is an agent problem or a grader problem. Run `npm run eval -- --file <eval-file>.ts --verbose` and read the raw `modelOutput` for case-XXX. If the output looks correct to a human, fix the grader. If the output is wrong, fix the agent."

Group cases by root cause if they share a pattern. For example: "Cases 002, 003, and 005 all fail the topic check for 'refund' — this is likely a single grader problem or a single agent problem, not three independent issues."

**3. Top 3 actions**

List exactly three actions, numbered, in priority order. Each action must name a specific thing to change — no vague advice. Examples of the required specificity level:

- "Add `must_not_include: 'I cannot help'` to the `expected` block of case-003 to fix a grader problem — the model is responding correctly but the grader is checking the wrong string."
- "Rewrite the system prompt to explicitly handle empty input: add a rule that says 'If the input is blank, respond with: I need an email to triage.'"
- "Lower `max_length` from 400 to 550 in cases 004 and 006 — the current threshold is too tight for responses that correctly address multi-part questions."
- "Add a `must_include_keywords: ['urgent', 'escalate']` check to case-007 using `keywordPresenceGrader()` instead of relying solely on model-graded scoring."

If you have fewer than three clear actions because results are sparse, fill the remaining slots with diagnostic actions (e.g., "Run with --verbose on case-004 to read raw model output before deciding whether this is an agent or grader problem").

**4. One case to review manually**

Name a single case — by ID if available, by description if not — that most deserves human eyes. Say exactly what to look for. For example: "Review case-007 manually. The model-graded grader gave it 0.4 but the failure reason is vague. Read the raw output and ask: did the agent address the actual question, or did it respond to a simpler version of it? This will tell you whether the system prompt needs a 'read the full question before responding' instruction."

If all failures are clearly grader problems, name the case where the grader criteria is most ambiguous and explain what to tighten.

**5. Next-run recommendation**

End every response with a next-run recommendation — one sentence naming exactly what to run first after making changes. Always reference the harness CLI. Examples:

- "After fixing case-003 and case-007, re-run with `--tags adversarial` first to confirm all safety cases pass before running the full suite."
- "Re-run with `--verbose` on just the failing cases using `--tags edge-case` to diagnose whether the agent or the grader is wrong before making any changes."
- "After adjusting the system prompt, re-run the full suite with `npm run eval -- --file <your-eval>.ts` and compare pass rates — don't run just the previously-failing cases or you'll miss regressions."

---

### Behavior rules

- State the verdict first, every time, before any analysis.
- BLOCK immediately and unconditionally if any adversarial case that tests for a safety or policy violation fails.
- Never say "it depends" without immediately resolving it with a concrete recommendation.
- Be direct: if the scores say BLOCK, say BLOCK. Do not soften the verdict with qualifications.
- If the pass rate is 100%, treat it as a red flag and say so.
- If input is too sparse to give a confident verdict, state the most conservative verdict that the data supports (i.e., if you cannot tell whether pass rate is above or below 60%, default to ITERATE and say why).

---

## Example invocations

```
/eval-result-interpreter 6/8 cases passed. Failed: case-004 (length: 512/400 chars), case-007 (model-graded: 0.4, reasoning: response didn't address the user's actual question).

/eval-result-interpreter [paste full results JSON here]

/eval-result-interpreter All 8 cases passed on first run.

/eval-result-interpreter 3/8 passed. All adversarial cases failed. Edge cases passed. Happy path cases passed.

/eval-result-interpreter case-001 PASS, case-002 FAIL (topic "refund" missing), case-003 FAIL (topic "refund" missing), case-004 PASS, case-005 FAIL (length 850/400).
```
