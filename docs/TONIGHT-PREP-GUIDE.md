# Camp AIR Workshop — Tonight's Preparation Guide

**Session:** 1 hour, mostly hands-on, ~30 participants
**Date:** Tomorrow (March 23, 2026)
**Repo:** https://github.com/serenaxxiee/camp-air-eval-harness

---

## 8:00 PM — Critical Technical Verification (60 min)

### 1. Clone the repo and verify structure

```bash
# In Git Bash (NOT PowerShell)
cd ~
rm -rf camp-air-test  # clean slate
git clone https://github.com/serenaxxiee/camp-air-eval-harness camp-air-test
cd camp-air-test
```

**Verify the skills folder exists:**
```bash
ls skills/
# Should show: eval-faq  eval-generator  eval-result-interpreter  eval-suite-planner
ls skills/eval-*/SKILL.md
# Should show 4 SKILL.md files
```

If the `skills/` directory is missing or incomplete, the repo clone is broken. Re-clone.

### 2. Test skill installation end-to-end

```bash
# Create target directory (participants may not have it)
mkdir -p ~/.claude/skills

# Copy skills
cp -r ../skills/eval-faq ~/.claude/skills/
cp -r ../skills/eval-generator ~/.claude/skills/
cp -r ../skills/eval-result-interpreter ~/.claude/skills/
cp -r ../skills/eval-suite-planner ~/.claude/skills/

# Verify
ls ~/.claude/skills/eval-*/SKILL.md
# Should show 4 files
```

Then restart Claude Code and test:
```
/eval-faq what is eval
```
Should produce a structured 3-5 sentence answer citing Microsoft sources.

### 3. Run the full demo end-to-end (time yourself — must be under 10 min)

**Start a timer**, then in Claude Code:

```
/eval-suite-planner I'm building a customer support agent for a premium hand-wash t-shirt product. It answers questions about product care (washing, drying, ironing), sizing, storage, warranty claims, and escalates issues it cannot resolve.
```

Wait for the scenario plan table. Then in the **same session**:

```
/eval-generator
```

Confirm it detects the plan and generates test cases with Scenario IDs.

Then test the interpreter with the synthetic results CSV:
```
/eval-result-interpreter Review the results in docs/synthetic-eval-results.csv
```

Confirm it reads the CSV and produces a structured breakdown of pass/fail patterns and recommendations.

**The demo is now purely skills-based:** Plan → Generate → Interpret synthetic CSV. No harness, no API calls, no terminal commands mid-demo.

### 4. Verify you have synthetic-eval-results.csv ready to share

Participants will need this file for the interpretation step. Confirm your distribution plan:
- [ ] File is in the repo and accessible after clone
- [ ] Backup plan: ready to share via Teams chat, shared drive, or displayed on screen
- [ ] Open the CSV yourself — confirm it has realistic pass/fail data across multiple scenarios

---

## 9:00 PM — Audience Preparation (30 min)

### 5. Send the pre-session email

> **Subject: [Camp AIR Tomorrow] Setup Instructions — Please Complete Before the Session**
>
> To get the most out of tomorrow's hands-on workshop, please complete these steps before arriving (10 min):
>
> **Step 1:** Install Claude Code CLI and authenticate — verify with `claude --version`
>
> **Step 2:** Clone the repo (use **Git Bash** on Windows, not PowerShell):
> ```
> git clone https://github.com/serenaxxiee/camp-air-eval-harness
> cd camp-air-eval-harness
> ```
>
> **Step 3:** Install the 4 AI skills:
> ```
> mkdir -p ~/.claude/skills
> cp -r skills/eval-faq ~/.claude/skills/
> cp -r skills/eval-generator ~/.claude/skills/
> cp -r skills/eval-result-interpreter ~/.claude/skills/
> cp -r skills/eval-suite-planner ~/.claude/skills/
> ```
> Then restart Claude Code (type `/exit`, then `claude` again).
>
> **Step 4:** Verify: In Claude Code, run `/eval-faq what is eval` — you should see a structured answer.
>
> **Windows users:** Use Git Bash for ALL commands. If `cp -r` fails, manually copy the 4 folders from `skills/` to `%USERPROFILE%\.claude\skills\`.
>
> **If anything fails,** reply to this email and I'll help troubleshoot.

### 6. Prepare USB/network fallback

Put these on a USB drive or network share:
- [ ] The full repo as a zip file
- [ ] The 4 skill folders ready to copy
- [ ] synthetic-eval-results.csv

---

## 9:30 PM — Contingency Planning (30 min)

### 7. Practice the demo failure recovery

The #1 risk is Claude Code auth failing or skills not loading during the live demo. Practice this switch:

**When Claude Code can't authenticate or a skill doesn't respond**, say exactly:
> "Looks like Claude Code is having a moment — let me restart and try again. While it reconnects, let me walk you through what each step produces."

Switch to your pre-captured screenshots or a second Claude Code session you authenticated earlier. Continue narrating as if nothing happened. **Practice this switch once** so it feels natural.

### 8. Know the contingency playbook

| Scenario | What to do |
|---|---|
| **Live demo fails (Claude Code auth)** | Use a second pre-authenticated session. Or narrate from screenshots. |
| **Half the room can't install skills** | Pair up: one working setup + one not. Pair programming is valid. |
| **Claude Code auth fails for a participant** | Pair up with someone who has it working. Two people, one screen. |
| **Skills not detected after install** | Restart Claude Code (`/exit` then `claude`). If still missing, manually re-copy skill folders and restart. |
| **Only 15 min left for hands-on** | Skip the planner. Copy the example plan directly into /eval-generator. Jump to interpreter with the CSV. |
| **WiFi can't handle 30 Claude Code sessions** | Stagger: half start during opening slides, half during demo. |
| **100% pass rate in synthetic CSV** | "This is synthetic data — in real life, 100% means your tests are too easy. What's the hardest case your agent faces?" |

### 9. Prepare a shared debrief doc

Create a shared document (OneNote, Google Doc, or Teams whiteboard) where participants paste their 3 debrief answers. Share the link on a slide or in chat.

---

## 10:00 PM — Presentation Polish (30 min)

### 10. Test slides render offline

The slides depend on reveal.js from CDN. If venue WiFi is unreliable:
```bash
cd camp-air-test
npm install reveal.js@5.1.0
```
Then update the two `<link>` tags and `<script>` tag in `index.html` to point to local files.

Test by opening `index.html` in a browser.

### 11. Pre-open everything on your presentation laptop

Have these ready (one keystroke to switch):
- [ ] Browser with slides (index.html)
- [ ] Claude Code session ready (authenticated, skills loaded)
- [ ] synthetic-eval-results.csv open and ready to share
- [ ] Notifications OFF, Slack closed, email closed

### 12. Print the timing card

Tape this to your laptop bezel:

```
0:00  Opening hook
0:05  Core Concepts (5 terms)
0:13  Live Demo (plan → generate → interpret CSV)
0:24  "What You'll Build" → GO (start hands-on)
0:34  Part 2: Generate (check-in at 0:40)
0:49  Part 3: Interpret synthetic CSV
0:52  HARD STOP → Debrief starts (no exceptions)
0:57  Key Takeaways
1:00  End
```

---

## Tomorrow Morning — 60 min before session

### 13. Room verification

- [ ] Connect to room WiFi, verify Claude Code authenticates
- [ ] Open slides on projector — confirm readable from back row
- [ ] Test terminal font size (18pt minimum)
- [ ] Check power outlets for participants
- [ ] Verify Claude Code works on room WiFi (run `/eval-faq` as a quick test)

### 14. Entry state

Display Slide 16 (Setup Instructions) on the projector as participants arrive. This gives early arrivals something to do.

Walk the room as people sit down. Glance at screens. Ask a few: "Have you installed the skills? Try `/eval-faq`." Fix setup issues NOW, not during hands-on.

### 15. Pre-session poll

Ask early arrivals: "Who has Claude Code CLI installed?" Count hands. If <50%, plan to spend 2 extra minutes on setup during the session.

---

## Key Facilitator Moments to Nail

### The Live Demo (Slide 11, 0:13-0:23)

Script:
1. **Plan** (2 min): Run `/eval-suite-planner` with T-shirt customer service agent description. Point at one row in the scenario table.
2. **Generate** (3 min): Run `/eval-generator` in same session. Show the Copilot Studio table. Highlight how it references the plan's Scenario IDs.
3. **Show synthetic CSV** (1 min): Open synthetic-eval-results.csv. Point out the structure — scenarios, expected vs. actual, pass/fail columns.
4. **Interpret** (3 min): Run `/eval-result-interpreter` on the CSV. Pick one pass and one fail from the output. Land the insight: "Failing an eval doesn't mean your AI is broken — it means you have information."

### The Transition to Hands-On (Slide 13, 0:24)

Stand in center. Speak louder:
> "Open your laptops. Open Claude Code. Start with /eval-faq — ask it two questions. Then run /eval-suite-planner and describe your agent. IMPORTANT: stay in the same Claude Code session for all three parts. Go."

Walk to the back. Wait 3-4 minutes before roving. The room will look chaotic. That's normal.

### The Mid-Session Check-In (0:40)

Walk to center:
> "Quick check — raise your hand if you have test cases generated and ready to upload."

If <50%: "Copy the generator output as-is. Don't perfect it. An imperfect eval set that exists beats a perfect one that doesn't."

### The Debrief (0:52)

You should have spotted 2-3 interesting results while roving. Call on them:
> "[Name], I saw something interesting on your screen — walk us through what happened."

If nobody generated test cases:
> "Who got /eval-generator to produce output? Even if it wasn't perfect?"

If room is silent:
> "Who looked at the synthetic CSV? What surprised you about the pass/fail patterns?"

---

## Top 5 Things That Will Trip Up Participants

From the struggling-participant roleplay:

| # | Issue | Your verbal fix |
|---|---|---|
| 1 | **Opens PowerShell instead of Git Bash** (breaks cp -r, ~, mkdir) | "Everyone on Windows: open Git Bash, not PowerShell. Start Menu, search Git Bash. You should see a $ prompt." |
| 2 | **~/.claude/skills/ doesn't exist** (cp -r fails) | "Run `mkdir -p ~/.claude/skills` first, then the copy commands." |
| 3 | **Doesn't restart Claude Code** (skills not detected) | "Type `/exit` then `claude` to restart. Skills load on startup." |
| 4 | **Closes session between planner and generator** (plan lost) | "No problem — just type `/eval-generator` followed by your agent description again." |
| 5 | **Forgets to stay in the same session** (plan context lost for generator) | "The generator needs the planner's output in the same session. Start fresh: run the planner, then immediately run the generator without exiting." |

---

## The One Thing That Matters Most

Per the facilitator guide:

> **Every participant generates a complete eval test set and interprets results using /eval-result-interpreter.**

If someone is stuck at 0:48 and hasn't generated anything, drop everything else:
> "Run /eval-generator now and describe your agent in one sentence. Then open the synthetic-eval-results.csv and run /eval-result-interpreter to see what interpretation looks like."

A generated eval set that exists is worth infinitely more than a perfect plan that never becomes test cases.
