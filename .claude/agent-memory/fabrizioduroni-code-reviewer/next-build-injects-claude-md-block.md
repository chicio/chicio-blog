---
name: next-build-injects-claude-md-block
description: Running npm run build/dev dirties CLAUDE.md with a nextjs-agent-rules block; it is a tool artifact, never the implementer's diff
metadata:
  type: project
---

`npm run build` (and `next dev`) appends a `<!-- BEGIN:nextjs-agent-rules -->` / `<!-- END:nextjs-agent-rules -->`
block to the repo-root `CLAUDE.md`, written by `node_modules/next/dist/server/lib/generate-agent-files.js`.
After running the build gate you will see `M CLAUDE.md` in `git status` even though the branch never touched it.

**Why:** it matters because a reviewer runs the build gate itself. Seeing `M CLAUDE.md` after that run looks
exactly like the implementer smuggling an unrelated doc edit into the diff, and reporting it would be a false
blocking finding. It is also a trap in the other direction: if the implementer ran a build, the block can get
swept into a `git add -A` commit as real scope creep.

**How to apply:**
- Attribute it by timing: `git status` was clean before your build, dirty after → yours, not theirs. Confirm with
  `git diff main...HEAD --stat -- CLAUDE.md` (empty = the branch genuinely does not touch it).
- Restore it with `git checkout -- CLAUDE.md` before finishing, so you leave the read-only tree clean.
- Do check whether the *committed* diff contains that block; if it does, that IS a legitimate scope finding.

Related: [[e2e-in-worktree-webserver]], [[e2e-reuse-existing-server-stale-app]].
