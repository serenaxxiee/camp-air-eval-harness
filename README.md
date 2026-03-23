# Camp AIR: AI Agent Evaluation

Interactive presentation and hands-on materials for the Camp AIR eval workshop.

## Live Presentation

**[Open the slides](https://serenaxxiee.github.io/camp-air-eval-harness/)** (GitHub Pages)

Use arrow keys or swipe to navigate. Press `f` for facilitator guide, `h` for hands-on exercises.

## What's Inside

| Path | What |
|---|---|
| `index.html` | Interactive slide deck (reveal.js) |
| `docs/` | Session outline, facilitator guide, hands-on exercises, moltbook |
| `eval-harness/` | Working TypeScript eval harness participants run |
| `skills/` | 4 installable Claude Code skills |

## Quick Start for Participants

```bash
git clone https://github.com/serenaxxiee/camp-air-eval-harness
cd camp-air-eval-harness/eval-harness
npm install

# Install the 4 AI skills
cp -r ../skills/eval-faq ~/.claude/skills/
cp -r ../skills/eval-generator ~/.claude/skills/
cp -r ../skills/eval-result-interpreter ~/.claude/skills/
cp -r ../skills/eval-suite-planner ~/.claude/skills/

# Set API key and verify
export ANTHROPIC_API_KEY=sk-ant-...
npm test
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
