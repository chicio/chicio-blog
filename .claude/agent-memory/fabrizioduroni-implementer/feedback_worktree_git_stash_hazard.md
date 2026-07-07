---
name: feedback_worktree_git_stash_hazard
description: Never use git stash inside a .claude/worktrees/* pipeline worktree — the stash stack is shared across all worktrees via the common .git dir
type: feedback
---

`git stash` / `git stash pop` inside a pipeline worktree (`.claude/worktrees/<branch>/`) operates on the
**stash stack shared with the main repo and every other worktree**, because git worktrees share a single
`.git` directory and its refs (including `refs/stash`). A `git stash pop` with an empty local diff will
happily pop an old, unrelated stash entry left by the human on a totally different branch, and can produce
merge conflicts in files you never touched (observed: popped a years-old content-article stash while just
trying to snapshot/restore state during a knip pre-existing-issue check on issue #422).

**Why:** worktrees are separate working directories but NOT separate git object/ref stores — `refs/stash`
is one ref per repository, not per worktree.

**How to apply:** Never reach for `git stash` as a scratch mechanism inside a worktree, even for a quick
"stash, check something, pop back" maneuver. Use `git diff <base-commit> -- <path>` to compare against a
base ref instead, or `git worktree` a second checkout, or just `git status`/`git log` — anything that
doesn't touch the shared stash ref. If a stash pop ever produces unexpected conflicts, don't panic: check
`git stash list` immediately — a failed/conflicting `pop` keeps the entry on the stack — then
`git reset --hard HEAD` (only if your own tree has no uncommitted work you need) to discard the conflict
markers and leave the stash entry untouched for its rightful owner.
