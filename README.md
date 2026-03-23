# Camp AIR: AI Agent Evaluation

Interactive presentation and hands-on materials for the Camp AIR eval workshop.

## Live Presentation

**[Open the slides](https://serenaxxiee.github.io/camp-air-eval-harness/)** (GitHub Pages)

Use arrow keys or swipe to navigate. Press `f` for facilitator guide, `h` for hands-on exercises.

## What's Inside

| Path | What |
|---|---|
| `index.html` | Interactive slide deck (reveal.js) |
| `skill-deep-dive.html` | Detailed skill reference page |
| `docs/` | Session outline, facilitator guide, hands-on exercises, participant guide |
| `docs/synthetic-eval-results.csv` | Pre-built eval results for a T-shirt customer service agent (12 cases, 67% pass rate) |
| `docs/tshirt-support-*.csv/.docx/.xlsx` | Fallback examples for every demo stage (plan, test set, triage report) |
| `eval-harness/` | Working TypeScript eval harness participants run |
| `skills/` | 4 installable Claude Code skills |

## Quick Start for Participants

```bash
# Clone the repo (use Git Bash on Windows, not PowerShell)
git clone https://github.com/serenaxxiee/camp-air-eval-harness
cd camp-air-eval-harness

# Install the 4 AI skills
mkdir -p ~/.claude/skills
cp -r skills/eval-faq ~/.claude/skills/
cp -r skills/eval-generator ~/.claude/skills/
cp -r skills/eval-result-interpreter ~/.claude/skills/
cp -r skills/eval-suite-planner ~/.claude/skills/

# Restart Claude Code, then verify
claude
# Type: /eval-faq what is eval
```

## The 4 AI Skills

| Skill | Purpose |
|---|---|
| `/eval-faq` | Answer eval methodology questions from authoritative sources |
| `/eval-suite-planner` | Plan a comprehensive eval suite (categories, distribution, thresholds) |
| `/eval-generator` | Generate eval scenarios and test cases for any agent |
| `/eval-result-interpreter` | Triage results: SHIP / ITERATE / BLOCK verdict + remediation |

## Resources

- [MS Learn: Agent Evaluation Overview](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/evaluation-overview)
- [Eval Scenario Library](https://github.com/microsoft/ai-agent-eval-scenario-library)
- [Triage & Improvement Playbook](https://github.com/microsoft/triage-and-improvement-playbook)
- [Eval Guidance Kit](https://aka.ms/EvalGuidanceKit)
