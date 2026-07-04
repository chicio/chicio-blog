---
name: fabrizioduroni-autopilot
description: The self-feeding autonomous loop — one tick either discovers work (scout, auto-approved) when the queue is empty or drains one loop:ready issue to a PR. Sequential (no port collision), session-bound, code-only, never merges.
disable-model-invocation: true
---

# fabrizioduroni-autopilot — the self-feeding loop tick

Composes the producer (`fabrizioduroni-scout`) and the consumer (`fabrizioduroni-blog-sdlc --autonomous`) into **one
sequential tick**, so the loop feeds itself with **no human curation step** — only the PR-merge gate remains. This is
the "never-stops" mode.

**Difference from `fabrizioduroni-loop`:** the curated drainer only builds issues *you* labelled `loop:ready`.
Autopilot **auto-approves its own findings** (applies `loop:ready` itself), so you are no longer the valve on *what*
gets built — only on *what gets merged*.

**Know what you're turning on.** Auto-approve removes the value filter: autopilot **will** build findings you might
have skipped, producing PRs you then close (wasted tokens + noise). What still protects you: the scout's targeting,
the `implementer ⇄ code-reviewer` maker/checker, CI, backpressure, and your merge click. If you want the valve back,
run `fabrizioduroni-loop` (curated) instead. Two hard invariants carry over: it **never merges**, and it **never
prompts** mid-run.

Driven by `/loop`, e.g. `/loop 30m /fabrizioduroni-autopilot`. **Session-bound** (runs only while the session is open;
24/7 is the future cloud swap). Run from the **main working tree** (the pipeline creates its own worktrees and cannot
nest).

## One tick — do EXACTLY ONE of: pause · drain · refill

Never run the scout **and** the pipeline in the same tick — both boot a production server on `:3000`, so a tick that
did both would collide. Draining and refilling therefore alternate across ticks: drain until the queue is empty, then
one refill tick, then drain again.

### 1. Preconditions
Be in the **main working tree** (not a worktree). `gh auth status` healthy. Otherwise report and stop.

### 2. Backpressure — pause if enough PRs already await you
```
gh issue list --label "loop:review" --state open --json number --jq 'length'
```
If **≥ 3**, do nothing this tick — report "backpressure: N PRs awaiting review, pausing" and **stop**. (Draining *and*
refilling both pause here — no point discovering more when you already have a review backlog.) It resumes as you merge.

### 3. Is there ready work?
```
gh issue list --label "loop:ready" --state open --json number,createdAt,labels
```
Drop any also carrying `loop:working` (a claim in flight).
- **Some `loop:ready` issue exists → DRAIN (§4a).** Do not scout this tick.
- **None → REFILL (§4b).** Do not drain this tick.

### 4a. Drain one issue
**Read and follow** `.claude/skills/fabrizioduroni-blog-sdlc/SKILL.md` → its **§ Autonomous mode (Phase 2)** for the
**oldest** `loop:ready` issue `N` — i.e. execute it exactly as if invoked with `--autonomous --from-issue N` (it can't
be invoked via the Skill tool; read-and-follow is the mechanism). It claims the issue, runs the contract check,
builds, and opens a PR (`loop:review`) or blocks it (`loop:blocked`). **One issue per tick.** Report the terminal
state, then end the tick.

### 4b. Refill (auto-approved discovery)
**Read and follow** `.claude/skills/fabrizioduroni-scout/SKILL.md` with **one deviation**: file each issue **WITH the
`loop:ready` label** (auto-approve), so the next tick drains it. Apply the scout's scanners, two-tier ranking, dedup
against open issues, per-dimension cap, and global backpressure **exactly as written** — the only change is adding
`loop:ready` at `gh issue create` (`--label "<dimension>" --label "loop:ready"`). Report what was filed, then end the
tick. (The next tick will drain the oldest.)

### 5. Report
One short block: which branch was taken (pause / drain / refill), the outcome (PR URL, blocked reason, or issues
filed), and current queue depth (`loop:ready`) + backpressure (`loop:review`).

## Invariants
- **One action per tick** — pause, drain, or refill; never scout + pipeline together (port `:3000`).
- **One issue built per drain tick.** Sequential, no parallel drain.
- **Never merges** — PRs land for your merge; that is the sole remaining human gate.
- **Auto-approves** — applies `loop:ready` itself (the one behavioural difference from `fabrizioduroni-loop`).
- **Code only. Deduped. Capped + backpressure-throttled** — inherited from the scout and the orchestrator.
