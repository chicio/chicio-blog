---
name: knip-does-not-ignore-test-files
description: knip.json has no `ignore` key and lists test files under `project`, so imports from tests count as usage — "knip proves the deletions are complete" is only partially true; grep production code directly
metadata:
  type: feedback
---

`npm run knip` passing does NOT prove a deleted symbol had no remaining production consumer, and does NOT
prove a surviving export is still used by shipped code.

**Why:** `.claude/rules/testing.md` states that knip ignores `**/*.test.*` and `**/*.spec.*`. That is stale.
The actual `knip.json` has **no `ignore` key at all**. Its `project` globs are
`src/**/*.{ts,tsx,mdx}` + `e2e/**/*.ts`, which *include* test files, and `e2e/**/*.ts` is even an `entry`.
Combined with `ignoreExportsUsedInFile: true`, this means an export whose only remaining consumer is its own
co-located `.test.ts` is counted as used and is silently NOT reported.

**How to apply:** when a diff claims a deletion/refactor is complete and cites knip as the proof, do not accept
knip green as sufficient. Run an explicit grep over production code for the deleted module path and every
deleted export name, e.g.:

```
grep -rn "input-focus-guard\|shouldIgnoreKeystroke\|appendToSpoonPhraseBuffer" src/ e2e/
```

Hits confined to `docs/` (spec narrative) are fine. Also worth a non-blocking note when a surviving export's
only consumer is its own test — that is production dead code knip will never surface.

Related: [[metadata-adapter-to-passthrough-divergence]].
