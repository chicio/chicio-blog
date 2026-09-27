# Parallel Work Units in a background workflow

The SDLC pipeline's implement ⇄ review loop runs as a saved dynamic workflow (`.claude/workflows/`), not inline in the
main thread, so that an Approved Plan split into a Work Unit Graph can be built and reviewed Wave by Wave, with the
Work Units of a Wave in parallel. This reverses the earlier rule that isolation is pipeline-level only and never
per-agent: parallel implementers cannot share one working tree, because each one wipes `.next`, needs port 3000 for
the dev server and Playwright, and commits on the same index. So a Wave with more than one Work Unit gives each its own
worktree and branch, merged back into the feature branch before the next Wave; a Wave of one runs in the pipeline's
shared worktree as before.

## Consequences

- **The mechanical checks are split.** A Work Unit passes only the Unit Checks; the build, the end-to-end suite and
  knip run once, as Full Checks, on the combined result, run by a dedicated gate-runner. The reviewer no longer re-runs
  every check itself: it trusts the gate-runner and verifies specific claims.
- **A workflow cannot ask anything.** A stuck Work Unit (an escalated rebuttal or an exhausted round budget) does not
  pause the run: its dependents are skipped, independent Work Units finish, and the workflow returns a partial result.
  Fabrizio decides in the main thread, which resumes the run from cache.
- **Conflicts are a planning error.** Every file belongs to exactly one Work Unit, so the Human Gate, which approves
  the Work Unit Graph, is where overlap is caught; the merge agent resolves only trivial conflicts.

## Considered Options

- **Parallel Work Units in one shared tree**, trusting disjoint file ownership: git commits from several agents on one
  branch still race, and every build collides on `.next`.
- **Always isolate**: a single-unit plan (every fix, many features) would pay `npm install` in a fresh worktree for no
  parallelism.
