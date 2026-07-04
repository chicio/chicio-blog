---
name: fabrizioduroni-scout
description: The producer side of the autonomous SDLC loop — runs deterministic code-health scanners (coverage, hygiene, a11y), dedups findings against open issues, and files loop-task issues (WITHOUT loop:ready — you curate) for the loop to drain. Session-bound, code work only.
disable-model-invocation: true
---

# fabrizioduroni-scout — file code-health work for the loop

This skill is the **producer half** of the Phase 2 autonomous loop. Where `fabrizioduroni-task` turns *your* idea into a
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
3. **Rank candidates** — files with `lines.pct < 85` OR `functions.pct < 85`; ignore files already at/above target and
   trivially-tiny files (< 10 lines). Then split into two tiers and prefer testable logic (build/ops entry-point
   scripts are already excluded from coverage in `vitest.config.ts`, so the survivors here are library modules):
   - **Tier 2 — deprioritize (IO modules):** files whose primary job is filesystem/MDX/network IO — they import `fs`
     or `gray-matter`, match `*-markdown.ts`, or are thin content-loaders (e.g. `lib/content/content.ts`, the
     `data-structures-and-algorithms` loaders). Testing these means heavy IO mocking for low value.
   - **Tier 1 — prefer (pure logic):** everything else — aggregations, stores, SEO, guardrails, rate-limit,
     formatting/parsing utilities. These have real branching worth asserting.
   Fill the per-dimension cap **from Tier 1 first**, ordered by most uncovered lines; only dip into Tier 2 if Tier 1
   is exhausted under the cap.
4. Emit up to the cap. For each, the finding = the file's relative path + its current pct + uncovered-line count.

#### Scanner: hygiene  → `loop:hygiene`  (ACTIVE)
Two sources, one label:
1. **Semantic duplicates (primary engine).** Invoke the `finding-duplicate-functions` skill (Skill tool) — it scans
   for functions that do the same thing under different names/implementations (common in LLM-written code). Take its
   reported duplicate clusters; each cluster's finding = the shared behavior + the 2+ call sites/paths. Rank by
   (number of duplicate implementations × size of the duplicated logic).
2. **Guardrails.** Run `npm run validate-architecture` and `npm run knip`. CI already keeps these at zero, so expect
   them empty; only if a real violation surfaces (genuine drift) emit it as a finding.

Contract body (Type: hygiene) for a **duplicate** finding:
- Problem/why: "N implementations of `<behavior>` exist (`<pathA>`, `<pathB>`, …) — duplicated logic drifts and bloats."
- Acceptance criteria:
  - [ ] Unify the N implementations into a single shared function in the correct layer (per `.claude/rules/architecture-layers.md`); update every call site; **behavior unchanged**.
  - [ ] `validate-architecture`, `knip`, `lint`, `typecheck`, `test`, `build` all green; no new duplication introduced.
- Scope: only the duplicated logic + its call sites; no unrelated refactors.

For a **guardrail** finding, the acceptance criterion is "the failing scanner (`validate-architecture` / `knip`) goes
green" plus the specific violation, scoped to the flagged module.

#### Scanner: a11y  → `loop:a11y`  (ACTIVE)
Runs the runtime axe harness (`npm run a11y-scan`, backed by `@axe-core/playwright`) against the key public routes.
1. Boot a production server — Bash **background** mode: `npm run build` then `npm start`; never `&`; wait for
   readiness with `curl --retry-connrefused`, never a foreground `sleep`.
2. Run `npm run a11y-scan` (targets `http://localhost:3000`; override with `A11Y_BASE_URL`). It writes
   `a11y-report.json` — an array of `{ route, violations[] }` — and prints a per-`(rule, route)` summary. **Tear the
   server down when done.**
3. Read `a11y-report.json`. Each finding = one **`(rule id, route)` cluster**. Rank by impact
   (critical > serious > moderate > minor), then by node count.

Contract body (Type: hygiene) for an a11y finding:
- Problem/why: "axe rule `<id>` (`<impact>`) fails on `<route>` — `<N>` node(s). `<help>`. (`<helpUrl>`)"
- Acceptance criteria:
  - [ ] `npm run a11y-scan` reports **zero `<id>` violations on `<route>`** — fix the underlying markup/ARIA; do NOT suppress or disable the rule.
  - [ ] No new a11y violations introduced on any scanned route; `lint`, `typecheck`, `test`, `build` green.
- Scope: the component(s)/page rendering `<route>` for rule `<id>` only; no unrelated changes.

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
   with **machine-generated** acceptance criteria. Hygiene and a11y use the acceptance criteria + scope defined in
   their scanner sections above; the coverage body below is the template shape (adjust the footer's scanner name per
   dimension). For coverage:

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
