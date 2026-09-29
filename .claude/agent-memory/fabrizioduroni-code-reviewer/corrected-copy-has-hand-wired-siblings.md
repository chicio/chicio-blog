---
name: corrected-copy-has-hand-wired-siblings
description: when a fix replaces a hardcoded section description (terminal manifest, page metadata) with frontmatter, grep the wrong phrase across the other hand-wired surfaces (app/manifest.ts PWA shortcuts, llms.txt, MCP); and a dirty public/filesystem.json after a build is prebuild output
metadata:
  type: feedback
---

A fix that swaps one hardcoded description for the section's frontmatter usually leaves the same wrong copy in a
sibling surface that is also wired by hand. Seen: the terminal said Art was a "3D and generative art gallery"; the fix
corrected the terminal, but `apps/website/src/app/manifest.ts` (PWA `shortcuts`) still said "Browse 3D art and
generative works". The exploration never found it, so the plan never listed it.

**Why:** hand-wired surfaces (terminal manifest factory, PWA manifest shortcuts, llms.txt, MCP resources) copy prose
independently; no gate compares them to the content frontmatter.

**How to apply:** grep for a distinctive word of the old wrong phrase (e.g. `generative`) across `apps/website/src`,
not the exact string. If it falls outside the Approved Plan's enumerated bugs, report it non-blocking and suggest the
follow-up; do not block on scope the Human Gate did not approve.

Related: `apps/website/public/filesystem.json` is git-tracked (committed by accident in a dependabot PR, already
stale) yet rewritten by prebuild on every build, so it shows dirty after any gate-runner build. That is build output,
not the implementer's diff; verify with `git ls-files` / `git log -- <file>` before treating it as a finding. See
[[next-build-injects-claude-md-block]].
