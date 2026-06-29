---
name: commit-all-files
description: Always verify all modified files are staged before committing, especially agent memory files
type: feedback
---

When finishing a topic session, always run `git status` after the final commit to verify nothing was left unstaged. In particular, agent memory files (`.claude/agent-memory/`) must be included in the commit alongside content files.

**Why:** During the topological sort session, I edited memory files but forgot to stage them in the commit. I then told the user "Updated agent memory" when the files were only modified locally, not committed. The PR had no memory changes, which was misleading.

**How to apply:** Before declaring work done and after committing, always run `git status` to catch leftover unstaged changes. Stage all modified files in one commit, or if splitting commits, verify each group. Never say "done" until `git status` shows a clean working tree.
