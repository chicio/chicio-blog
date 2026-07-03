# Agentic Blog SDLC — Phase 2: Autonomous Loop (Design Spec)

| Author | Date | Version | Status |
|--------|------|---------|--------|
| Fabrizio Duroni (+ Claude) | 2026-07-03 | 0.1 (draft) | **Temporary** — delete when implementation is complete |

> Companion to `2026-06-29-fabrizioduroni-blog-sdlc-pipeline.md` (Phase 1). That doc reserved §13 for "an autonomous
> loop that pulls tasks from GitHub Issues and lands PRs for review unattended." **This is that spec.**
>
> It realizes the pattern Boris Cherny calls **loop engineering** — a coding agent that pulls its own work, runs
> unattended, verifies with a maker/checker split, and lands PRs — on top of the Phase 1 pipeline, **reusing 5 of the
> 6 loop ingredients already built** (skills, maker/checker sub-agents, worktree isolation, on-disk memory, PR+CI
> connector). The only two missing pieces are a **task source** and a **scheduler**; this phase adds exactly those and
> nothing else. Per the Phase 1 doc, this is a **flag flip, not a rewrite** — the interactive human gates are
> replaced by async label gates; the non-interactive stages (Explore, Implement, Review) are untouched.
>
> **Scope: CODE work only** (the Phase 1 content firewall carries over verbatim). This file is disposable — remove it
> once the loop ships.

## 1. Goals

1. **Turn the manual Phase 1 pipeline into a self-feeding loop** — work arrives as GitHub issues, the pipeline runs
   unattended, and PRs land for review, without a human at the keyboard for the middle of the flow.
2. **Preserve every safety property of Phase 1** while removing its two interactive gates — the `loop:ready` label
   replaces plan-approval; the merge click replaces PR-approval; a pre-flight contract check replaces grilling's
   "catch a vague request before wasting a build" role.
3. **Keep the loop cloud-portable without building cloud now** — the scheduler is the only local-specific seam, so a
   future migration to a hosted runner is a scheduler swap, not a pipeline rewrite.

## 2. Non-goals

- **24/7 background execution.** The loop is **session-bound** by deliberate choice — it runs only while a Claude
  Code session is open on the developer's machine (§8). "Never-stops" in Boris's 24/7 sense is explicitly out of
  scope for this phase; the design leaves a clean seam for it (§11).
- **Content work.** Unchanged from Phase 1 — MDX blog prose and DSA articles stay with the writer agents. A
  content-typed issue is bounced to `loop:blocked`, never entered into the code pipeline (§9).
- **Parallel drain.** One issue per tick, sequential (§7). Parallelism is a later tuning knob, not part of v1.
- **Auto-merge.** The loop **never** merges. Its terminal state per tick is an open PR or `loop:blocked` (§5).

## 3. The six loop ingredients — mapped

Boris's loop-engineering pattern combines six ingredients. Five already exist from Phase 1; this phase adds the
sixth (task source) and the scheduler that drives it.

| Ingredient | Status | In this project |
|------------|--------|-----------------|
| Skills | ✅ built | `fabrizioduroni-blog-sdlc` + agent roster |
| Maker/checker sub-agents | ✅ built | `implementer` ⇄ `code-reviewer` (+ `e2e-sentinel`) |
| Isolated workspaces | ✅ built | `EnterWorktree`, pipeline isolated by default |
| On-disk memory | ✅ built | agent memory dirs — **plus GitHub issues as loop memory (§4)** |
| PR connector + CI | ✅ built | `gh pr create` + GitHub Actions gating |
| **Task source** | ⬜ **this phase** | **GitHub issues** (features by hand now; a scout files hygiene issues in v2) |
| **Scheduler** | ⬜ **this phase** | **local `/loop`** driving a thin drainer (§8) |

## 4. Task source & memory model — "Design A: issues are the memory"

The single hardest problem in any never-ends loop is **state / dedup**: a loop that wakes repeatedly must not re-open
the same PR every time, must remember what the human vetoed, and must know what is in flight. Rather than hand-roll an
on-disk state store, **GitHub issues serve as the loop's memory** — hosted, deduped, human-visible, and steerable
from anywhere:

- **Open, `loop:ready`** = queued for the loop.
- **`loop:working`** = claimed, in flight (also the concurrency mutex, §7).
- **Issue with a linked PR** = done, awaiting the human merge gate.
- **Closed** = vetoed / won't-do (the loop never re-files it).

**One queue, two producers, one consumer.** Both human-authored feature issues and (v2) scout-authored hygiene issues
land in the *same* queue with the *same* contract; the implementer consumes an identical issue body regardless of
author. This is the "issue-as-contract" the Phase 1 doc named.

## 5. Gate model — interactive gates become async label gates

Phase 1 has two hard human gates. The loop replaces both without a human in the middle:

| Phase 1 gate | Phase 2 replacement |
|--------------|---------------------|
| **Gate 1 — plan approval** (grilling) | The **`loop:ready` label is the approval.** You curate the queue by labeling; that *is* your go. No plan step. |
| **Gate 2 — PR approval** | **The loop never merges.** It opens a PR linked to the issue and stops. You merge (or close). CI-green is a precondition; the merge click stays human. |

grilling did more than approve — it *caught vague requests before a build was wasted*. That role is preserved by the
**pre-flight contract check** (§6): unattended, the loop refuses to guess.

### 5.1 Label lifecycle

```
loop:ready ──(loop claims)──► loop:working ──(PR opened)──► loop:review ──(you merge)──► closed
                                    │
                                    └──(bad contract / gave up / content)──► loop:blocked (+ comment)
```

- **`loop:ready`** — human (or v2 scout) opt-in. Only these are eligible for pickup.
- **`loop:working`** — set on claim; the mutex that prevents double-pickup.
- **`loop:review`** — PR opened and linked; awaiting the human merge gate.
- **`loop:blocked`** — terminal failure state with an explanatory comment; requires human action to re-queue.

## 6. The issue contract — one schema, two front-ends

Because `loop:ready` is the only approval, **the issue is the entire contract.** It must carry everything grilling
would otherwise have extracted, or the loop builds the wrong thing.

### 6.1 Field schema (consumed by the implementer/reviewer, author-agnostic)

| Field | Required | Purpose |
|-------|----------|---------|
| Title | ✅ | Short, conventional-commit-ish |
| Problem / why | ✅ | Motivation |
| **Acceptance criteria** (checklist) | ✅ | **Load-bearing.** Concrete, verifiable "done." *This is the plan gate, relocated* — the reviewer checks the diff against exactly these |
| **Scope boundaries / out-of-scope** | ✅ | **Load-bearing.** Blast-radius control for an unattended run — what the loop must **not** touch |
| Placement / design hints | ◻ encouraged | Route, design-system pieces to reuse, data source — steers toward project conventions |
| Type (`feature` / `fix` / `hygiene`) | ✅ | Drives pipeline mode; applied as a label |
| Code-only confirmation | ✅ (checkbox) | Enforces the content firewall at intake |

### 6.2 Three front-ends, same schema

1. **YAML issue form** (`.github/ISSUE_TEMPLATE/loop-task.yml`) — for humans filing directly in the browser. GitHub
   enforces required fields, so an incomplete contract cannot be submitted. Replaces the stock 2020 markdown
   templates. **Build now.**
2. **Assisted authoring** (`fabrizioduroni-task` skill) — for humans authoring from Claude Code. The async front-half
   of the pipeline: (adaptive explore) → **grilling** → synthesize the contract → verbatim confirm → `gh issue create`.
   Front-loads the grilling the autonomous loop can't do at build time, so its contracts are high-confidence. Files
   **without** `loop:ready` by default (filing ≠ approving; `--ready` opts in). **Build now (§10).**
3. **String template** — for the v2 scout, which fills the same fields via `gh issue create --body`. It never uses
   the web form. For hygiene findings the load-bearing fields are **machine-generated**: acceptance criteria = "the
   scanner goes green" (`validate-architecture` passes / `knip` reports zero for symbol X); scope = "the flagged
   symbol/file only." **Build in v2, reusing the identical schema — zero rework.**

### 6.3 Pre-flight contract check (grilling's safety valve, relocated)

At the front of the autonomous pipeline, a cheap completeness check runs **before any build**. If the contract lacks
concrete acceptance criteria or scope, the loop **does not guess** — it sets `loop:blocked`, comments what's missing,
and moves on. This is the single most important rail in the design: it stands exactly where grilling stood.

## 7. Drain policy & guards

**One issue per tick, sequential.** Each `/loop` tick claims the oldest ready-and-unclaimed issue, runs the whole
pipeline to a PR, then sleeps. Rationale: the pipeline is *pipeline-level* worktree-isolated; parallel drain would
mean N concurrent pipelines contending for the reviewer agent and interleaving output in one session — forfeiting the
observability that is the whole point of main-thread orchestration.

Guards:

- **Concurrency mutex** — on claim, immediately flip `loop:ready` → `loop:working`; only pick issues that are ready
  **and not** working. The label is the lock; it prevents a second tick (or a forgotten second session) from grabbing
  the same issue and opening a duplicate PR.
- **Backpressure cap (~3)** — before selecting work, the drainer counts issues already in `loop:review` (open PRs
  awaiting your merge); if that is ≥ the cap, the tick does nothing. This throttles the loop to never run more than
  the cap's worth of PRs ahead of your reviewing, auto-resumes as you merge, and — being a live `gh` query — needs no
  persisted session counter. (Refines the original "per-session cap": backpressure is stateless and better matches
  the real goal — don't pile up more than the human can review.)
- **Failure → `loop:blocked`** — reuse Phase 1's 3-round review cap; on non-convergence or an unrecoverable red gate,
  set `loop:blocked` + comment and move on. Never leave a half-built branch.
- **Content firewall at intake** — a content-typed issue (or one failing the code-only checkbox) → `loop:blocked`
  with "content → writer agents," never entered into the code pipeline.

## 8. Scheduler — local `/loop`, no cloud

The loop is **session-bound**: it runs while a Claude Code session is open on the developer's machine, driven by the
`/loop` skill on an interval — `/loop 30m /fabrizioduroni-loop`. Poll-driven (no webhooks): each tick the
`fabrizioduroni-loop` skill queries `gh` for eligible issues and drains one. Idle ticks (no `loop:ready`
issue) just sleep.

Accepted limitation: this is **not** 24/7 background execution. It is "runs while I have a session open." Legitimate
for v1; the upgrade path is a clean seam (§11).

## 9. Content firewall (unchanged from Phase 1)

Code-only. Content-typed issues are bounced to `loop:blocked` → route to `fabrizioduroni-writer-engineer` (prose) /
`fabrizioduroni-writer-dsa-engineer` (DSA). A change that is *both* code and content stays in the loop for the code
part only.

## 10. Component structure — two components

| Component | Job | Build |
|-----------|-----|-------|
| **Autonomous mode** on `fabrizioduroni-blog-sdlc` — `--autonomous --from-issue N` | Reads the issue as the contract; `loop:ready` = Gate 1; runs the non-interactive Explore → Implement ⇄ Review stages; opens a PR; stops (never merges) | Extend existing skill |
| **`fabrizioduroni-task`** (new skill, human-invoked) | Author a contract from Claude Code: (adaptive explore) → grilling → synthesize → verbatim confirm → `gh issue create` (no `loop:ready` unless `--ready`). The assisted front-end of the queue (§6.2) | New skill |
| **`fabrizioduroni-loop`** (thin new skill, run by `/loop`) | One tick: backpressure check → pick the oldest `loop:ready` issue → call the orchestrator in autonomous mode → report → sleep. Owns *selection + backpressure + reporting* only; the orchestrator owns the label lifecycle | New skill |

Single-responsibility split pays off three ways: (1) the autonomous pipeline runs on **one issue on demand, no loop**
— exactly how the authors page is de-risked; (2) the drainer is the **scheduler-shaped seam** — cloud migration
rewrites only the drainer; (3) the v2 scout only calls `gh issue create` — it touches neither component.

## 11. Cloud upgrade seam (future, not this phase)

Because the substrate is issues + labels + `gh` + PRs, going 24/7 later is **only a scheduler swap**: replace the
local `/loop` drainer with a GitHub Actions workflow (`on: issues: types: [labeled]` for the drainer, `on: schedule`
for the v2 scout). The autonomous orchestrator, the contract, the labels, and the worktrees are all unchanged. This
is why the drainer is kept thin and separate (§10).

## 12. Delivery order

1. **Issue form + labels** — `.github/ISSUE_TEMPLATE/loop-task.yml` (replaces stock 2020 templates) + create the
   `loop:ready` / `loop:working` / `loop:review` / `loop:blocked` labels.
2. **`--autonomous --from-issue N`** mode on `fabrizioduroni-blog-sdlc` — reads issue as contract, pre-flight check,
   label = Gate 1, stops at PR. **Test manually on the authors-page issue — no loop yet.** ← de-risks unattended
   issue→PR.
3. **Thin `/loop` drainer** — poll → claim → call orchestrator → cap → sleep. *Now it is a loop.*
4. **(v2) Scout** — runs `validate-architecture` + `knip` + `finding-duplicate-functions`, files hygiene issues via
   the same contract. This is the actual Boris never-stops loop (the authors page in steps 1–3 is scaffolding to
   earn confidence; the hygiene scout is the destination).

## 13. First jobs

- **Authors page** — the first *feature* through the loop. A bounded, concrete task whose sole purpose is to prove
  the unattended issue→PR path (steps 1–3). It is a single job, not a loop.
- **Codebase hygiene** — the first *real loop* (v2, step 4). Self-regenerating work from deterministic scanners; the
  one that earns the name "loop."

## 14. Teardown

Delete this file (and its Phase 1 companion) once the loop ships and the patterns are internalized. The value is in
building it; the docs are scaffolding.
