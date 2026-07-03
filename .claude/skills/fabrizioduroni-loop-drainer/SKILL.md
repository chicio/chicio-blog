---
name: fabrizioduroni-loop-drainer
description: One tick of the autonomous SDLC loop — pick the oldest loop:ready GitHub issue, hand it to the orchestrator's --autonomous mode, and report. Meant to be driven by /loop. Session-bound, code work only.
disable-model-invocation: true
---

# fabrizioduroni-loop-drainer — one loop tick

This skill is the **scheduler-facing half** of the Phase 2 autonomous loop (design spec:
`docs/agentic-sdlc/2026-07-03-phase2-autonomous-loop.md`). It does **one thing per invocation**: select at most one
eligible GitHub issue and hand it to `fabrizioduroni-blog-sdlc --autonomous`. It owns **selection, backpressure, and
reporting** — nothing else. All the real work (claim, contract check, explore/implement/review, PR) lives in the
orchestrator's autonomous mode, which owns the `loop:*` label lifecycle.

Keeping this half thin is deliberate: it is the **scheduler-shaped seam**. Swapping the local `/loop` for a hosted
runner later means replacing only this skill, not the pipeline.

## How it is driven

Run it on an interval with the `/loop` skill, e.g.:

```
/loop 30m /fabrizioduroni-loop-drainer
```

Each tick executes the steps below once, then the loop sleeps until the next interval. It is **session-bound**: it
only runs while this Claude Code session is open (accepted Phase 2 limitation — cloud is a future scheduler swap).

## One tick

Work these in order. A tick is cheap when the queue is empty — most of the time it should do nothing and return fast.

### 1. Preconditions
- You must be in the **main working tree, not inside a worktree** (the orchestrator's autonomous mode calls
  `EnterWorktree`, which cannot nest). If the session is currently in a worktree, `ExitWorktree` (keep) first, or
  report and stop.
- `gh auth status` must be healthy. If not, report and stop the tick.

### 2. Backpressure cap (before selecting any work)
Count issues already awaiting the human merge gate:

```
gh issue list --label "loop:review" --state open --json number --jq 'length'
```

If that count is **≥ 3** (the cap), **do no work this tick** — report "backpressure: N PRs already awaiting review,
pausing" and end the tick. This is the throttle: the loop never opens more than the cap's worth of PRs ahead of your
reviewing, and it auto-resumes as you merge them. (Cap is a constant here; bump it if you want a deeper queue.)

### 3. Select one issue (oldest-first)
```
gh issue list --label "loop:ready" --state open --json number,title,createdAt,labels
```
- Drop any issue that also carries `loop:working` (a claim in flight — belt-and-suspenders; the transitions make this
  mutually exclusive).
- If the list is empty → report "queue empty, nothing to do" and end the tick.
- Otherwise pick the issue with the **oldest `createdAt`** (FIFO). **One issue per tick — never more.**

### 4. Hand off to the orchestrator
Invoke the orchestrator's autonomous mode on the selected issue:

```
/fabrizioduroni-blog-sdlc --autonomous --from-issue <N>
```

It does everything from here: claims the issue (`loop:ready` → `loop:working`), runs the contract check, and either
lands a PR (`loop:review`) or blocks the issue (`loop:blocked`) — see its **§ Autonomous mode**. Do **not** duplicate
any of that logic here; just invoke it and wait for it to return.

### 5. Report the outcome
Summarize the tick in one short block, then let `/loop` sleep:
- Issue picked (`#N`, title).
- Terminal state: **PR opened** (URL, → `loop:review`) or **blocked** (reason, → `loop:blocked`).
- Current queue depth (`loop:ready` count remaining) and backpressure (`loop:review` count).

## Invariants (inherited, restated)
- **One issue per tick, sequential.** No parallel drain.
- **Never merges.** The orchestrator opens PRs; you merge. The drainer never touches merge.
- **Code only.** Content-typed issues are bounced to `loop:blocked` by the orchestrator's content firewall; the
  drainer does not special-case them.
- **No guessing.** An underspecified issue is blocked by the orchestrator's pre-flight contract check, not built.
