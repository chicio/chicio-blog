---
name: fabrizioduroni-blog-sdlc
description: Orchestrate the full code SDLC for chicio-blog — explore → brainstorm → implement ⇄ review → PR (feature mode), or investigate → confirm → implement ⇄ review → PR (fix mode). Interactive (two human gates) or --autonomous (issue-as-contract, async label gates, PR-only, never merges). Code work only.
disable-model-invocation: true
---

# fabrizioduroni-blog-sdlc — orchestrator

You (the main thread) run this pipeline manually and in sequence, dispatching the specialized agents and hosting the
human gates. This is deliberately a **visible, main-thread** orchestration (not an opaque orchestrator agent) so the
sequencing is deterministic, the implement⇄review loop is observable, the human gates are real, and token spend is
controlled.

**Scope: CODE work only.** Content (MDX blog prose, DSA articles) is out of scope — see the Content firewall in
Intake.

**CodeGraph.** The repo is indexed by CodeGraph, and every code agent in the roster (explorer, implementer, reviewer,
bug-investigator) carries its own `codegraph_explore` access and codegraph-first instructions — do not re-explain the
tool in stage prompts. When **you** (the orchestrator) need a quick code fact between stages — scoping a slug,
sanity-checking a finding, sizing a change — use `codegraph_explore` yourself instead of a grep/read loop.

## Invocation

```
/fabrizioduroni-blog-sdlc [description] [--fix] [--in-place]      # interactive (Phase 1)
/fabrizioduroni-blog-sdlc --autonomous --from-issue <N>           # autonomous (Phase 2)
```

- `[description]` — what to build or fix (free text).
- `--fix` — select **fix mode**. Also implied if the user pastes a stack trace / error / failing-test output.
- `--in-place` — run in the **current** working tree instead of an isolated worktree. The pipeline is **isolated by default** (§ Isolation); pass this only when you deliberately want the live-tree, micro-commit-visible flow. Ignored in `--autonomous` mode (autonomous is always isolated).
- `--autonomous --from-issue <N>` — select **autonomous mode**: read GitHub issue `#N` as the contract, replace both human gates with async label gates, and land a PR unattended (never merge). See **§ Autonomous mode (Phase 2)**. Mode within autonomous (feature vs fix) is taken from the issue's **Type** field, not `--fix`.

Create a todo list with one item per stage of the selected mode, and work them in order. Do not skip a gate.

## Phase boundary (read before you start)

The stages below are **Phase 1 — the interactive pipeline.** Every human-interactive step is marked **[INTERACTIVE]**
(grilling at Gate 1, the confirm gate in fix mode, the PR gate). **Phase 2 — autonomous mode** (§ Autonomous mode)
reuses the non-interactive stages (Explore, Implement, Review, the 3⇄4 loop) **verbatim** and replaces only the
**[INTERACTIVE]** steps with issue-as-contract inputs and async label gates. Because of that separation, autonomous
mode is a flag flip, not a fork of the pipeline — so keep all interaction inside the **[INTERACTIVE]** steps and never
bake prompts into the non-interactive stages.

## Stage 0 — Intake (always)

1. **Parse** the description and flags. Decide mode: fix if `--fix` or a pasted trace/error is present, else feature.
2. **Content firewall.** If the task is purely content — adding/editing MDX blog posts, DSA articles, or prose — STOP
   and redirect: blog prose → `fabrizioduroni-writer-engineer`; DSA articles → `fabrizioduroni-writer-dsa-engineer`.
   This pipeline is for code. (A change that is *both* code and content stays here for the code part.)
3. **Isolation (default ON).** Unless `--in-place` was passed, `EnterWorktree` now — the whole pipeline runs in its
   own isolated worktree on its own `feat/<slug>` branch. This is the chicio default (diverging from mobile's in-place
   default) because this is a solo, often multi-session setup: running in the live working tree can collide with
   another session or sweep in stray uncommitted changes. Pipeline-level only — never per-agent (§ Isolation).
4. **Branch guard.** In `--in-place` mode, run `git status`; if on `main`, create and switch to `feat/<slug>` (never
   commit to `main`). In isolated mode the worktree already carries its own `feat/<slug>` branch. Slug from the
   description, refined after brainstorm.

## Feature mode

### Stage 1 — Explore
Dispatch **`fabrizioduroni-explorer`** (haiku, read-only) with the description. It returns the structured exploration
report (files by layer, reusable design-system surface, registration points, test surface, decisions to resolve).
Keep the report; it feeds Stages 2 and 3.

### Stage 2 — Brainstorm 🚪 **[INTERACTIVE] — HUMAN GATE 1**
Invoke the **`grilling`** skill in the main thread, fed the exploration report + the description (+ any §9 "decisions
to resolve" the explorer surfaced). Interview the user until the approach is nailed and an **approved plan** exists.
- Plan handoff: **inline** in the implementer's prompt for small feature-slices; **persisted to a scratchpad plan
  file** for full-feature work (and later fed to the reviewer alongside the diff).
- **Do not proceed to Stage 3 until the user has approved the plan.**

### Stage 3 — Implement
Dispatch **`fabrizioduroni-implementer`** (sonnet) with the **approved plan** + the **exploration report**. It writes
code + tests, **micro-commits per logical step**, and runs ALL mechanical gates (below) before handing off. It does
not open the PR. Capture its handoff summary (what it built, gate results, tests added, uncertainties).

### Stage 4 — Review (+ live-QA arm)
Dispatch **`fabrizioduroni-code-reviewer`** (opus) with the diff (`git diff main...HEAD`) + the approved plan. It
**re-runs the gates to verify** (never trusts), reviews against `CLAUDE.md` + `.claude/rules/*` + the plan, runs the
Playwright E2E suite when UI/route/flow files changed, and returns a verdict: `PASS` or `CHANGES_REQUIRED` with
severity-classified findings.

**Live-QA arm (conditional).** When the diff touches rendered UI / routing / flows (`src/app/**` routes,
`src/components/features/**`, `src/components/design-system/**` rendered output, navigation/forms/streaming), **also
dispatch `fabrizioduroni-e2e-sentinel`** — the reviewer has no Agent tool and can't nest-dispatch, so the orchestrator
runs it — passing the changed flow + the URL(s) to check. It drives agent-browser against the running app and returns
a QA report. **Merge its findings into the review verdict:** a `blocking` sentinel finding (feature visibly
broken/missing) forces the overall verdict to `CHANGES_REQUIRED`; non-blocking ones are reported. This keeps live QA
inside the single Stage-5 loop — no separate loop path.

### Stage 5 — Loop 3⇄4 (the bounded self-correction loop)
- If verdict is **PASS** (zero blocking findings) → go to Stage 6.
- If **CHANGES_REQUIRED**: send the **blocking** findings back to `fabrizioduroni-implementer`. It either **fixes**
  them (and re-runs gates) or **rebuts once** with written technical justification. Then re-dispatch
  `fabrizioduroni-code-reviewer` for a re-review round.
- **Max 3 rounds.** Only **blocking** findings force a round (non-blocking are reported, never loop).
- **Rebuttal handling:** if the reviewer accepts a rebuttal, the finding is withdrawn. If the reviewer **re-asserts a
  finding after a valid-looking rebuttal, escalate to the human** — do not keep looping on a standoff.
- After 3 rounds without convergence, **stop** and surface the open findings to the human; do not loop further.

### Stage 6 — Pull request 🚪 **[INTERACTIVE] — HUMAN GATE 2**
Show the human the final diff + a review summary (verdict, findings resolved, any open non-blocking notes).
**Wait for approval.** On approval:
1. Push the feature branch.
2. Open the PR with `gh pr create` to `main`, conventional-commit + Gitmoji title, using the PR template below.
3. Start a **non-blocking** CI watch (don't block the human on it).
4. Unless `--in-place`: `ExitWorktree` (the pushed branch remains for review).
Return the PR URL.

## Fix mode (delta)

Stages 1–2 are replaced; Stages 3–6 are identical to feature mode.

### Stage 1' — Investigate
Dispatch **`fabrizioduroni-bug-investigator`** (opus) with the pasted stack trace / error + the description. It returns
a structured root-cause report (offending code, introducing commit, root cause, blast radius, fix direction + the
failing-test shape). It writes its findings to memory **regardless** of what happens next.

### Stage 2' — Confirm root cause 🚪 **[INTERACTIVE] — HUMAN GATE 1']**
Present the root-cause report. The human decides:
- **Proceed** → the report becomes the approved plan; continue to Stage 3 (implementer writes the failing test first,
  then the fix — strict red-green).
- **Decline** → investigate-only. Stop the pipeline cleanly. (The investigator already persisted its memory, so the
  diagnosis is not lost.)

## Autonomous mode (Phase 2)

`--autonomous --from-issue <N>` runs the pipeline **unattended** against GitHub issue `#N`. It reuses the
non-interactive stages of feature/fix mode **verbatim** (Explore, Implement, Review, the 3⇄4 loop, the mechanical
gates, the severity model) and swaps only the two human gates:

| Interactive gate | Autonomous replacement |
|------------------|------------------------|
| **Gate 1 — grilling / confirm-root-cause** | The **`loop:ready` label is the approval** + a **pre-flight contract check** (A1). No interview. |
| **Gate 2 — PR approval** | **Open the PR and stop.** The loop **never merges** — the human merge click is the async gate. |

**Two hard invariants:** the loop **never merges** and **never prompts a human** mid-run. Every run ends in exactly
one of two terminal states: a **PR opened** (`loop:review`) or **`loop:blocked`** (with an explanatory comment). It
owns all label transitions for the issue it is given, so a manual `--from-issue N` run is fully self-contained (no
drainer required).

Work the stages below in order (make them your todo list).

### A0 — Claim & read the contract
1. Read the issue: `gh issue view <N> --json number,title,body,labels,state`.
2. **Eligibility guard.** The issue must be **open**, carry **`loop:ready`**, and **not** carry `loop:working`. If
   not, abort immediately without changing anything (the caller selected the wrong issue).
3. **Claim (the mutex).** Before any other work: `gh issue edit <N> --add-label loop:working --remove-label loop:ready`.
   This is what stops a second tick or a second session from grabbing the same issue.

### A1 — Validate the contract 🚦 (replaces GATE 1 — no worktree yet)
Both checks read the issue body only; do them **before** `EnterWorktree` so a rejection costs nothing.
1. **Content firewall.** If the code-only checkbox is unchecked, or the task is purely content (MDX prose / DSA
   article) → **BLOCK** with reason: "content task — route to `fabrizioduroni-writer-engineer` /
   `fabrizioduroni-writer-dsa-engineer`."
2. **Completeness check.** The contract must be buildable unattended: **concrete, non-placeholder acceptance
   criteria** and an **explicit scope**. Empty checkboxes, "TBD", or a missing scope section → **BLOCK** with reason:
   "insufficient contract — missing/placeholder <field>." **Do not guess.** This is grilling's safety valve relocated:
   never spend a build on a vague issue.
3. If both pass, the issue body (problem + acceptance criteria + scope + placement hints) **is the approved plan** —
   the acceptance criteria are what the reviewer verifies the diff against. Pick mode from the issue **Type**
   (`fix` → fix-mode red-green; `feature`/`hygiene` → feature-mode). Refine a `feat/issue-<N>-<slug>` slug.

**BLOCK procedure (used by A1 and A5):** `gh issue edit <N> --add-label loop:blocked --remove-label loop:working`,
then `gh issue comment <N>` with the reason, then STOP. A blocked issue needs a human to fix and re-apply `loop:ready`.

### A2 — Isolate
`EnterWorktree` on the `feat/issue-<N>-<slug>` branch. **Always isolated** in autonomous mode (`--in-place` is
ignored) — each issue gets its own worktree so a drainer can run issues back-to-back without collisions.

### A3 — Explore
Identical to feature Stage 1: dispatch **`fabrizioduroni-explorer`** with the contract as the description. Keep the
report for A4.

### A4 — Implement
Identical to feature Stage 3 (or fix Stage 3 for `Type: fix` — failing test first, strict red-green): dispatch
**`fabrizioduroni-implementer`** with the **contract-as-plan** + the exploration report. It micro-commits and runs
ALL mechanical gates before handoff.

### A5 — Review ⇄ loop
Identical to feature Stages 4–5: dispatch **`fabrizioduroni-code-reviewer`** (+ **`fabrizioduroni-e2e-sentinel`** when
UI/route/flow changed), verify gates, review against `CLAUDE.md` + `.claude/rules/*` + **the acceptance criteria**,
loop blocking findings back to the implementer, **max 3 rounds**.
- **PASS** (zero blocking findings) → A6.
- **No convergence after 3 rounds, or a reviewer/implementer standoff** (there is no human to escalate to
  mid-run) → **push the branch** (so the work isn't lost), then **BLOCK** with the open findings listed in the comment,
  linking the pushed branch. Do **not** open a PR from a non-converged state.

### A6 — Open PR (replaces GATE 2 — never merges)
1. Push the `feat/issue-<N>-<slug>` branch.
2. `gh pr create` to `main` using the **PR template** below; title = conventional-commit + Gitmoji from the issue;
   body includes `Closes #<N>`.
3. Transition labels: `gh issue edit <N> --add-label loop:review --remove-label loop:working`.
4. Start a **non-blocking** CI watch (do not wait on it, do not merge).
5. `ExitWorktree` (**keep** — the pushed branch remains for the human to review and merge).
6. Return the PR URL. **Never merge.**

## Mechanical gates (run by implementer pre-handoff; re-run by reviewer to verify)

1. `npm run lint`
2. `npm run validate-architecture`
3. `npm run knip`
4. `npm run typecheck` — from a CLEAN state (`rm -f next-env.d.ts`, then `rm -rf .next`, then run).
5. `npm run test:run`
6. `npm run build`
7. `npm run test:e2e` — conditional: only when the diff touches rendered UI / routing / user flows.

## Severity model

- **Blocking** (forces a loop round): correctness bug; architecture-boundary violation; missing/failing test or a
  vacuous test for changed behavior; security issue; UI/behavior mismatch vs the plan; broken/uncovered E2E flow; any
  mechanical gate red.
- **Non-blocking** (reported, never loops): style, naming, optional refactors, micro-optimizations.

## Isolation

Pipeline-level only — **never** per-agent. Per-agent worktrees would give the reviewer a different worktree and break
the loop.
- **Default (isolated):** `EnterWorktree` at Intake, run the whole pipeline (including the e2e-sentinel) in that one
  shared worktree, `ExitWorktree` at the end. This is the chicio default — it prevents collisions with other sessions
  and stray uncommitted changes in the live tree. The isolated worktree must have project dependencies available
  (the `EnterWorktree` harness provides them); the sentinel reports a setup issue if `npm run dev` can't start.
  Parallel stories = multiple isolated pipelines.
- **`--in-place`:** run in the current working tree; the diff appears live via the implementer's micro-commits. Use
  only when you're not running another session against the same clone.

## PR template (Gate 2)

```bash
gh pr create --title "<type>(<scope>): :<gitmoji>: <short description>" --body "$(cat <<'EOF'
<short description>

## Description
<What was built/changed>

## Motivation and Context
<Why this change was needed>

## How Has This Been Tested?
Automated (lint, validate-architecture, knip, typecheck, Vitest, build; Playwright e2e when UI/flow) + browser.

## Types of changes
- [ ] Bug fix :bug: (non-breaking change which fixes an issue)
- [ ] New feature :sparkles: (non-breaking change which adds functionality)
- [ ] Breaking change :boom: (fix or feature that would cause existing functionality to change)

## Checklist:
- [X] My code follows the code style of this project :beers:.
- [X] My change requires a change to the documentation :bulb: and I have updated the documentation accordingly.
- [X] I have read the [CONTRIBUTING](https://github.com/chicio/chicio.github.io/blob/master/CONTRIBUTING.md) document :busts_in_silhouette:.
- [X] I have added tests to cover my changes :tada:.
- [X] All new and existing tests passed :white_check_mark:.
EOF
)"
```
Set the title prefix (`feat`/`fix`/`refactor`/…), the Gitmoji, and the checked "Types of changes" box to match the change.
