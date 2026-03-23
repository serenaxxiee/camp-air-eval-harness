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
| `eval-examples/` | Pre-built eval examples and fallback artifacts for every demo stage |
| `eval-examples/synthetic-eval-results.csv` | Synthetic eval results for T-shirt customer service agent (12 cases, 67% pass rate) |
| `eval-examples/tshirt-support-*` | Fallback examples: eval plan (.docx/.xlsx), test set import (.csv), triage report (.docx) |
| `skills/` | 4 installable Claude Code skills — **use this folder for installation** |
| `eval-harness/` | TypeScript eval harness (reference implementation — NOT used during the workshop hands-on) |

## Quick Start for Participants

A Claude Code **skill** is a markdown file (SKILL.md) that gives Claude specialized instructions for a task. When you copy a skill folder to `~/.claude/skills/` and restart Claude Code, it becomes available as a slash command (e.g., `/eval-faq`).

```bash
# Prerequisites: Claude Code CLI (https://docs.anthropic.com/en/docs/claude-code)
# Verify with: claude --version

# Clone the repo (use Git Bash on Windows, not PowerShell)
git clone https://github.com/serenaxxiee/camp-air-eval-harness
cd camp-air-eval-harness

# Install the 4 AI skills (copy from skills/ at the repo root)
mkdir -p ~/.claude/skills
cp -r skills/eval-faq ~/.claude/skills/
cp -r skills/eval-generator ~/.claude/skills/
cp -r skills/eval-result-interpreter ~/.claude/skills/
cp -r skills/eval-suite-planner ~/.claude/skills/

# Restart Claude Code (type /exit if already running, then start again)
claude
# Type: /eval-faq what is eval
# If you see a focused 3-5 sentence answer citing Microsoft sources, skills are working
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
