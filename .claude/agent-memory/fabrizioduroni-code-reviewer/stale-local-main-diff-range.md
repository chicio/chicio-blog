---
name: stale-local-main-diff-range
description: the prompt's "main...feat/x" range can resolve against a stale LOCAL main and drag an already-merged PR into the review; diff against origin/main's merge-base instead
metadata:
  type: feedback
---

Rule: before you read a diff, compare `git rev-parse main origin/main` and `git merge-base origin/main <feature>`. When
local `main` is behind origin, `main...<feature>` still includes the commits the feature branched from (the previous PR
and its release), so those show up as if they were this change. Use `origin/main...<feature>` instead.

**Why:** on the Manga PR (2026-09-29), local main sat one merge behind origin. `main...feat/manga-collection` listed
151 files, including the whole design-system v2 Menu/Footer rewrite from #712 (already merged and released). The
real range, `origin/main...`, has 134 files. Reviewing the wider range would have re-judged a shipped PR and blurred
which unit owns what.

**How to apply:** at the start of every Integration Review, and every Unit Review whose base is named `main`. The
workflow's pipeline worktree is created off `origin/main`, so the merge-base with origin is the true base. Related:
[[prior-round-findings-in-workflow-journal]], [[codegraph-index-is-repo-root-not-worktree]].
