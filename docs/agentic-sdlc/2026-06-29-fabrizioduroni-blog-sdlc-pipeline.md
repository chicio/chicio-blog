# Agentic Blog SDLC Pipeline — Design Spec

| Author | Date | Version | Status |
|--------|------|---------|--------|
| Fabrizio Duroni (+ Claude) | 2026-06-29 | 0.1 (draft) | **Temporary** — delete when implementation is complete |

> Ports the team's **Agentic SDLC Pipeline** (`../../Lastminute/mobile-app/docs/superpowers/specs/2026-06-29-agentic-sdlc-pipeline.md`)
> onto chicio-blog. This is a **learn/experiment** build: the value is in constructing the orchestration, and the
> document is part of the deliverable. It mirrors the mobile architecture **natively** (zero `superpowers` dependency),
> scoped to **code work only**. Built in two phases: **Phase 1** an interactive explore → brainstorm → implement ⇄
> review → PR pipeline (§§1–12); **Phase 2** an autonomous loop that pulls tasks from GitHub Issues/Projects and lands
> PRs for review unattended (§13). This file is disposable — remove it once **both** phases ship (§14).

## 1. Goals

1. **Learn the orchestration patterns hands-on** — push Claude Code to its boundaries with a decomposed,
   multi-agent explore → brainstorm → implement ⇄ review → PR pipeline, built from native primitives.
2. **Gain an independent, model-diverse critic** — the one real capability the current single-agent flow lacks.
   Today `fabrizioduroni-senior-engineer` *self-certifies* against tests; a sonnet implementer challenged by an
   opus reviewer in a bounded loop is the upgrade lint + typecheck + tests cannot replicate.

## 2. Non-goals

- **Daily use for every change.** This is exercised occasionally by one person. The orchestrator keeps an escape
  hatch (call the implementer directly) so trivial fixes never pay the 3-agent tax.
- **Content work.** DSA articles and blog prose stay with `fabrizioduroni-writer-dsa-engineer` and
  `fabrizioduroni-writer-engineer`. Content has no typecheck/test gates; the mechanical-gate model does not map.
- **Token-minimization as a primary driver.** The mobile spec optimizes tokens at team volume. Here the model
  tiers are chosen for *fit* (cheap mechanical explore, capable implement, sharp critique), not for spend at scale.

## 3. Orchestration model

A single **manual** orchestrator skill, `fabrizioduroni-blog-sdlc` (`disable-model-invocation: true`), runs the
pipeline **in the main thread** and dispatches sub-agents in sequence.

Rationale (same as mobile): main-thread orchestration gives **deterministic sequencing**, a **visible** implement⇄review
loop, **human gates** between phases, and **cost control**. An opaque orchestrator agent would bury all of that.

Two modes share one backend:

```
feature mode:  explore ──→ brainstorm (grill-me) ──┐
                                                    ├─→ [implement ⇄ review loop] ─→ PR
fix mode:      investigate ──→ confirm-root-cause ──┘         (shared backend)
```

### 3.1 Invocation

```
/fabrizioduroni-blog-sdlc [description] [--fix] [--in-place]
```

- `--fix` selects fix mode. May also be triggered by pasting a stack trace / error description.
- `--in-place` runs in the current working tree instead of an isolated worktree (isolated is the **default**; see §7).
- **Dropped from the mobile spec:** `JIRA-KEY` and `figma-url` — this project has no Jira and no Figma.

### 3.2 Dependency constraint (hard rule)

The pipeline depends **only** on:

- **Native Claude Code primitives** — sub-agents, the `Agent` tool, `EnterWorktree`/`ExitWorktree`, `gh`/`git` via Bash.
- **Project-local skills** — `grill-me` (brainstorm gate, already present and `disable-model-invocation: true`).

It must **not** depend on the `superpowers` plugin or any other external plugin. Although `superpowers` is installed
in this environment (`brainstorming`, `writing-plans`, `requesting-code-review`, …), the **learn/experiment + native**
decision means everything those provide is reproduced with native primitives or project-local skills. This keeps the
setup self-contained and is the exercise's whole point.

## 4. Pipeline stages (feature mode)

| # | Stage | Executor | Behavior |
|---|-------|----------|----------|
| 0 | **Intake** | orchestrator | Parse args. **Isolation (default)**: unless `--in-place`, `EnterWorktree` (own worktree + `feat/<slug>` branch). **Branch guard** (in-place mode): if on `main`, create `feat/<slug>`. **Content firewall**: if the task is MDX/DSA/prose-only, refuse and point at the writer agents. |
| 1 | **Explore** | `fabrizioduroni-explorer` (haiku) | Read-only. Produces a structured exploration report (see §4.1). Reads `CLAUDE.md`, `.claude/rules/*` (7 files), `.dependency-cruiser.js`, and the target area. |
| 2 | **Brainstorm** 🚪 | **grill-me** skill (main thread) | Fed by the explorer report. Interviews the user to nail the approach. Output: an approved plan. **HUMAN GATE 1.** |
| 3 | **Implement** | `fabrizioduroni-implementer` (sonnet) | Writes code + tests. **Micro-commits per logical step** (reviewable PR trail). Matches existing patterns unless the plan says otherwise. Runs all mechanical gates (§5) **before** handing to review. |
| 4 | **Review** | `fabrizioduroni-code-reviewer` (opus) | Re-runs the gates to **verify** (don't trust). Reviews diff against `CLAUDE.md` + `.claude/rules/*` + the approved plan. Severity-classified findings (§6). Runs Playwright `test:e2e` when UI/flow changed. **The orchestrator also dispatches `fabrizioduroni-e2e-sentinel`** (the reviewer can't nest-dispatch) for live agent-browser QA when UI/route/flow changed; its blocking findings fold into the review verdict. |
| 5 | **Loop 3⇄4** | orchestrator | **Max 3 rounds.** Only **blocking** findings force another round. Implementer either fixes or **rebuts once** with written justification; if the reviewer re-asserts, **escalate to human** (no further looping). After 3 rounds, stop and surface open findings. |
| 6 | **PR** 🚪 | orchestrator | Show diff + review summary. **HUMAN GATE 2.** On approval: push; `gh pr create` to `main` using the existing PR template (conventional commit + Gitmoji). Start a **non-blocking** CI watch. Unless `--in-place`, `ExitWorktree` (the pushed branch remains for review). |

### 4.1 Explorer report shape (remapped to this codebase)

The mobile explorer reports against per-feature `architecture.rules.js` + `index.ts`. chicio-blog's analog is the
**atomic design system + dependency-cruiser layering + folder-per-component barrels**. The report must list:

- Relevant files **by atomic layer** (atoms → molecules → organisms → templates) and by area (`app/`, `content/`, `features/`, `lib/`).
- The **design-system surface to reuse** (existing atoms/molecules/organisms, shared hooks).
- **All registration points** a change typically must touch: slug types (`src/types/`), menu, tracking events,
  routes, search index, MDX components.
- The component-store contract implications (one hook per component, no functions in JSX).
- The test surface (which `lib/` functions and which `use-*-store.ts`/components need coverage).

### 4.2 Fix mode delta

Stages 1–2 are replaced by:

- **1'. Investigate** — `fabrizioduroni-bug-investigator` (opus): codebase + **git history (`git log`/`git blame`)** +
  the pasted stack trace/error → structured root-cause report. **No Sentry, no Jira** — those sources do not exist here.
- **2'. Confirm root cause** 🚪 — human reviews the report. **The investigator writes its memory here regardless of
  whether the user proceeds** (preserves institutional bug knowledge). Declining = investigate-only; pipeline stops cleanly.

Stages 3–6 are identical.

## 5. Mechanical gates (the implementer's responsibility, pre-review)

All must pass before handing to the reviewer; the reviewer re-runs them to verify:

1. `npm run lint` (zero errors; CI is `--max-warnings 0`)
2. `npm run validate-architecture` (dependency-cruiser, all rules at error)
3. `npm run knip` (zero unused exports/deps)
4. `npm run typecheck` — **from a clean state**: `rm -f next-env.d.ts && rm -rf .next` first, because stale build
   artifacts provide ambient types that don't exist in a fresh CI checkout.
5. `npm run test:run` (Vitest unit + component)
6. `npm run build`

E2E (`npm run test:e2e`) is **conditional** — run by the reviewer when UI/route/flow files changed (see §4 row 4).
The reviewer never spends tokens on what the linter already catches; it focuses on semantic/architectural correctness,
test meaningfulness, and (for UI) rendered behavior.

## 6. Severity model

- **Blocking** (force a loop round): correctness bug, architecture-boundary violation (dependency-cruiser layering,
  design-system isolation), missing or failing test, security issue, UI/behavior mismatch, broken/uncovered E2E flow.
- **Non-blocking** (reported, no loop): style, naming nits, optional improvements.

## 7. Isolation

Pipeline-level, **never** per-agent frontmatter (per-agent worktrees would give the reviewer a *different* worktree
and break the loop — this is why the implementer's current `isolation: worktree` must be removed; see §9).

- **Isolated mode (DEFAULT):** orchestrator `EnterWorktree` at Intake and runs the whole pipeline (incl. the
  e2e-sentinel) in that one shared worktree, `ExitWorktree` at the end. **This is the chicio default — diverging from
  mobile's in-place default** — because chicio is a solo, often multi-session setup: an in-place run can collide with
  another session or sweep in stray uncommitted changes (this actually happened during Phase-1 validation). The
  isolated worktree must carry project dependencies (the `EnterWorktree` harness provides them) so the sentinel's
  `npm run dev` works. Parallel stories = multiple isolated pipelines.
- **In-place mode (`--in-place`):** runs in the current worktree; diff appears live via micro-commits. Opt-in only.

## 8. Agent roster

| Agent | Status | Model | Color | Memory | Tools / MCP |
|-------|--------|-------|-------|--------|-------------|
| `fabrizioduroni-explorer` | **NEW** | haiku | cyan | — | Read, Grep, Glob, LSP (no Write/Edit, no Agent) |
| `fabrizioduroni-implementer` | **repurposed** from `fabrizioduroni-senior-engineer` | sonnet | pink | **project** (kept) | Read, Write, Edit, Grep, Glob, LSP, Bash(+git) · MCP: context7 |
| `fabrizioduroni-code-reviewer` | **NEW** | opus | orange | **project** | Read, Grep, Glob, LSP, Bash(verify-only: `lint`/`validate-architecture`/`knip`/`typecheck`/`test:run`/`test:e2e`/`build`, `git diff`/`log`/`show`/`status`), **Write (memory dir ONLY)**; no Edit, no Agent |
| `fabrizioduroni-bug-investigator` | **NEW** | opus | red | project | Read, Grep, Glob, LSP, Bash(`git log`/`git blame`); no Write/Edit |
| `fabrizioduroni-e2e-sentinel` | **NEW** | sonnet | green | — | Read, Grep, Glob, Bash(`npm run dev` via background mode, `npx agent-browser`, `curl`, `kill`); no Write/Edit, no Agent |
| `fabrizioduroni-writer-dsa-engineer` | **renamed** from `fabrizioduroni-dsa-senior-engineer` | unchanged | unchanged | unchanged (dir renamed) | unchanged |
| `fabrizioduroni-writer-engineer` | untouched | unchanged | unchanged | unchanged | unchanged |

### 8.1 Model rationale

- **explorer = haiku**: mechanical locate/grep/summarize; cheapest tier suffices.
- **implementer = sonnet**: highest-volume generation; a strong coder executing an approved plan against explicit
  rules. The explorer + plan + rules + opus reviewer + loop are the scaffolding that lets a cheaper author succeed —
  and a sonnet author + opus critic is what makes the self-correction loop a real, model-diverse exercise.
- **reviewer = opus**: low volume, highest leverage; smartest critic; model-diverse from the implementer.
- **bug-investigator = opus**: low frequency, high leverage, hard synthesis (trace → offending code → causation).

### 8.2 Memory rationale

Memory suits *compounding heuristics*, not *stale facts*.
- **implementer** keeps the project memory it already has — accumulated execution heuristics that are pure loss to
  discard. (Deliberate divergence from the mobile spec, which gives the implementer no memory.)
- **code-reviewer** gets project memory for recurring-violation heuristics (matches mobile).
- **bug-investigator** gets project memory for bug patterns / fix strategies (matches mobile).
- **explorer** gets **no** memory — its knowledge is file locations that rot; it reads the fresher `CLAUDE.md` and
  `.claude/rules/*` each run.

**Memory-mechanism note (divergence from mobile).** This repo persists agent memory as **Markdown files written via
the Write tool** to `.claude/agent-memory/<agent-name>/` (all three existing agents work this way). The mobile spec
gives the reviewer "project memory" *and* "no Write" — internally impossible here, because memory *requires* Write.
Resolution: the reviewer (and investigator) get the **Write tool scoped by instruction to their own memory directory
ONLY** — never source, tests, or config. They remain read-only on the code under review (no Edit tool at all), which
is the actual intent. The reviewer's `allowedTools` auto-approves only verify commands; the body forbids any other write.

## 9. Repurpose & rename cascade (most error-prone part — do it carefully)

Agent memory lives at `.claude/agent-memory/<agent-name>/`, so every rename touches **four** things, not one.
Miss any one and the agent silently starts with **empty memory**.

### 9.1 `fabrizioduroni-senior-engineer` → `fabrizioduroni-implementer`

- Rename the agent file.
- `git mv .claude/agent-memory/fabrizioduroni-senior-engineer/ .claude/agent-memory/fabrizioduroni-implementer/`.
- Update the memory-path line in the agent body (currently line ~239).
- **Strip** the Brainstorm and Plan phases (→ moved to grill-me) and the "Create Pull Request" phase (→ moved to the
  orchestrator). Keep Execute, the mechanical gates, the red-green bug loop, and the testing/loop discipline.
- **Remove `isolation: worktree`** from frontmatter (§7).
- **Scope down `allowedTools: Bash(*)`** — the implementer still needs git + npm, but the blanket grant should be
  reviewed.
- Move the "create a feature branch before changes" instruction into the orchestrator's Intake stage.

### 9.2 `fabrizioduroni-dsa-senior-engineer` → `fabrizioduroni-writer-dsa-engineer`

- Rename the agent file.
- `git mv .claude/agent-memory/fabrizioduroni-dsa-senior-engineer/ .claude/agent-memory/fabrizioduroni-writer-dsa-engineer/`
  (preserves `completed_topics.md`, `dp_article_grouping.md`, `structure_patterns.md`).
- Update the memory-path line in the agent body (currently line ~370).
- Update `.claude/references/dsa-exercise-generation.md:4` (names the agent).
- Clean up stale worktree-memory-copy allow-entries in `.claude/settings.local.json` (low priority; they regenerate).

## 10. Maintenance touchpoints

- Document the pipeline in `CLAUDE.md` and add a new `.claude/rules/agentic-sdlc.md` describing the orchestration.
- Add `summary:` frontmatter to the new agents.
- Reuse the current senior-engineer Execute + Verify + Testing/Loop sections verbatim as the implementer's body.

## 11. Resolved decisions

1. Goal → **learn/experiment**, accept maintenance cost; optimize for reversibility.
2. Plugin policy → **rebuild native**, zero `superpowers` dependency.
3. Scope → **code only**; content agents untouched.
4. Implementer → **repurpose** `senior-engineer` (not a new agent, not a coexisting monolith).
5. Fix mode → **build the opus investigator**, git + pasted-trace sources (no Sentry/Jira).
6. DSA agent → renamed to **`fabrizioduroni-writer-dsa-engineer`** (drops "senior" for parallel with `writer-engineer`).
7. Implementer keeps **project memory**; reviewer **gets project memory**.
8. Reviewer color → **orange** (matches mobile).
9. Built in **two phases** — interactive pipeline (Phase 1) then autonomous loop (Phase 2, §13).
10. Phase 2 Gate 1 → **issue-as-contract** (a labelled GitHub issue is the approved plan); async plan-approval kept as fallback.
11. Phase 2 runner → **GitHub Action** is the target; local `/loop` is the proof-of-concept first step.
12. Loop is **PR-only, never auto-merge**; concurrency cap = 1; per-run budget cap.
13. This spec is **temporary** — delete only after both phases ship.
14. (Phase-1 tuning) Live agent-browser QA → **dedicated `fabrizioduroni-e2e-sentinel`** (sonnet), dispatched by the
    orchestrator as the **review stage's QA arm** when UI/route/flow changed; findings fold into the review verdict
    (one unified loop). The implementer no longer runs agent-browser or background servers — its UI gate is Playwright.
15. (Phase-1 tuning) Isolation → **isolated worktree is the DEFAULT** for chicio (opt out with `--in-place`),
    diverging from mobile's in-place default; prompted by a real same-clone multi-session collision during validation.
16. (Phase-1 tuning) Servers are started via the **Bash `run_in_background` mode, never `&`**; readiness via
    `curl --retry-connrefused`, never foreground `sleep`.

## 12. Build order — Phase 1 (interactive pipeline; each step independently revertible)

1. `fabrizioduroni-explorer` (new, smallest, zero-risk) — dry-run it on a real area.
2. `fabrizioduroni-code-reviewer` + the E2E check — testable against any existing diff.
3. Repurpose `senior-engineer` → `fabrizioduroni-implementer` (the §9.1 cascade).
4. `fabrizioduroni-bug-investigator` (git-only).
5. `fabrizioduroni-blog-sdlc` orchestrator skill wiring 1–4 + grill-me + gates + GitHub PR.
   **Design constraint for Phase 2:** the orchestrator's gate behavior must be **parameterized**, not hardcoded
   interactive. Gate 1 (brainstorm) and `AskUserQuestion` calls must be reachable only on the interactive path, so a
   later `--autonomous` mode can swap them for issue-derived inputs without rewriting the orchestrator (see §13).
6. Rename `dsa-senior-engineer` → `fabrizioduroni-writer-dsa-engineer` (the §9.2 cascade).
7. Document in `CLAUDE.md` + `.claude/rules/agentic-sdlc.md`; add `summary:` frontmatter.

(Do **not** delete this spec after Phase 1 — Phase 2 below depends on it. Delete only when both phases ship.)

## 13. Phase 2 — Autonomous loop mode (future)

> Goal: feed tasks from a **task organizer** (GitHub Issues / GitHub Projects) and run the full Phase-1 pipeline
> **unattended**, landing a **PR for human review**. Inspired by the "loops are the future" pattern (agents pull from
> a queue, run the dev cycle, hand back PRs). This is a **thin driver wrapping the Phase-1 pipeline** — it adds a
> queue reader, a non-interactive orchestrator mode, and a runner. It does **not** change the pipeline's stages.

### 13.1 Why it fits

The Phase-1 pipeline already **terminates at a PR human gate (Gate 2)**. That terminal gate *is* the "lands to me for
review" requirement — the loop never merges, never touches `main`. CI + human review remain the only path to merge.

### 13.2 The hard conflict and its resolution

An unattended loop **cannot be interviewed**, but Phase-1 Stage 2 is `grill-me` (interactive) + `AskUserQuestion`.
Resolution — **issue-as-contract**:

- A well-formed GitHub issue (description + **acceptance criteria**) *is* the approved plan. In autonomous mode the
  orchestrator **skips the grill-me interview** and feeds the issue body to the implementer as the plan.
- Human thinking moves **up front** (writing a good issue) instead of mid-loop. Issue quality becomes the bottleneck;
  a vague issue yields a confidently-wrong PR that wastes a full opus cycle.
- Gate 1 is therefore satisfied *asynchronously, before the loop runs*, by the act of labelling an issue ready.
- **Rejected alternatives:** (a) async plan-approval (loop drafts a plan comment, waits for an `agent-approved`
  label, implements on a second pass) — preserves a live Gate 1 but doubles runs/latency; kept as a fallback if
  issue-as-contract proves too loose. (b) Dropping Gate 1 entirely — too risky.

### 13.3 Orchestrator changes

- Add an `--autonomous` (a.k.a. `--loop`) mode to `fabrizioduroni-blog-sdlc`. In this mode:
  - Stage 0 Intake reads the task from an **issue**, not CLI args.
  - Stage 2 brainstorm is replaced by issue-as-contract (§13.2); **no interactive prompts** are emitted.
  - Stages 3–5 (implement ⇄ review loop, gates) run unchanged.
  - Stage 6 opens the PR (Gate 2 becomes the async review) and **stops** — never merges.
- Everything else is shared with the interactive path (the §12 step-5 design constraint guarantees this is a
  parameter flip, not a rewrite).

### 13.4 Task queue protocol (GitHub Issues / Projects)

- **Eligibility:** the loop only picks issues labelled **`agent-ready`** (optionally scoped to a Project column).
- **Single-flight / idempotency:** on pick, immediately mark in-progress (`agent-in-progress` label + self-assign) so
  the next tick cannot re-grab the same issue. On PR open, swap to `agent-pr-open` and comment the PR link on the issue.
- **Failure handling:** on pipeline failure (gates never green, loop exhausted), drop `agent-in-progress`, add
  `agent-needs-human`, and comment the failure summary. Never leave an issue silently stuck in-progress.

### 13.5 Runner — recommended: GitHub Action

Three tiers (increasing autonomy):

1. **Local `/loop`** — runs while a session is open; dies on laptop close. **Use first, as the proof-of-concept.**
2. **Scheduled cloud agent (cron routine)** — survives laptop shutdown; truly unattended.
3. **GitHub Action (recommended target)** — trigger Claude on the `agent-ready` label → run the pipeline in CI → open
   a PR. Most native to a GitHub-issues queue, and the only tier that also **closes the review-feedback loop**: a PR
   review comment can re-trigger Claude to address feedback. Build toward this.

### 13.6 Guardrails (mandatory)

- **Concurrency cap = 1.** Two simultaneous loop runs collide on the same issue. Enforce single-flight (the
  `agent-in-progress` label is the lock).
- **Per-run budget cap.** opus reviewer + opus investigator per task compounds across a queue; cap tokens/run and
  stop cleanly when exhausted (surface the partial result, don't half-merge).
- **PR-only, never auto-merge.** The instant auto-merge is wired, the human leaves "lands to me for review." Forbidden.
- **CI must gate the PR** — the loop's gates and CI are independent verifications; both must pass before a human even looks.

### 13.7 Phase 2 build order

1. Add `--autonomous` mode to the orchestrator (issue-as-contract; no interactive prompts).
2. Prove it **locally with `/loop`** against a single hand-labelled `agent-ready` issue. Verify single-flight + PR-only.
3. Add the label-state protocol (§13.4) and budget/concurrency guardrails (§13.6).
4. Promote to the **GitHub Action** runner; wire the PR-review-comment re-trigger.
5. (Optional) Scheduled cron routine if you want it running without GitHub-event triggers.

### 13.8 Open Phase-2 decisions (defer until Phase 1 ships)

- GitHub **Issues vs Projects** as the surface (labels are enough to start; Projects add columns/ordering).
- Whether issue-as-contract is sufficient or the async plan-approval fallback (§13.2a) is needed in practice.
- Exact budget-per-run ceiling for an opus-heavy pipeline on a hobby repo.

## 14. Spec lifecycle

This spec is **temporary**. Delete it only after **both** phases ship (Phase 1 agents + orchestrator, and Phase 2
loop mode). Until then it is the single source of truth for the build.
