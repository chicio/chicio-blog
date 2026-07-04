---
name: fabrizioduroni-scout
description: The producer side of the autonomous SDLC loop — runs deterministic code-health scanners (coverage, hygiene, a11y), dedups findings against open issues, and files loop-task issues (WITHOUT loop:ready — you curate) for the loop to drain. Session-bound, code work only.
disable-model-invocation: true
---

# fabrizioduroni-scout — file code-health work for the loop

This skill is the **producer half** of the Phase 2 loop (design spec:
`docs/agentic-sdlc/2026-07-03-phase2-autonomous-loop.md`). Where `fabrizioduroni-task` turns *your* idea into a
contract, the scout turns **deterministic scanner output** into contracts — it discovers code-health work, dedups it
against what's already filed, and opens `loop-task` issues. The `fabrizioduroni-loop` drainer + `--autonomous`
pipeline consume those exactly as they consume human-authored ones. This is what makes the loop *self-feeding*.

## The curation gate (read first)
The scout files issues **WITHOUT the `loop:ready` label** — same rule as `fabrizioduroni-task`. Filing ≠ approving.
You skim the auto-filed issues and apply `loop:ready` to the ones worth doing; only then does the drainer pick them
up. This keeps a human gate on **what** gets built and doubles as the value filter. (A future `--auto-approve` mode
could label them directly for a fully-hands-off loop; not now.)

Each finding carries a **dimension label** so you can triage and the queue stays sortable:
- `loop:coverage` — test-coverage gaps
- `loop:hygiene` — duplicate abstractions / dead code / architecture drift
- `loop:a11y` — runtime accessibility violations

All scout issues use **Type: hygiene** (→ the pipeline's feature-mode) and are **code-only**.

## How it is driven
Run on a slow cadence with `/loop`, e.g. `/loop 1d /fabrizioduroni-scout` — discovery doesn't need to be frequent.
Session-bound (accepted Phase 2 limitation). Each run executes the steps below once, then sleeps.

## One run

### 1. Preconditions
- Be in the **main working tree** (the scout makes no code changes — it only runs scanners and files issues — so it
  needs no worktree, and must not nest inside one).
- `gh auth status` healthy, else report and stop.

### 2. Global backpressure (before filing anything)
Don't flood the tracker with un-curated work:
```
gh issue list --state open --label "loop:coverage" --label "loop:hygiene" --label "loop:a11y" --json number --jq 'length'
```
(Run per label and sum, or query each dimension.) If the total count of open scout-filed issues **not yet closed** is
**≥ 10**, do no filing this run — report "backpressure: N scout issues awaiting curation" and stop. It resumes as you
curate/close them.

### 3. Run the enabled scanners
Run each scanner below; each emits candidate findings. After all scanners, apply the shared **dedup + cap + file**
step (§4). **Cap: at most 3 new issues per dimension per run** (top-ranked), so a run stays reviewable.

#### Scanner: coverage  → `loop:coverage`  (ACTIVE)
1. Run `npm run test:coverage` (writes `coverage/coverage-summary.json`; the reporter already scopes to
   `src/lib/**` + `src/components/design-system/**` and excludes the Matrix canvas effects — trust the file, don't
   re-derive the scope).
2. Read `coverage/coverage-summary.json`. Skip the `total` key. For every file entry, look at `lines.pct` and
   `functions.pct` and the count of uncovered lines (`lines.total - lines.covered`).
3. **Rank candidates:** files with `lines.pct < 85` OR `functions.pct < 85`, ordered by **most uncovered lines first**
   (biggest real gap = highest value). Ignore files already at/above target and trivially-tiny files (< 10 lines).
4. Emit up to the cap. For each, the finding = the file's relative path + its current pct + uncovered-line count.

#### Scanner: hygiene  → `loop:hygiene`  (PLANNED — build next)
Primary engine is **semantic duplicate detection** via the `finding-duplicate-functions` skill (functions that do the
same thing under different names — common in LLM-written code). `validate-architecture` and `knip` are **guardrails**
that CI already keeps at zero, so they only yield findings on genuine drift; include them but expect them usually
empty. Rank by number of duplicate call sites / size of the duplicated logic.

#### Scanner: a11y  → `loop:a11y`  (PLANNED — needs the @axe-core/playwright harness)
Run `@axe-core/playwright` `axe` against each rendered route (reuse the e2e/production-server setup) and collect
violations. One finding per (rule, page) cluster; rank by impact (critical > serious > moderate > minor). This
scanner requires adding the `@axe-core/playwright` dependency + a small harness — its own build step.

### 4. Dedup, cap, and file (shared by all scanners)
For each candidate, in rank order until the per-dimension cap is hit:
1. **Dedup against open issues** (issues are the loop's memory): search for an existing open issue targeting the same
   thing before filing.
   ```
   gh issue list --state open --label "<dimension label>" --search "<target> in:title" --json number
   ```
   `<target>` is the file path (coverage), the duplicated symbol (hygiene), or the `rule@page` (a11y). If a match
   exists, **skip** (don't re-file). Also skip anything with a matching **closed** issue from the last run cycle that
   you (the human) closed as won't-do — respect the veto.
2. **File** the issue — no `loop:ready` label:
   ```
   gh issue create \
     --title "[loop] <title>" \
     --label "<dimension label>" \
     --body-file <tmp>
   ```
   Body = the `loop-task` contract (mirror `.github/ISSUE_TEMPLATE/loop-task.yml` so the pre-flight check reads it),
   with **machine-generated** acceptance criteria. For coverage:

   ```markdown
   **Type:** hygiene

   ### Problem / why
   `<relative/path.ts>` is at <lines.pct>% lines / <functions.pct>% functions — <uncovered> uncovered lines. It is in
   the coverage-gated surface (`lib/**` + `design-system/**`) and is under-tested.

   ### Acceptance criteria
   - [ ] Meaningful tests raise `<relative/path.ts>` to ≥ 85% lines and ≥ 85% functions — assertions verify behavior,
         not just execute code (NO vacuous tests; see `.claude/rules/testing.md`).
   - [ ] `npm run test:coverage` passes and the global floor (statements 64 / branches 59 / functions 61 / lines 65)
         is not lowered.
   - [ ] Tests are co-located and follow the one-describe-per-unit convention.

   ### Scope boundaries / out-of-scope
   In scope: adding/extending tests for `<relative/path.ts>` (and only minimal, unavoidable production changes strictly
   required for testability). Out of scope: refactoring production behavior; touching unrelated files; lowering any
   threshold.

   ---
   _Code task. Filed by `/fabrizioduroni-scout` (coverage scanner). Apply `loop:ready` to queue it._
   ```

### 5. Report
One short block: per dimension — how many candidates found, how many filed (with issue URLs), how many skipped as
dupes, and whether the backpressure cap stopped filing. Remind: apply `loop:ready` to the ones you want built.

## Invariants
- **Files, never builds** — no code changes; the drainer + autonomous pipeline do the building.
- **Never auto-approves** — no `loop:ready`; you curate.
- **Deduped** — never re-file an open (or human-vetoed closed) finding.
- **Capped** — ≤ 3 new issues per dimension per run, and a global backpressure stop.
- **Code only** — every issue is Type: hygiene, code-scoped.
