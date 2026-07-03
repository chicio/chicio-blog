---
name: fabrizioduroni-task
description: Brainstorm a code idea into a high-confidence, loop-ready GitHub issue for chicio-blog — optionally explore the codebase, grill the idea to shared understanding, synthesize the loop-task contract, and file it via gh. The async front-half of the SDLC pipeline. Code work only.
user_invocable: true
disable-model-invocation: true
---

# fabrizioduroni-task — brainstorm an idea into a queued loop contract

This skill turns a rough idea into a **loop-task contract** (a GitHub issue in the `loop-task.yml` shape) that the
autonomous loop can later build unattended. It is the **async front-half of the SDLC pipeline**:

- Interactive pipeline (`/fabrizioduroni-blog-sdlc`): explore → grill → **implement now** (you wait).
- **This skill**: (explore) → grill → **file an issue** → the loop implements it **later** (you walk away).

Front-loading the grilling here is the point: issues authored this way are strong contracts that sail through the
autonomous pipeline's pre-flight check, because the thinking that the autonomous loop *can't* do at build time (there
is no human to interview) already happened at authoring time.

**Scope: CODE work only.** See the Content firewall in step 1.

## Invocation

```
/fabrizioduroni-task [idea] [--explore | --no-explore] [--ready]
```

- `[idea]` — the rough idea, in free text.
- `--explore` / `--no-explore` — force or suppress the codebase-exploration step (step 2). Omit to let the skill
  decide (adaptive; see step 2).
- `--ready` — apply the `loop:ready` label at filing time (see step 6). **Off by default** — filing and approving
  stay separate acts.

Work the steps below in order as a todo list.

## Step 1 — Content firewall (first, always)
If the idea is **content** — a blog post / prose, or a DSA article — **STOP** and redirect: blog prose →
`fabrizioduroni-writer-engineer`; DSA articles → `fabrizioduroni-writer-dsa-engineer`. This skill files **code**
contracts only. (A task that is *both* code and content is filed for the code part only.)

## Step 2 — Explore (adaptive)
Decide whether a full codebase map is worth it:
- **Skip** (rely on grilling's own inline codebase lookup) when the idea is small and well-understood — a copy tweak,
  a link, a one-file change. This is the common case.
- **Dispatch `fabrizioduroni-explorer`** (read-only) when the idea touches **non-trivial or unfamiliar surface** (a new
  section/route, a data-source change, cross-cutting UI) or when a design fork will hinge on codebase facts.
- `--explore` forces the dispatch; `--no-explore` suppresses it.

**Announce the decision** ("small change — skipping explore" / "let me map this with the explorer first"). When you do
explore, run it **before** grilling so the report grounds the brainstorm, and **reuse the same report** in step 4 — do
not dispatch it twice.

## Step 3 — Grill 🚪 (Confirmation #1)
Invoke the **`grilling`** skill in the main thread on the idea (feeding it the exploration report if step 2 produced
one). Interview until you and the user reach **shared understanding** of the approach — grilling's own terminal gate.
Do not synthesize the contract until that shared understanding exists.

## Step 4 — Synthesize the contract
Distill the grilling outcome into the **loop-task contract**, mirroring the fields of `.github/ISSUE_TEMPLATE/loop-task.yml`
so the autonomous pipeline's pre-flight check reads it identically. Draft this exact markdown body:

```markdown
**Type:** feature | fix

### Problem / why
<the motivation, from the grilling>

### Acceptance criteria
- [ ] <concrete, verifiable condition>
- [ ] <concrete, verifiable condition>
- [ ] ...

### Scope boundaries / out-of-scope
In scope: <what the loop should touch>
Out of scope: <what the loop must NOT touch>

### Placement / design hints
<route(s), existing design-system pieces to reuse, data source — concrete references from the exploration/grilling>

---
_Code task (not blog prose or a DSA article). Authored via `/fabrizioduroni-task`._
```

Requirements for the draft (these are what the pre-flight check gates on):
- **Acceptance criteria** must be concrete and verifiable — never empty, never a placeholder. They are what the
  reviewer checks the diff against.
- **Scope** must be explicit — it is the loop's blast-radius control for an unattended run.
- **Type** is `feature` or `fix` (from the idea's nature). `hygiene` is the scout's domain — do not default to it.
- Title: conventional-commit-ish and short, prefixed `[loop]: `.

## Step 5 — Verbatim confirm 🚪 (Confirmation #2)
Show the user the **literal issue title + body** you will file. This is a distinct approval from step 3: "we
understand each other" ≠ "file this exact text." The loop reads these acceptance criteria literally and will not grill
the user later to fix a mistranslation, so this is the last cheap moment to correct wording. Iterate on the draft
until the user approves the exact text.

## Step 6 — File
Create the issue (write the approved body to a temp file to preserve markdown, then):

```bash
gh issue create --title "[loop]: <short description>" --body-file <path>
```

- **Do not apply `loop:ready`** unless `--ready` was passed. Filing ≠ approving: by default the user reviews the filed
  issue on GitHub and applies `loop:ready` themselves when ready to let the loop build it.
- If `--ready` was passed: `gh issue edit <N> --add-label loop:ready` right after creation. Only do this because the
  user explicitly opted in and just approved the verbatim contract in step 5.

Return the issue URL and state clearly whether it is `loop:ready` (queued) or awaiting the user's label.

## Invariants
- **Code only** (step 1 firewall).
- **Two confirmations** — grilling's shared-understanding, then the verbatim-contract approval.
- **Never auto-approves** — `loop:ready` is applied only with an explicit `--ready`.
- **Files, never builds** — this skill queues work; the autonomous loop (or the interactive pipeline) builds it.
