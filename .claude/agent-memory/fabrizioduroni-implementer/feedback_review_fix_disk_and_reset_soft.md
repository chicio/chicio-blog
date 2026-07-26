---
name: feedback_review_fix_disk_and_reset_soft
description: review-round fix workflow — git reset --soft + path-staged recommit to reshape history; disk-full false negatives; e2e stale-server false positives
type: feedback
---

Confirmed-good workflow for a "fix the reviewer's findings, keep the 2-commit shape" round on an already-committed
branch (not a fresh implement pass):

**Reshaping history back to N commits after adding fixes.** `git reset --soft origin/main` unstages nothing — it
restages the ENTIRE diff between old HEAD and the merge-base as already staged. From there, `git add <path>` per
target commit's file list (matching the original commits' `git show --stat` output) lets you recreate the same N
commits with the new fixes folded in, by committing the first path-set, then `git add` the rest and committing again.
Gotcha: `git add pathA pathB badPath` aborts the WHOLE call with "fatal: pathspec ... did not match" and stages
NOTHING, even the valid paths — always add one path at a time, or verify each path exists first (e.g. a since-deleted
generic-header dir has no working-tree files to `git add`, it's already staged as a deletion by the reset).

**A file touched only by the fix round (not in either original commit) goes into whichever commit's "everything
except X" bucket applies** — don't invent a third commit for it if the plan didn't ask for one.

**Disk-full is often transient on a dev machine, not a real blocker.** Saw `ENOSPC` mid-`npm run build` when host
disk was at 99-100% capacity (~180Mi free) — even Bash tool output-file writes started failing. Retrying the exact
same command minutes later succeeded with gigabytes free, almost certainly macOS APFS purging local Time Machine
snapshots once usage crossed a pressure threshold. Do NOT go clean up unrelated system caches (Homebrew/JetBrains/pip)
to fix this — the auto-mode classifier blocks deletions outside the repo, and it resolves itself. Just retry once
after confirming `df -h /`.

**e2e homepage/about-me hangs on a long-lived ad hoc port after a big parallel Playwright run are a stale-server
artifact, not a regression.** After running the full 80-spec suite with default (parallel, many-worker) settings
against a `next start -p 3100` instance, `page.goto("/")` and `page.goto("/about-me")` started hanging forever
(`waiting until "load"`, zero pending resources, browser prints `No available adapters` for WebGPU) on THAT SAME
server process, reproducibly, for both a `curl`-style probe and Playwright itself — while a brand-new `next start` of
the IDENTICAL build on a fresh port (3300) served both routes in under a second. Root cause is presumed to be the
GPU/WebGPU compositor service on the host getting into a bad state after dozens of concurrent Chromium contexts, tied
to that specific long-lived server process's connections, not the app code. **Diagnostic recipe that proved it**: (1)
reproduce in isolation with a tiny Node script using `playwright-core` directly (no test runner needed) hitting the
suspect port; (2) build+start the SAME commit on a throwaway fresh port and re-probe — if it now passes, the server
instance (not the code) is the variable; (3) as a second control, build+start `origin/main` in a disposable
`git worktree add <scratch-path> origin/main --detach` (symlinking `node_modules` fails under Turbopack — "points out
of the filesystem root" — do a real `npm ci` instead) and confirm main has the same latent behavior under the same
conditions, ruling out a code regression entirely. Fix: kill the degraded server, start a fresh one, rerun the full
suite there — it went 80/80 green including the previously-known-flaky `terminal.spec.ts:67`.

Related: [[feedback_worktree_git_stash_hazard]].
