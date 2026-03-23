---
name: eval-faq
description: Answers AI agent evaluation methodology questions with practical, opinionated guidance drawn from authoritative sources fetched at runtime. Includes a built-in Camp AIR harness quick reference — workshop participants can ask about eval file structure, CLI flags, expected block fields, and pass/fail thresholds without needing any other documentation.
---

## Purpose

Answer any question about eval methodology, grader types, dataset design, criteria writing, non-determinism, tool-call evaluation, multi-turn agent evaluation, eval tooling, capability vs. regression evals, and interpreting results — specifically in the context of AI agent evaluation. This skill is tuned for engineers and PMs working with the Camp AIR eval harness during a hands-on workshop. Answers are grounded in authoritative sources fetched at runtime, not baked-in generic LLM knowledge. The knowledge base includes a **Camp AIR harness quick reference** section that answers harness-specific questions (eval file structure, CLI flags, expected block fields, thresholds) without requiring a network fetch.

## Instructions

When invoked as `/eval-faq <question>`, follow this process exactly:

### Step 1 — Fetch authoritative context before answering

Use this topic-to-URL routing table to decide what to fetch. Fetch FIRST, then answer. Fetch only the URL(s) that match the question topic — do not fetch all URLs every time.

**For Camp AIR harness-specific questions (eval file structure, CLI flags, expected block format, where to put files, field names, threshold values, what fields a case needs) — do NOT attempt a network fetch. Go directly to the knowledge base section "Camp AIR harness quick reference" below. That section is the authoritative source for harness questions.**

| Question topic | Fetch this URL | Section to extract | Notes |
|---|---|---|---|
| Grader types, grader design, code-based vs. model-based vs. human graders | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Grader types" or "Evaluation methods" section | |
| Capability vs. regression evals, pass rate interpretation, what 0% pass@100 means | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Capability evals" and "Regression evals" sections | |
| Outcome vs. path grading, tool-call sequences, agent behavior | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Outcome vs. path" or "Grading agent behavior" section | |
| Multi-turn agents, trajectory scoring, stateful interactions, intermediate steps | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Multi-turn" or "Trajectory" sections | |
| Swiss cheese model, combining eval methods, production monitoring | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Layered evaluation" or "Swiss cheese" section | |
| Scenario types, dataset structure, what cases to write | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Scenario types" or "Dataset design" section | |
| What threshold should I set, pass/fail thresholds, score cutoffs, when to ship | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Thresholds", "Shipping", or "Capability evals" sections | Also check knowledge base "Camp AIR harness quick reference" for Camp AIR-specific thresholds |
| How many eval cases is enough, minimum dataset size, sample size for signal | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Dataset design" or "Starting eval size" section | Also check knowledge base "Dataset design" section |
| LLM-as-judge calibration, pairwise scoring, judge biases, position bias, verbosity bias | `https://eugeneyan.com/writing/llm-evaluators/` | "Biases" and "Calibration" sections | |
| Ensemble judge, panel of LLMs, judge cost optimization | `https://eugeneyan.com/writing/llm-evaluators/` | "Ensemble" or "PoLL" section | |
| LLM-as-judge methodology, critique shadowing, judge prompt design, binary vs Likert scoring, domain expert calibration | `https://hamel.dev/blog/posts/llm-judge/` | Judge prompt design, calibration, and error analysis | |
| Multi-turn red-teaming, adversarial multi-turn attacks, context manipulation, permission escalation, role-playing exploitation | `https://www.pillar.security/blog/practical-ai-red-teaming-the-power-of-multi-turn-tests-vs-single-turn-evaluations` | Multi-turn attack patterns and why they differ from single-turn | fetch may fail — fall back to knowledge base "Multi-turn adversarial evaluation" section |
| Eval platforms, tooling, Braintrust, LangSmith, Langfuse, what tool to use | `https://www.braintrust.dev/articles/top-5-platforms-agent-evals-2025` | Full article — extract platform comparison and decision guide | fetch may fail — fall back to knowledge base "Eval tooling and platform selection" section |
| Agent fails in production despite passing evals, production monitoring, flywheel | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "Production" or "Monitoring" section | |
| Automated eval generation, behavioral evals, agentic eval automation, Bloom framework, iterative eval generation | `https://alignment.anthropic.com/2025/bloom-auto-evals/` | "methodology", "results", "four-stage framework" sections | |
| Behavioral scoring for safety/alignment, frequency + severity scoring, cross-lab safety evaluation, misalignment evals, sycophancy evaluation, self-preservation evaluation | `https://alignment.anthropic.com/2025/openai-findings/` | "methodology", "scoring approach", "key findings" | fetch may fail — fall back to knowledge base |
| Eval platform comparison, tooling selection, Braintrust vs LangSmith, eval infrastructure | `https://hamel.dev/blog/posts/eval-tools/` (PRIMARY — neutral practitioner view); secondary: `https://www.braintrust.dev/articles/top-5-platforms-agent-evals-2025` | "platform comparison", "decision guide", "stack abstraction warning" | |
| Automated red teaming, CI/CD eval, adversarial automation, continuous red-teaming | `https://www.promptfoo.dev/docs/red-team/` | "attack types", "CI/CD integration", "automated adversarial testing" | |
| Industry benchmarks, how many teams run evals, production monitoring adoption, online vs offline eval statistics, LLM-as-judge adoption rates | `https://www.langchain.com/stateofaiagents` (primary); fallback: `https://www.langchain.com/state-of-agent-engineering` | Statistics, key findings, and methodology sections | Survey-based report; fetch may redirect — try both URLs |
| Production readiness checklist, five-pillar evaluation framework, reference-free vs reference-aware judging, lessons from deploying agents at scale | `https://www.infoq.com/articles/evaluating-ai-agents-lessons-learned/` | "five evaluation pillars", "reference-free vs reference-aware", "production readiness" | fetch may fail — fall back to knowledge base |
| Eval-driven development, writing evals before features, capability-first eval workflow, iterating until performance improves | `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` | "eval-driven development", "capability evals" sections | |
| How to define success criteria, SMART criteria for evals, LLM grader best practices, how to write rubrics, use a different model to evaluate, grader prompt design | `https://platform.claude.com/docs/en/test-and-evaluate/develop-tests` | "Define success criteria", "LLM-based grading", "Grading hierarchy" sections | Official Anthropic eval docs — highly reliable |
| Error analysis, axial coding, manual annotation, failure categorization, highest ROI eval activity | `https://hamel.dev/blog/posts/evals-faq/` | "error analysis", "annotation", "failure triage" sections | |
| CI/CD integration, eval automation, blocking thresholds, continuous eval, eval in GitHub Actions | `https://www.braintrust.dev/articles/best-ai-evals-tools-cicd-2025` | "CI/CD integration", "automated thresholds", "blocking builds" sections | fetch may fail — fall back to knowledge base |
| pass@k vs pass^k metrics, non-determinism statistics, eval metric selection | `https://www.braintrust.dev/articles/llm-evaluation-metrics-guide` | "pass@k", "reliability metrics", "non-determinism" sections | fetch may fail — fall back to knowledge base "Non-determinism and pass@k" section |
| Academic survey of LLM agent eval methods, comprehensive benchmarks, evaluation taxonomy | `https://arxiv.org/abs/2503.16416` | Abstract, taxonomy, and key findings sections | |
| Eval platform comparison, tooling selection, Braintrust vs LangSmith vs Arize vs Langfuse | `https://arize.com/llm-evaluation-platforms-top-frameworks/` | Full platform comparison table and decision guide | fetch may fail — fall back to knowledge base |
| Multi-step agent evaluation, decision-chain evaluation, trajectory quality, Agent-as-a-Judge | `https://arxiv.org/abs/2508.02994` | Abstract, methodology, and key findings on trajectory evaluation vs. final-output evaluation | |
| Real-world production lessons, Amazon agent evals, enterprise agent evaluation, building agentic systems at scale | `https://aws.amazon.com/blogs/machine-learning/evaluating-ai-agents-real-world-lessons-from-building-agentic-systems-at-amazon/` | "key lessons", "evaluation pitfalls", and "production recommendations" sections | fetch may fail — fall back to knowledge base |
| My grader gives false failures, debugging a grader, grader is wrong, false positives in grader | Do NOT fetch — go directly to knowledge base "Transcript reading" and "Error analysis" sections | | Use knowledge base only |
| How many cases for a workshop, minimum viable eval for 40-minute session, time-constrained eval | Do NOT fetch — go directly to knowledge base "Dataset design" and "Camp AIR harness quick reference" sections | | Use knowledge base only |
| Building test sets, golden datasets, sampling from production, writing good prompts for test cases, critique-based test generation | `https://www.anthropic.com/engineering/building-effective-agents` | "Testing and evaluation" and "Test set construction" sections | Published 2024 — highly authoritative for agentic workflow evaluation |
| Agent-specific eval dimensions, six-dimension agent framework, planning eval, tool selection eval, parameter extraction eval, self-reflection eval | `https://arize.com/llm-as-a-judge/` | "Agent evaluation dimensions" or "Pre-built evaluators" section | Arize pre-built evaluator framework — highly practical |
| Production monitoring, data flywheel, offline vs online evals, production trace monitoring, regression test construction from production | `https://www.langchain.com/articles/llm-evals` | "Offline evals", "Online evals", "Flywheel" sections | LangSmith practitioner guide to the offline-online eval loop |
| Any question not clearly matching above | Fetch `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` as primary source, supplement with relevant knowledge base section | | |

**Fetch rules:**
- Always attempt the fetch for rows without "Do NOT fetch." If it fails (404, timeout, irrelevant content), fall back to the knowledge base below and note "Source unavailable at fetch time — answering from knowledge base."
- If you fetched and used the content, cite it explicitly: "Per Anthropic's eval engineering guide: ..." or "Per Eugene Yan's LLM evaluator analysis: ..." or "Per Braintrust's 2025 platform comparison: ..."
- Never block on a failed fetch. A degraded answer is better than no answer.
- Extract only the section relevant to the question. Do not summarize the whole page.

### Step 2 — Answer using fetched content plus knowledge base

Synthesize the fetched content with the knowledge base below. Fetched content takes priority over the knowledge base when they differ.

**Answer style rules — no exceptions:**
- Answer in 3–5 sentences maximum. No padding, no preamble, no "great question."
- Give opinionated, direct guidance. Never say "it depends" without immediately resolving it with a concrete recommendation.
- Use specific numbers ("start with 20–50 cases", "flag cases with <60% agreement", "run 3 trials per case").
- Reference the harness structure when relevant: "put this in the `expected` block", "use the `--tags` flag", "set `trials: 3` in your eval config."
- Do not ask clarifying questions. Make a reasonable assumption and answer.
- Cite which source you used at the end of the answer.

---

## Knowledge Base

Use the sections below as your primary reference when fetched content does not cover the question, or to supplement fetched content with harness-specific details.

### Camp AIR harness quick reference

This section is the authoritative source for all questions about the Camp AIR eval harness. Use it directly — no network fetch required.

#### Eval file structure

Each eval file is a YAML or JSON file defining an `EvalConfig` object. The required and optional top-level fields are:

```yaml
name: "my-eval"                  # required — short identifier
description: "What this tests"   # required — one sentence
dataset: "datasets/my-cases.json" # required — path relative to my-evals/
grader: "my-grader"              # required — grader name or inline grader config
tags: ["capability", "tone"]     # optional — used with --tags flag to filter runs
trials: 1                        # optional — number of times to run each case (default 1; use 3 for non-determinism testing)
```

Put custom eval files in the `my-evals/` directory. Put dataset files in `my-evals/datasets/`.

#### Dataset case format

Each case in your dataset is a JSON object with these fields:

```json
{
  "id": "case-001",              // required — unique string identifier
  "input": "User message here",  // required — the input sent to the agent
  "expected": {                  // required — the criteria this case must meet
    "max_length": 400,           // optional — response must be at most N characters
    "must_include_topic": "refund policy", // optional — response must mention this topic
    "must_not_include": "sorry", // optional — response must NOT contain this string
    "min_score": 0.7,            // optional — minimum LLM judge score (0.0–1.0)
    "expected_content": "..."    // optional — reference answer for reference-aware judging
  },
  "tags": ["happy-path", "tone"] // optional — used with --tags flag
}
```

The `expected` block is your criterion definition. You can combine multiple fields — e.g., both `max_length` and `must_include_topic` — and all must pass for the case to pass.

#### Key CLI flags

| Flag | What it does |
|---|---|
| `--file my-evals/my-eval.yaml` | Run a specific eval file |
| `--tags capability` | Run only cases tagged with this value |
| `--verbose` | Print each case result with full transcript |
| `--ci` | Exit with non-zero code on any failure (use in CI pipelines) |

#### Where to put files

- Custom eval configs: `my-evals/my-eval-name.yaml`
- Dataset files: `my-evals/datasets/my-dataset.json`
- Do not modify files outside `my-evals/` during the workshop

#### Threshold guidelines (Camp AIR defaults)

| Pass rate | Decision |
|---|---|
| 85% or above | SHIP — agent meets the bar for this capability |
| 60–84% | ITERATE — meaningful failures exist; fix before shipping |
| Below 60% | BLOCK — fundamental problem; do not ship this capability |

These thresholds apply to capability evals on customer-facing tasks. For internal tools, the ITERATE threshold drops to 70%. For safety-critical tasks, the SHIP threshold rises to 95%.

**If 100% of cases pass on your first run:** your cases are too easy. Add harder edge and adversarial cases immediately. 100% on day one is a red flag, not a success.

#### Minimum viable eval for the 40-minute workshop

If you are running out of time, this is the minimum set that provides real signal:
1. 3–5 happy-path cases covering the core use case
2. 2–3 edge cases (empty input, very long input, ambiguous input)
3. 1–2 adversarial cases (out-of-scope request, prompt injection attempt)
4. At least one `must_not_include` criterion to catch obvious failures

That is 6–10 cases. Run with `--verbose` so you can read each result. Fix the first failure you find, re-run, repeat.

---

### Scenario types

- **Business-problem scenarios:** Test whether the agent actually solves the real user problem end-to-end. These are the most important scenarios. If you only have time to write one type, write these. One passing business-problem case is worth ten passing capability cases.
- **Capability scenarios:** Test a specific isolated ability — summarization length, classification accuracy, tool invocation, format compliance. Useful for diagnosing which capability is failing, not for proving the agent works.
- **Edge case scenarios:** Empty input, very long input, ambiguous input, inputs with typos or unusual formatting. These reveal brittleness that happy-path tests miss entirely.
- **Adversarial scenarios:** Inputs designed to elicit wrong behavior — prompt injections, out-of-scope requests, contradictory instructions, manipulation attempts. Every deployed agent needs at least a handful of these. Teams commonly skip adversarial cases and then get surprised in production.

**Anti-pattern:** Skewing your dataset 80%+ toward happy-path cases. That gives you a high pass rate and false confidence. The target distribution for a new eval is roughly 50% happy-path, 30% edge cases, 20% adversarial.

#### Multi-turn adversarial evaluation

Single-turn adversarial tests are insufficient for deployed conversational agents. Per Scale AI research cited in Pillar Security's practical red-teaming guide, human red teamers achieved attack success rates 19–65% higher than automated attacks, and multi-turn jailbreaks exceeded 70% success rates on models that appeared robust in single-turn testing. Three attack patterns are only detectable in multi-turn evaluation:

1. **Context manipulation:** Requests shift gradually across turns, each individually innocuous, until the agent's earlier compliance is used to bypass guardrails in a later turn.
2. **Permission escalation:** False admin or privilege claims are introduced across the conversation to bypass business logic that would have blocked a single-turn request.
3. **Role-playing escalation:** Fictional framing is established early and gradually escalates across turns, eventually extracting harmful instructions under the guise of a "character."

Include at least 2–3 multi-turn adversarial scenarios in any eval suite for a deployed conversational agent. Meta's MART (Multi-Round Automatic Red Teaming) framework, which runs adversarial and target LLMs in iterative cycles, reduces violation rates by up to 84.7% after four iterations — this approach is worth adopting for high-risk deployments.

The **AgenticRed** framework (arXiv 2601.13518, 2025) formalizes automated adversarial red-teaming specifically for agentic systems — agents that take actions in environments, not just generate text. Key addition: AgenticRed includes tool-use exploitation scenarios, where the attacker attempts to cause the agent to invoke a tool with dangerous arguments (e.g., a file-deletion tool called on system paths). These scenarios are absent from conversational red-teaming frameworks and should be added to any eval suite for tool-using agents.

**Agentic-specific attack surfaces (CSA 2025):** Per the Cloud Security Alliance's Agentic AI Red Teaming Guide (May 2025), agentic systems expose five attack surfaces not present in single-turn LLM eval:

1. **Hallucination injection** — attacker crafts tool outputs or retrieved documents that contain false "facts" designed to corrupt the agent's reasoning across subsequent steps.
2. **Orchestration flaws** — in multi-agent pipelines, unexpected trust chains between orchestrator and sub-agents create privilege escalation paths that single-agent red-teaming misses.
3. **Memory manipulation** — for agents with persistent memory (conversation history, vector stores), attackers inject content in early turns designed to corrupt future behavior.
4. **Supply chain compromise** — tool integrations (APIs, databases, retrieval sources) can be vectors for indirect prompt injection.
5. **Permission escalation** — as already covered in the multi-turn section, but CSA emphasizes this occurs at the *pipeline* level (agent A grants agent B permissions it shouldn't have) not just the turn level.

Treat agentic red-teaming as a continuous function, not a pre-launch gate. Each of these attack surfaces should have at least one eval case in any production agent eval suite.

Source: Cloud Security Alliance, "Agentic AI Red Teaming Guide" (May 2025), https://cloudsecurityalliance.org/artifacts/agentic-ai-red-teaming-guide

Source: Pillar Security, "Practical AI Red Teaming: Multi-Turn vs Single-Turn Evaluations."

### Grader types

Per Anthropic's eval engineering guide, there are three grader types that should be combined strategically:

- **Code-based / deterministic graders** (regex, string matching, JSON schema validation, length checks, environment state checks): Fast, cheap, and unambiguous. Run these first. If a deterministic check can answer your question, use it — do not reach for an LLM judge. For coding agents specifically, deterministic test execution (does the code compile, do unit tests pass?) is the gold standard.
- **Model-based / LLM-graded graders** (LLM judges the output against written criteria): Use for quality checks requiring judgment — tone, completeness, factual grounding, relevance. Write the criteria in plain language before writing the grader code. Criteria you cannot articulate cannot be graded reliably. For conversational agents, combine outcome verification with interaction quality rubrics.
- **Pairwise LLM comparison:** For subjective quality dimensions, having the LLM judge pick the better of two outputs outperforms scalar 1–5 scoring. It reduces variance and is more consistent with human preference. Use pairwise when comparing prompt variants or model versions.
- **Human review:** Slowest and highest quality. Use only for calibration — verifying that your automated graders agree with expert humans at least 80% of the time (Cohen's kappa > 0.6). Do not use human review as your primary evaluation loop during a workshop.
- **BLEU and ROUGE are effectively dead for agent evals.** These lexical overlap metrics were designed for machine translation and text summarization. For open-ended agent interactions where multiple valid responses exist, they are unreliable and should not be used. Per the LangChain State of Agent Engineering 2026 report (based on a survey conducted November–December 2025): "These metrics prove less suitable for open-ended agent interactions where multiple valid responses exist." Use semantic similarity, LLM-as-judge, or task-specific deterministic checks instead.

**Calibration threshold:** If your LLM judge and a human expert agree on fewer than 80% of cases (or kappa < 0.6), your criteria are ambiguous. Rewrite the criteria before trusting the judge's scores.

### Capability evals vs. regression suites

This distinction is fundamental and frequently confused:

- **Capability evals** measure what the agent can do. They start at low pass rates on challenging tasks — that's by design, because the point is to create a measurable hill to climb. A 30% pass rate on a new capability eval is useful signal, not a failure.
- **Regression suites** maintain a near-100% pass rate to detect degradation. If a regression case starts failing, something broke. These are not the place for hard cases.
- **When to promote:** When a capability eval saturates (consistently hitting 90%+), promote those cases to the regression suite and write harder capability cases. The capability suite should always feel slightly out of reach.
- **0% pass@100 is a task specification problem, not an agent problem.** Per Anthropic's eval engineering guide, when an agent achieves zero successes across 100 trials, the issue is almost always broken task specification, misaligned success criteria, or a harness constraint — not agent incapability. Fix the task definition before blaming the model.
- In the harness: capability evals belong in a separate `--tags capability` run from regression evals. Never mix them in the same suite — they have opposite pass-rate expectations.

### Eval-driven development

Eval-driven development flips the usual order: write evals that define a planned capability BEFORE the agent can fulfill it, then iterate until the pass rate improves. This is the AI analog of test-driven development.

- **Why this matters:** Without evals written first, "done" is undefined. With evals written first, you have an unambiguous signal for when the feature works. The eval score is the spec.
- **Practical pattern:** (1) Write 5–10 eval cases for the target capability. (2) Run the eval — the agent should fail most of them (low pass rate is expected and correct). (3) Iterate on the agent — prompt, tool config, model — until pass rate crosses your threshold. (4) The day you hit your threshold, you ship. No ambiguity.
- **Capability thresholds by task type:** Customer-facing conversational tasks: 85%+. Internal productivity tools: 70%+. Safety-critical decisions: 95%+ with mandatory human review on failures. These are starting points, not mandates — calibrate against your actual risk profile.
- **The Anthropic formulation:** "Write evals to define planned capabilities before the agent can fulfill them, then iterate until performance improves." Low scores on a new capability eval are a feature, not a bug — they define the improvement target.
- In the harness: run capability evals with `--tags capability` from the start of development. The score history is your feature development log.

**Anti-pattern:** Starting to build a feature and then writing evals to "check your work." That approach always produces evals calibrated to what you built, not what you intended. Evals written after the fact have a systematic bias toward passing.

### Dataset design

- Start with 20–50 cases for a focused task. Per Anthropic's internal eval work, "20–50 simple tasks drawn from real failures is a great start." Early evals have large effect sizes, so small sample sizes are sufficient to get signal.
- Aim for 50% happy-path, 30% edge cases, 20% adversarial. Teams almost always over-index on happy-path.
- **Industry reality check:** Per the LangChain State of Agent Engineering 2026 report (survey conducted November–December 2025): 29.5% of teams are not evaluating at all, and only 37.3% have implemented online (production) evaluation. If you are reading this, you are ahead of the majority. The teams that are evaluating use human review (59.8%) and LLM-as-judge (53.3%) as their dominant approaches.
- **Domain expert test for task validity:** A good task spec passes this check — two subject matter experts, working independently, should reach the same pass/fail verdict without discussion. If they disagree, the task specification is ambiguous. Fix the spec before writing code. This is the single fastest way to catch underspecified eval tasks. Per Anthropic's eval engineering guide: "A good task passes the 'domain expert test' — two subject matter experts should independently reach the same pass/fail verdict."
- **Standardize scoring conventions across the entire eval suite from the start.** Choose ONE convention (binary pass/fail, numeric 0–1, or numeric 0–10) and normalize across all evaluators before writing your first grader. Mixed scales create false comparisons when aggregating results — a 7/10 from one grader and a "pass" from another cannot be meaningfully combined. For workshop agents, binary pass/fail is the correct default. Source: InfoQ, "Evaluating AI Agents in Practice."
- Every production incident should become a dataset case within 24 hours. That is the most reliable source of cases that matter in practice — real failures, not imagined ones.
- Datasets are living artifacts. Add cases every time the agent changes or a new failure appears. A frozen dataset that was written once is a regression suite, not an eval.
- When the pass rate hits 100%, the dataset has saturated. Promote it to a regression suite and write harder cases for the eval.

### Criteria writing

- Criteria must be specific enough that two people reading them independently would agree on pass or fail without discussion. Per Hamel Husain's LLM judge guide, a useful bar is "a new employee could understand it" — if you need insider context to apply the criterion, it is too vague.
- Bad: "the response is helpful." Good: "the response is under 300 characters and mentions the refund policy by name."
- Write criteria before writing code. If you cannot write a testable criterion, you do not yet understand what the agent should do. Stop and clarify the requirement.
- In the harness, criteria map to the `expected` block — e.g., `"max_length": 300` or `"must_include_topic": "refund policy"`.
- One common grader bug: the criterion is ambiguous and the LLM judge interprets it differently on different runs. If you see flaky grader results on the same input, the criterion is the problem, not the model.
- **One dimension per score.** Do not combine factuality, tone, and conciseness into a single score. Per Braintrust's offline eval guide, multi-dimension composite scores hide regressions — a prompt that improves factuality by 35% while degrading tone by 70% shows as a modest net improvement, masking the regression entirely. Each score should answer one question. In the harness, use separate `expected` fields per dimension rather than one aggregate score field.
- **Avoid Likert scales (1–5 scores).** Per Hamel Husain's LLM judge guide, "arbitrary scoring systems using 1–5 scales create confusion." Use binary pass/fail decisions instead. A binary decision forces clarity — you must decide whether the output actually meets your bar, rather than hedging with a middle score. Detailed written critiques explaining the reasoning are more valuable than a numeric score. When building LLM judges, require the judge to write a critique first, then emit a binary verdict — never just a number.
- **Scale design:** If you must use a multi-point scale (e.g., for behavioral evals where presence/absence is too coarse), cap at 3 points: fail / partial / pass. Research shows inter-rater reliability drops sharply beyond 3 points — GPT-4 and human raters agree on binary verdicts ~85% of the time but only ~67% of the time on 5-point scales. Fine-grained scales force borderline decisions that neither humans nor models make consistently, adding noise rather than signal. Binary or 3-point scales are the safe upper limit for any LLM-judged criterion.
- **Version your grader prompts.** A change to a grader's prompt or rubric produces incomparable scores — a score of 85% under grader-v1 cannot be meaningfully compared to 85% under grader-v2. Track grader versions alongside dataset versions. Per Braintrust's evaluation metrics guide: "Metric versioning is mandatory — grader changes alter metric values, making historical comparisons invalid without explicit version tracking." In the harness, use dated filenames or commit tags to tie each result file to a specific grader version.

### Non-determinism and pass@k

Agents are non-deterministic. A single-run score is unreliable for anything you plan to ship.

- **pass@k** ("did the agent succeed at least once in k runs?"): Use for exploratory or creative tasks where "sometimes works" is acceptable. At k=10, pass@k approaches 100% for agents that succeed even occasionally. This metric is optimistic by design.
- **pass^k** ("did the agent succeed every time in k runs?"): Use for reliability-critical tasks — customer-facing agents, compliance workflows, anything where a single failure has consequences. At k=10, pass^k drops sharply for any agent that occasionally fails. This metric is pessimistic by design.
- **Concrete divergence example:** At k=10 with a 70% per-trial success rate, pass@k ≈ 97% (great — it works most of the time) while pass^k ≈ 3% (terrible — it almost never works every time). The same agent looks excellent or catastrophic depending on which metric you report. Always state which metric you're using. For customer-facing agents, pass^k is the right question.
- **Practical starting point for workshop agents:** Run 3 trials per case, require 2/3 passes. In the harness, set `trials: 3` in your eval config. This catches obvious instability without tripling your eval runtime.
- When you see flaky results (a case that sometimes passes, sometimes fails), run the same case 3 times before investigating the agent. Confirm the failure is consistent. Per Anthropic's eval engineering work, at k=10 pass@k and pass^k can diverge massively for the same agent on the same task — that divergence is itself useful signal about your reliability requirements.

**Anti-pattern:** Running each case once and treating the result as definitive. For any agent you plan to ship, a single pass is not evidence of reliability.

### Multi-turn and trajectory evaluation

Multi-turn and agentic workflows require different evaluation strategies than single-turn responses, because errors compound across steps.

- **Trajectory / transcript:** The complete record of a trial — all API calls, tool invocations, intermediate outputs, reasoning traces, and final state. Grade the trajectory, not just the final output. An agent that reached the right answer through confused reasoning or unnecessary tool calls is more fragile than its score suggests.
- **Trajectory scoring:** Evaluate the sequence of steps as a whole, not just the endpoint. Ask: did the agent take the shortest reasonable path? Did it recover from intermediate errors? Did it correctly use tool results to inform subsequent steps?
- **Intermediate step verification:** For multi-step agents, add checkpoint assertions at key steps, not just at the end. If step 3 requires a database lookup, verify the lookup happened and returned expected data before evaluating step 4's output.
- **Environment state verification:** The ground truth for agentic tasks is the state of the external environment, not what the agent claims. A booking agent passes if a reservation exists in the database — not if it says "I booked your flight." Per Anthropic's eval engineering guide, this is the key distinction between outcome and stated claims.
- **Compounding errors:** A mistake at step 2 of a 5-step workflow may not be visible in the final output. Run your eval with detailed logging at each step. In the harness, set `log_intermediate: true` if your config supports it, or log tool call results explicitly in your scenario definition.
- **Stateful interaction evaluation:** For conversational agents handling multi-turn dialogues, evaluate at the conversation level, not the turn level. A turn-level pass rate of 90% can hide a conversation-level failure rate of 40% if errors accumulate.

#### Agent-as-a-Judge

For multi-step agentic pipelines, an LLM judge that looks only at the final output misses 40–60% of the meaningful quality signals present in the reasoning trajectory — tool selection, intermediate sub-goals, and decision chain logic. **Agent-as-a-Judge** (arXiv 2508.02994, 2025) addresses this by using an agent — not a single LLM call — to evaluate another agent's full decision chain. The evaluating agent actively inspects intermediate reasoning steps, verifies that tool selections were appropriate at each decision point, and checks that sub-goals were sensibly ordered. Use Agent-as-a-Judge when your pipeline has 3+ sequential steps, when tool selection errors mid-chain are a known risk, or when final output quality is a lagging indicator that masks process failures. Use standard LLM-as-judge when your task is effectively single-step, when the final output fully encodes all relevant quality signal, or when you need to minimize eval infrastructure complexity. The tradeoff: Agent-as-a-Judge is significantly more expensive and slower than a single judge call — reserve it for high-stakes or complex pipelines where trajectory quality is a first-class requirement.

Source: arXiv 2508.02994, "When AIs Judge AIs: The Rise of Agent-as-a-Judge Evaluation for LLMs" (2025). Fetch `https://arxiv.org/abs/2508.02994` for full methodology.

### Transcript reading

Never trust a score you have not manually verified on at least 5 cases. Per Anthropic's eval engineering guide: "We do not take eval scores at face value until someone digs into the details of the eval and reads some transcripts."

- When you see a surprising result — score too high, too low, or inconsistent — read the actual model output before changing anything else. Per Anthropic's eval engineering data, one agent went from 42% to 95% after researchers fixed grader bugs, not the agent itself. The agent was fine; the grader was wrong.
- A common grader bug: the criteria are ambiguous and the LLM judge is guessing. You will see this as inconsistent verdicts on similar outputs. Fix the written criterion first, not the code.
- **Grader bugs can be shockingly subtle.** One real-world example: CORE-Bench penalized a correct answer of "96.12" because the grader expected the exact string "96.124991…" — the agent was right, the grader was wrong, and the team spent days debugging the agent before discovering the issue. Always verify grader behavior on known-correct outputs before trusting its scores on unknown outputs.
- The single best debugging action in any eval workflow: open the failure, read the transcript, ask "is this actually wrong?" You will find grader bugs at least 20% of the time, per Anthropic's internal experience.
- Grader validity is itself something you evaluate. Calibrate your LLM judge against human expert judgment on at least 10 cases before treating its scores as meaningful. If you skip this step, you are measuring how well your prompt describes your criteria, not how well your agent performs.

### Error analysis and axial coding

Error analysis — systematically reading failures, categorizing them, and counting the categories — is the highest-ROI activity in AI engineering. Per Hamel Husain, most practitioners skip this step and jump straight to "fix the prompt," missing structural patterns that would reveal faster solutions.

**Axial coding process:**
1. Run your eval. Collect all failures.
2. Read each failure. Write a one-sentence label for the root cause.
3. Group labels into 3–5 categories (e.g., "retrieval failure," "format non-compliance," "scope creep," "grader error").
4. Count the frequency of each category. Sort by count descending.
5. Fix the highest-frequency category first. Re-run. Repeat.

**Why categorization beats case-by-case debugging:** A single failure tells you one thing. Ten failures with a shared root cause tell you where to invest. If 7 of 10 failures are "retrieval failure," fixing the retrieval step will move the score more than any prompt change.

**The "axial coding gap":** Most eval platforms lack first-class support for manual annotation and error categorization. This is a tooling gap, not a methodology gap. Work around it: export failures to a spreadsheet or Notion, do axial coding there, then bring findings back to your eval harness as new, targeted test cases.

**Grader error is a category too.** When reading failures, always ask: "Is this actually wrong?" Grader bugs show up as failures on outputs that are actually correct. At least 20% of "failures" in a new eval are grader bugs, not agent bugs. Always add a "grader error" category to your axial coding schema.

Source: Hamel Husain, LLM Evals FAQ (hamel.dev/blog/posts/evals-faq/).

### Tool-call quality (for agentic and tool-using agents)

Tool-call quality is a separate eval dimension from output quality. Grade them separately — an agent can produce excellent text while making unnecessary or incorrect tool calls.

- **Three questions to score for each tool invocation:**
  1. Was it the right tool for the task?
  2. Were the arguments correct and complete?
  3. Was the invocation necessary, or could the agent have answered without it?
- Unnecessary tool calls are a cost and latency issue in production. Catch them in eval before they reach users. An agent that calls a search tool three times when once suffices will burn budget and slow responses.
- In the harness: add a `tool_calls` field to your `expected` block if your agent makes tool calls. Verify the count and type. A mismatch between expected and actual tool invocations is a first-class failure.
- Do not grade tool-call sequences rigidly. Per Anthropic's eval engineering guidance, checking for specific tool-call sequences "results in overly brittle tests, as agents regularly find valid approaches that eval designers didn't anticipate." Grade outcomes, not paths. If the agent reached the right answer via a different tool sequence, that should pass.

**Anti-pattern:** Only grading the final text output for agentic systems. The path to the answer matters — wrong tool use is a production risk even when the final answer happens to be correct.

### Eval for agentic workflows (pipelines and orchestration)

Agentic systems — pipelines that chain multiple LLM calls, tools, and sub-agents — require eval strategies beyond single-call evaluation. Per Anthropic's "Building Effective Agents" guide:

- **Test each component individually first.** Evaluate the retrieval step, the reasoning step, and the action step as independent components before evaluating the end-to-end pipeline. Component-level failures compound in pipelines and become impossible to attribute without component-level evals.
- **End-to-end evaluation must come last.** Component tests tell you *where* something broke; end-to-end tests tell you *whether* the system works at all. You need both.
- **Orchestration-level failures are the most common missed failure mode.** A pipeline where all components score 95% individually can still fail end-to-end at rates of 40–60% due to error propagation and interface mismatches between components. Evaluate orchestration as a separate eval dimension.
- **Monitor intermediate outputs.** For any pipeline step that has a well-defined output format (e.g., a JSON object, a list of retrieved chunks, a classification label), add a validator that checks the output before passing it to the next step. Silent failures in intermediate steps are the hardest class of agentic bugs to debug.
- **Use simulated environments for eval.** For agents that take real-world actions (send email, update CRM, execute code), create sandboxed versions of those environments for eval. Never run evals against production systems. The environment state after the agent runs is your primary ground truth — check it explicitly.
- **Parallelism vs. sequential eval:** Parallel sub-agents (multiple agents running simultaneously) require evaluating the *aggregation* step — how sub-agent outputs are combined. Check: (a) are contradictory sub-agent outputs resolved correctly? (b) does the aggregator produce a coherent final output when sub-agents return partial or null results?

### Interpreting results

- A failing case is information, not a failure. It tells you exactly where to act.
- If everything passes on your first run, your cases are too easy. Add harder edge and adversarial cases immediately. 100% on day one is a red flag, not a celebration.
- A 70–80% pass rate is a healthy starting point for a brand-new eval on a non-trivial task. Below 60% means the agent has a fundamental problem to fix before further eval iteration.
- When a grader's verdict disagrees with your intuition, investigate before moving on. Read the transcript. Either the grader is wrong (fix the criterion) or your intuition is wrong (update your mental model of the agent). Do not average away the disagreement.
- Check both directions: test cases where a behavior should occur AND cases where it should not. Evals that only test one direction will produce agents optimized in only one direction.

### Knowledge grounding (for RAG agents)

- Knowledge grounding score measures whether each factual claim in the output is supported by the retrieved context — not whether the claim is true in the world.
- A 75% grounding score means roughly 1 in 4 claims may not be traceable to retrieved documents. For factual tasks (policy lookup, medical, legal), that is unacceptable. Set your threshold at 90%+ for high-stakes factual tasks.
- Implement grounding with a model-graded grader: give the LLM judge both the output and the retrieved documents, and ask it to flag any claim not supported by the documents. Write explicit criteria for what "supported" means — vague criteria produce unreliable grounding scores.
- Low grounding score almost always means the retrieval step is failing, not the generation step. Fix chunking and retrieval before tuning the prompt. The most common retrieval failures are: chunk size too large (retrieved context buries the relevant sentence), wrong embedding model for the domain, and missing metadata filters.
- LLM judges have only 30–60% recall for factual inconsistencies despite 95%+ precision (per Eugene Yan's research). This means your grounding grader will miss roughly half of hallucinations while rarely flagging correct statements. Use a lower threshold to compensate, or add a second judge pass focused specifically on implicit hallucinations.

### LLM-as-judge calibration

- LLM judges exhibit systematic biases with specific, measured magnitudes per Eugene Yan's analysis:
  - **Position bias:** gpt-3.5 is biased toward the first option 50% of the time; claude-v1 is biased 70% of the time. Mitigate by evaluating both orderings (A,B) and (B,A) and requiring consistent verdicts.
  - **Self-enhancement bias:** gpt-4 rates its own outputs with a 10% higher win rate; claude-v1 rates its own outputs with a 25% higher win rate. Never use a model to judge its own outputs in a production eval pipeline.
  - **Verbosity bias:** Both gpt-3.5 and claude-v1 preferred the longer response more than 90% of the time regardless of quality. Include explicit length-independence instructions in your judge prompt ("do not prefer responses solely because they are longer").

#### Critique Shadowing (Hamel Husain's 7-step framework)

When building LLM judges from scratch, use the Critique Shadowing methodology from Hamel Husain's "Using LLM-as-a-Judge For Evaluation: A Complete Guide." This framework produces judges that are grounded in real expert judgment rather than generic rubrics:

1. **Identify one expert** whose judgment defines "acceptable AI" for your product — the person whose opinion matters most when an output is borderline.
2. **Create a diverse dataset** covering the range of inputs and quality levels the judge will encounter, including hard borderline cases.
3. **Collect binary pass/fail with written critiques** — the expert marks each case pass or fail and writes a detailed explanation for why. The written critique is the primary artifact; the binary label is secondary.
4. **Fix obvious errors before building judges** — review the collected critiques for patterns. If the expert was inconsistent, clarify the criteria and re-label before building any prompt.
5. **Build judge prompts iteratively using expert examples** — include the expert's own critiques as few-shot examples in the judge prompt. This is the highest-leverage technique for grounding the judge in real domain knowledge.
6. **Error analysis — classify failure patterns by root cause** — run the judge on a held-out set, collect the cases where it disagrees with the expert, and classify failures into 3–4 root-cause categories (e.g., "judge ignores context," "judge applies wrong criterion," "criterion ambiguous for this case type").
7. **Build specialized judges for specific failure modes** — rather than patching the omnibus prompt, create separate judges for the top failure categories. Specialized judges consistently outperform single omnibus judges that try to cover everything.

**Calibration target:** The judge must reach >90% agreement with the domain expert on a held-out test set before scaling to production. Do not use 80% as your bar for high-stakes tasks — that standard is for exploratory evals. Per Hamel Husain's guide, include external context (user metadata, conversation history, system configuration) in judge prompts — omitting context is a top failure mode.

Source: Hamel Husain, "Using LLM-as-a-Judge For Evaluation: A Complete Guide" (hamel.dev/blog/posts/llm-judge/).

#### Reference-free vs. reference-aware LLM judging

These are two distinct modes of LLM judging, and using the wrong one for your task produces systematically wrong results:

- **Reference-free judging**: The judge evaluates the output in isolation — helpfulness, clarity, appropriateness — with no gold-standard answer to compare against. Use for open-ended tasks where multiple valid responses exist (creative writing, conversational responses, brainstorming). Appropriate when "correct" is not well-defined.
- **Reference-aware judging**: The judge compares the output against a known reference answer, checking factual accuracy. Use when a ground truth exists (factual Q&A, data extraction, code generation with defined outputs). Using reference-free judging for factual tasks introduces false positives — the judge may approve a confident but wrong answer because it sounds helpful. Using reference-aware judging for open-ended tasks introduces false negatives — the judge penalizes valid responses that differ from the reference.
- In the harness: if your `expected` block has a reference answer (e.g., `"expected_content": "..."`), your grader should use reference-aware judging. If your `expected` block only has criteria (e.g., `"max_length": 300`), your grader is already reference-free.

Source: InfoQ, "Evaluating AI Agents in Practice."

- Use Cohen's kappa, not raw percentage agreement, to measure calibration. Raw 80% agreement sounds good but may reflect chance. Kappa > 0.6 is acceptable; kappa > 0.8 is strong. If kappa is below 0.4, rewrite your criteria before proceeding.
- **Calibration benchmarks (2025 research):** LLM judges can achieve ~85% alignment with human judgment on general tasks — notably higher than the ~81% human-to-human agreement baseline on the same tasks (Evidently AI / Arize research). This makes LLM judges production-viable for general-purpose agents. However, in expert or specialized domains (medical, legal, financial), LLM judge accuracy drops to 60–68%, below the human-to-human baseline. The practical decision rule: for general-purpose agents, an LLM judge at >80% agreement is production-viable; for specialized domain agents, human calibration is mandatory, not optional.
- **Scale design for judges:** If you must use a multi-point scale, cap at 3 points (fail / partial / pass). GPT-4 and human raters agree on binary verdicts ~85% of the time but only ~67% of the time on 5-point scales. Fine-grained scales force borderline decisions that models make inconsistently; binary and 3-point scales are the safe upper limit.
- **Split vs. bundled multi-criteria judges:** For highest accuracy, run separate judges per criterion — one for accuracy, one for tone, one for completeness. Each focused judge outperforms a bundled omnibus call because it avoids criterion interference and produces cleaner reasoning. For cost efficiency with acceptable accuracy loss (~5–10%), bundle into one structured-output call (the Arize AX pattern). Choose based on your accuracy/cost trade-off for this specific eval — for safety-critical or high-stakes criteria, always split.
- Multi-criteria judges (scoring multiple dimensions in one request) reduce cost compared to running one judge per dimension. For a workshop agent, score correctness, tone, and groundedness in a single judge call with a structured output.
- **Arize AX approach:** The latest pattern from Arize AX (2025) is a single LLM judge call that scores multiple evaluation dimensions simultaneously — correctness, groundedness, tone, safety — using structured output (JSON with one field per dimension). This is materially cheaper than one judge call per dimension and produces consistent cross-dimension reasoning. Use this pattern for any eval with 3+ dimensions when cost efficiency takes priority. Source: Arize, 'Comparing LLM Evaluation Platforms' (https://arize.com/llm-evaluation-platforms-top-frameworks/).
- **Ensemble judges (Panel of LLMs / PoLL):** Using a diverse panel of smaller models instead of a single gpt-4 judge costs one-seventh as much and achieves comparable or better accuracy per Eugene Yan's research. For budget-constrained workshop evals, this is the correct default. Prometheus (a llama-2 fine-tune) achieves 0.897 Pearson correlation with human judgment, comparable to gpt-4's 0.882, at a fraction of the cost.
- CoT (chain-of-thought) reasoning in the judge prompt improves accuracy, though the improvement varies by task. Always use few-shot examples in your judge prompt — it is one of the highest-leverage improvements you can make.

### Agent-type-specific eval strategies and benchmarks

Different agent architectures require different eval strategies. Using a coding-agent eval approach on a conversational agent (or vice versa) produces misleading results. Per Anthropic's "Demystifying Evals for AI Agents," each trial should start from a clean environment to prevent correlated failures and artificial performance inflation, and outcomes should be graded rather than paths — "agents regularly find valid approaches that eval designers didn't anticipate."

**Coding agents**
- Primary grader: deterministic test execution. Does the code compile? Do unit tests pass? This is cheaper, faster, and more reliable than any LLM judge for correctness.
- Use code coverage and linter checks as secondary quality signals.
- Reference benchmarks: **SWE-bench Verified** (real GitHub issues with verified human solutions) and **Terminal-Bench** (terminal-based task completion). These are the canonical benchmarks for comparing coding agents; cite your score against them when communicating capability.
- Do not use an LLM judge to grade code correctness. Run the code.

**Conversational agents**
- Evaluate at the conversation level, not the turn level (a 90% turn-level pass rate can hide 40% conversation-level failure).
- Use simulated user interactions — a scripted or LLM-driven user simulator — to generate diverse conversation trajectories.
- Rubrics must cover both interaction quality (was the conversation coherent, appropriately paced, free of broken references?) and outcome (did the user's goal get accomplished?).
- Reference benchmarks: **tau-Bench** and **tau2-Bench** (multi-turn conversational agent benchmarks with task-completion ground truth). Use tau-Bench scores as a comparability anchor when evaluating conversational agents.

**Research and RAG agents**
- Run groundedness checks (every factual claim traceable to a retrieved document) and coverage checks (were all relevant sources retrieved?).
- Verify source quality: not all retrieved documents are equally authoritative. Flag cases where the agent cited low-quality or outdated sources.
- Calibrate any LLM rubrics against expert judgment — RAG quality is domain-specific and generic rubrics under-perform calibrated ones.

**Computer use / UI agents**
- Run in sandboxed environments — never evaluate computer use agents against live production systems.
- Ground truth is environment state, not agent claims. Check DOM structure and/or screenshots plus backend state verification. An agent that says "I clicked the button" passes only if the button was actually clicked in the recorded environment state.
- Screenshot-based assertions (visual grounding) must be supplemented by state assertions where possible; pure visual grading is fragile across rendering changes.

Source: Anthropic, "Demystifying Evals for AI Agents."

#### Six-dimension agent eval framework (Arize)

For complex agentic runs, evaluate across six explicit dimensions separately rather than as a composite score. Per Arize Phoenix's agent evaluation framework:

1. **Agent Planning** — Did the agent correctly decompose the task into steps? Were sub-goals sensible and ordered correctly?
2. **Tool Selection** — Did the agent choose the right tool for each step? Were tool selections appropriate given available alternatives?
3. **Parameter Extraction** — Were tool arguments correctly extracted from context? Were required fields present and correctly typed?
4. **Tool Calling** — Did tool invocations succeed? Were error responses handled gracefully?
5. **Path Evaluation** — Was the reasoning trajectory efficient? Did the agent take unnecessary detours or loop?
6. **Self-Reflection** — Did the agent correctly assess its own outputs? Did it catch and correct its own errors?

Score each dimension independently — a high "Tool Calling" score combined with a low "Agent Planning" score tells a fundamentally different story than a composite score. This decomposition makes root cause analysis fast: a low "Parameter Extraction" score points directly to prompt engineering or tool schema definition, while a low "Path Evaluation" score points to reasoning architecture.

Source: Arize, "LLM as a Judge: Primer and Pre-Built Evaluators" (https://arize.com/llm-as-a-judge/)

### Swiss cheese model of eval coverage

No single eval method catches every failure. This is the most important structural principle in eval design.

- Code-based graders catch structural failures (wrong format, missing required fields, failing unit tests) but miss semantic failures (correct format, wrong meaning).
- LLM-as-judge catches semantic failures but has systematic biases and 30–60% recall on factual inconsistencies.
- Human review catches subtle judgment failures but is too slow and expensive to cover the full dataset.
- Production monitoring catches real-world distribution failures that no pre-deployment eval anticipated.
- **The correct answer:** Layer all four. The failures that slip through one layer get caught by the next. A team relying on only one method will be surprised in production; a team with all four layers will be surprised much less often.
- In practice: run deterministic checks first (cheapest), then LLM judges on passing cases for quality signals, then human review on a calibration sample, then monitor production for distribution shift.

### Automated behavioral eval generation (Bloom)

Bloom is Anthropic's open-source four-stage agentic eval generation framework for producing behavioral evals at scale without writing every case by hand:

1. **Understand the target behavior** — define precisely what behavior you are evaluating (e.g., "refuses to assist with harm despite persuasive framing").
2. **Ideate diverse scenarios** — generate a wide variety of situations in which the target behavior could be observed or absent, covering edge cases and adversarial conditions.
3. **Roll out scenarios at scale** — execute the scenarios in parallel using simulated users and tools, producing full transcripts for each.
4. **Judge transcripts** — use an LLM judge to evaluate each transcript for the presence or absence of the target behavior.

Bloom achieved a Spearman correlation of 0.86 with human judgment and successfully separated misaligned model variants from production models in 9 out of 10 behavioral tests. This is strong evidence that automated behavioral eval generation is production-viable for ranking models on safety and alignment properties.

**Behavioral scoring uses a 1–10 presence score, not binary pass/fail.** The Bloom scoring model captures both frequency (how often a behavior appears) and severity (how pronounced it is) on a single 1–10 scale. A binary pass/fail loses this signal — a model that rarely exhibits a dangerous behavior mildly looks identical to one that frequently exhibits it strongly. Use the 1–10 presence score for any eval measuring the degree of a behavioral property (safety, sycophancy, appropriateness), and binary scoring for task completion. Source: https://alignment.anthropic.com/2025/bloom-auto-evals/

**Practical implication:** For large-scale behavioral evals (more than 100 cases), consider automated generation via a Bloom-style iteration rather than writing every case by hand. The key difference from static datasets is that Bloom generates scenarios dynamically based on what behaviors you want to evaluate, then rolls them out at scale — the dataset is a byproduct of the framework, not a prerequisite.

Source: `https://alignment.anthropic.com/2025/bloom-auto-evals/`

### Production continuity (shipping and monitoring)

Eval is not a pre-launch gate. It is a continuous loop. Shipping without production monitoring means your eval coverage ends exactly when real failures begin.

- 93% of eval work in practice is pre-deployment only — production monitoring is the blind spot. The teams that catch failures fastest are the ones with closed feedback loops between production and their eval datasets.
- Every production incident should become a dataset case within 24 hours. That is the most reliable source of cases that matter in practice.
- **The eval flywheel:** production logs → eval dataset cases → eval run → findings → prompt fix → production. Once this loop runs automatically, you ship faster with more confidence. Per Braintrust's CI/CD eval guide, the gold standard is: (a) production traces automatically sampled and imported into the eval dataset, (b) a GitHub Action runs the full eval suite on every PR with a score diff vs. main branch baseline, (c) PRs are blocked if regressions exceed threshold. Braintrust's 'Loop' feature auto-generates new eval cases and refines grader prompts from production trace patterns — teams using this workflow have reported 30%+ accuracy improvements on regression detection.
- System-level evaluation (orchestration, tool use, multi-turn planning) catches emergent failures that component-level evals miss. If you are only evaluating individual turns or individual components, you are missing the failure modes that matter most in production multi-step agents.
- Ship with monitoring, not just evals. The eval tells you the agent worked on your test cases. Monitoring tells you the agent is working on real user inputs.

**When your agent passes evals but fails in production:** This is almost always a distribution mismatch — your eval cases do not reflect real user inputs. Audit 50 recent production traces and compare them to your eval dataset. If you see input patterns, phrasings, or use-case combinations in production that do not appear in your dataset, add them immediately. The second most common cause: the eval environment differs from production (different tools, different data, different system prompt). Verify end-to-end that the eval harness runs the exact same code path as production.

**The eval-production gap diagnostic:** When your agent passes evals but fails in production, run this three-step diagnostic before changing anything: (1) Pull 20 recent production failures. (2) Check whether ANY of them would fail against your current eval dataset. (3) If none would fail, your eval dataset is the problem — it does not represent real user inputs. The dataset needs production cases, not a better prompt. Per Anthropic's internal guidance, the single most common cause of eval-production mismatch is eval datasets written from imagined failure modes rather than observed ones. Real failure cases are always more surprising than imagined ones.

### Continuous red-teaming in CI/CD (PromptFoo)

PromptFoo is an open-source CLI tool for automated adversarial testing in CI/CD. Key capabilities:

- **Attack types**: Includes prompt injection, jailbreaking, PII extraction, harmful content generation, SSRF, SQL injection via natural language, and 40+ other attack strategies. Run with `promptfoo redteam run` to execute all attack types in parallel.
- **CI/CD integration**: Add `promptfoo redteam run --output results.json --ci` to your GitHub Actions or CI pipeline. The `--ci` flag exits non-zero on critical failure, enabling PR blocking. Run against every PR that changes system prompts, tool definitions, or agent behavior.
- **Continuous vs. point-in-time**: Point-in-time red teaming (run once before launch) misses behavioral regressions introduced by prompt changes, model upgrades, or new tool integrations. Continuous CI/CD red-teaming catches these regressions automatically.
- **Threshold setting**: Set minimum acceptable pass rates per attack category in `promptfoo.yaml`. Recommended: 100% resistance to PII extraction and harmful content; 95% resistance to prompt injection; 85% for jailbreaking on general-purpose agents.
- **Integration with Camp AIR harness**: PromptFoo adversarial outputs can be imported as dataset cases — use the generated failure cases to populate your `my-evals/datasets/` directory with real attack patterns your agent actually failed on.

Source: https://www.promptfoo.dev/docs/red-team/

### Eval tooling and platform selection

Fetch `https://hamel.dev/blog/posts/eval-tools/` for a neutral practitioner comparison, or `https://www.braintrust.dev/articles/top-5-platforms-agent-evals-2025` for platform-focused detail. Summary from those sources:

- **Braintrust:** Best default for teams building production-grade agents. The "Loop" feature generates custom graders from natural language descriptions. Free tier handles 1M spans/month; Pro is $249/month. Unified evaluation + observability reduces tool fragmentation.
- **LangSmith:** Best if you are already using LangChain. Native tracing is automatic. Multi-turn eval support. Less mature eval features than Braintrust; Python-focused.
- **Langfuse:** Best if you need self-hosted, cost-controlled, or data-sovereign setup. MIT-licensed core, no usage limits. Requires more engineering effort to operate than hosted alternatives.
- **Vellum:** Best when non-technical stakeholders (PMs, QA) need to participate directly in eval design. Visual workflow builder. Higher price point.
- **Maxim AI:** Best for end-to-end lifecycle with built-in simulation. Higher complexity and steeper learning curve.
- **Key warning from Hamel Husain:** Beware tools that "stack abstractions" — where AI auto-creates rubrics AND auto-scores without human calibration. This produces false confidence. The tool should support human review in the loop for failure analysis, not hide it behind automation.
- **For a workshop with no existing tooling:** Start with Braintrust's free tier or the Camp AIR eval harness. Do not spend the workshop evaluating eval tools — pick one and run evals.
- **Note:** Humanloop was acquired by Anthropic and sunset in September 2025. Former Humanloop users have primarily migrated to Braintrust or Langfuse.

### Anthropic official guidance: defining success criteria and grading hierarchy

Per Anthropic's official test-and-evaluate documentation:

- **Grading hierarchy (cheapest to most expensive):** (1) Code-based evaluation — deterministic checks, unit tests, regex, schema validation. Use these first. (2) LLM-based grading — Claude grades outputs against written criteria. Use when quality requires judgment. (3) Human review — use only for calibration and borderline cases.
- **Writing success criteria:** Define criteria BEFORE writing prompts or code. A good criterion is measurable by someone who has never seen your codebase. If it requires insider knowledge, it's too vague.
- **LLM grader prompt pattern:** Give Claude the task description, the criteria, and the model output. Ask it to evaluate the output against the criteria and return a structured verdict. Include few-shot examples of pass and fail cases in the prompt — this is the single highest-leverage technique.
- **Binary verdicts over scores:** The official guidance recommends binary pass/fail over numeric scales. A binary decision forces you to draw a line; a numeric score allows hedging that obscures whether the agent actually meets your bar.
- **Use a different model to evaluate:** Do not use the same model that produced the output to also evaluate it. Self-enhancement bias (the model preferring its own outputs) corrupts the score. Use Claude to evaluate outputs from other models, or use a different Claude model version.

Source: https://platform.claude.com/docs/en/test-and-evaluate/develop-tests

### Eval observability standards

Industry platforms (Arize, LangSmith, Phoenix) are converging on **OpenTelemetry** and **OpenInference** as open standards for capturing agent traces and eval results. This matters for two reasons: (1) trace data is portable between tools without vendor lock-in, (2) eval results can be correlated directly with production traces in the same schema.

For the Camp AIR harness: if you later move to a production eval platform, exporting your harness results as OpenTelemetry spans means your dataset and results go with you. Do not build evaluations tightly coupled to a single platform's proprietary schema.

**Practical recommendation:** If you are evaluating tooling today, prioritize platforms that emit OpenInference-compatible traces. Arize Phoenix is open-source and emits standard traces. Braintrust integrates with OpenTelemetry. LangSmith supports OpenTelemetry export as of 2025.

Source: Arize, 'Comparing LLM Evaluation Platforms: Top Frameworks for 2025' (https://arize.com/llm-evaluation-platforms-top-frameworks/)

---

## Example invocations

```
/eval-faq What eval scenarios should I use for a RAG agent?
/eval-faq How do I interpret a 75% knowledge grounding score?
/eval-faq What is the difference between business-problem and capability scenarios?
/eval-faq When should I use a model-graded grader instead of a deterministic one?
/eval-faq What makes a good adversarial test case?
/eval-faq How many cases do I need in a dataset to get meaningful signal?
/eval-faq My eval passes 100% on first run — is that good?
/eval-faq How do I write a good criterion for a model-graded grader?
/eval-faq What should I do when a grader disagrees with my gut feeling about an output?
/eval-faq How do I handle non-determinism in my eval results?
/eval-faq My agent makes tool calls — how do I eval those?
/eval-faq I suspect my grader is wrong — how do I debug it?
/eval-faq What should I eval in production after I ship?
/eval-faq Should I use pass@k or pass^k for my agent?
/eval-faq How do I calibrate my LLM-as-judge grader?
/eval-faq When do I stop adding eval cases and just ship?
/eval-faq My agent finds a different tool sequence than I expected — is that a failure?
/eval-faq How do I know if my grader is actually measuring what I think it is?
/eval-faq What is the difference between a capability eval and a regression suite?
/eval-faq How do I eval a multi-turn conversational agent?
/eval-faq What eval platform or tool should I use?
/eval-faq My agent passes evals but fails in production — why?
/eval-faq How do I score intermediate steps in a multi-step agent?
/eval-faq What does 0% pass@100 mean — is my agent broken?
/eval-faq How do I avoid LLM judge bias in my grader?
/eval-faq Should I use a single LLM judge or a panel of models?
/eval-faq What are the three multi-turn attack patterns I should test for?
/eval-faq Why is single-turn adversarial testing not enough for a conversational agent?
/eval-faq What is the critique shadowing methodology for building LLM judges?
/eval-faq Should I use a 1-5 scale or pass/fail for my LLM judge?
/eval-faq What benchmark should I use to evaluate a coding agent?
/eval-faq How many expert-agreement samples do I need before I can trust my LLM judge?
/eval-faq How do I automate eval case generation at scale?
/eval-faq What's the safest way to pick an eval platform without getting locked in?
/eval-faq How do I continuously red-team my agent in CI/CD?
/eval-faq Are BLEU and ROUGE good metrics for agent evals?
/eval-faq How do I know if my task spec is clear enough before writing code?
/eval-faq How do I write evals before my agent feature is built?
/eval-faq What is eval-driven development and how do I apply it?
/eval-faq What does axial coding mean in the context of eval analysis?
/eval-faq How do I systematically analyze eval failures to find patterns?
/eval-faq How do I integrate my eval suite into CI/CD?
/eval-faq What threshold should I set for blocking a build in CI?
/eval-faq What's the difference between reference-free and reference-aware LLM judging?
/eval-faq How should I score safety/behavioral properties — pass/fail or a scale?
/eval-faq What scoring convention should I standardize on before writing my first eval?
/eval-faq What does pass@k equal at 70% per-trial success rate with k=10?
/eval-faq Should I use OpenTelemetry for my eval traces?
/eval-faq How do I score multiple eval dimensions without 3x judge cost?
/eval-faq How do I red-team a tool-using agent differently from a conversational agent?
/eval-faq How do I evaluate an agent across Planning, Tool Selection, and Self-Reflection separately?
/eval-faq What's the difference between offline evals and online production monitoring?
/eval-faq What happened to Humanloop — is it still a viable eval platform?
/eval-faq How do I handle memory manipulation attacks in my red-teaming suite?
/eval-faq Should I version my grader prompts, and how?
/eval-faq How do I automatically generate eval cases from production traces?
/eval-faq What is Agent-as-a-Judge and when should I use it?
/eval-faq Should I use a 3-point scale or binary pass/fail for my LLM judge?
/eval-faq Are LLM judges accurate enough for production use in specialized domains?
/eval-faq Should I run separate judges per criterion or bundle them into one call?
/eval-faq I'm writing my first eval case — what fields does it need?
/eval-faq The harness shows 3/5 cases passed — should I ship or iterate?
/eval-faq How do I test whether my agent stays within a 400-character response?
/eval-faq My grader keeps giving false failures — how do I debug it?
/eval-faq I'm running out of time in the workshop — what's the minimum viable eval suite?
/eval-faq What's the fastest way to add a case from a real user failure?
/eval-faq How do I know if my eval is too easy?
/eval-faq How do I write an LLM grader prompt that actually works?
/eval-faq Should I score factuality and tone in the same eval criterion?
/eval-faq What does Anthropic's official guidance say about success criteria for evals?
/eval-faq How do I red-team my agent automatically in CI/CD?
/eval-faq What is the right grading approach for an agentic pipeline with 5 steps?
/eval-faq How do I eval the orchestration layer of a multi-agent system?
/eval-faq I'm evaluating a pipeline — should I test components individually or end-to-end?
/eval-faq How do I diagnose why my agent passes evals but fails in production?
```
