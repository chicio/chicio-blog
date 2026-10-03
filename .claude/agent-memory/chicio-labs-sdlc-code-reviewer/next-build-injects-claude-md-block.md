---
name: next-build-injects-claude-md-block
description: Running npm run build/dev can rewrite the nextjs-agent-rules block (now hosted in root AGENTS.md); an uncommitted change to it is a tool artifact, never the implementer's diff
metadata:
  type: project
---

`npm run build` (and `next dev`) upserts a `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:nextjs-agent-rules -->`
block, written by `node_modules/next/dist/server/lib/generate-agent-files.js`. Current state (verified 2026-09-27): the
project instructions moved to root `AGENTS.md` (PR #695; `CLAUDE.md` is just `@AGENTS.md`), and the generator prefers
`AGENTS.md`, so the block now lives there and is COMMITTED. A build only dirties the tree when the generated block
differs from the committed one (e.g. after a `next` bump), and then you see `M AGENTS.md` (historically `M CLAUDE.md`)
even though the branch never touched it.

**Why:** it matters because a reviewer runs the build gate itself. Seeing `M CLAUDE.md` after that run looks
exactly like the implementer smuggling an unrelated doc edit into the diff, and reporting it would be a false
blocking finding. It is also a trap in the other direction: if the implementer ran a build, the block can get
swept into a `git add -A` commit as real scope creep.

**How to apply:**
- Attribute it by timing: `git status` was clean before your build, dirty after → yours, not theirs. Confirm with
  `git diff main...HEAD --stat -- AGENTS.md CLAUDE.md` (empty = the branch genuinely does not touch them).
- Restore it with `git checkout -- AGENTS.md` (or `CLAUDE.md`) before finishing, so you leave the read-only tree clean.
- Do check whether the *committed* diff contains that block; if it does, that IS a legitimate scope finding.

Related: [[e2e-in-worktree-webserver]], [[e2e-reuse-existing-server-stale-app]].
