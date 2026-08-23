---
name: verify-mutation-claims-in-a-shadow-src-tree
description: How to independently reproduce an implementer's "I verified red-green by temporarily breaking X" claim without violating read-only — a scratchpad shadow copy of src (minus src/content) with node_modules symlinked runs the real vitest suite in ~1s
metadata:
  type: feedback
---

Rule: never accept "I verified the test catches the regression by temporarily reintroducing X" on
faith, and never mutate the worktree to check it. Build a shadow tree in the scratchpad and mutate
that.

Recipe (all paths absolute; the sandbox refuses shell loops and multi-line `sed`, so use one plain
command per step):

```
SH=<scratchpad>/shadow
cp vitest.config.ts vitest.setup.ts package.json tsconfig.json "$SH/"
cp -R src/components src/types src/test-utils src/lib src/app "$SH/src/"   # NOT src/content
ln -s <worktree>/node_modules "$SH/node_modules"
cd "$SH" && npx vitest run --project jsdom <file-name-substrings>
```

Why it works: `vitest.config.ts` aliases `@` via `resolve(__dirname, "./src")`, so with the config
copied to the shadow root the alias re-points at the shadow `src` automatically, and
`setupFiles: ["./vitest.setup.ts"]` resolves there too. Establish a green baseline first — it
proves the harness is faithful before any mutant means anything.

Sizing: `src/content` is ~409 MB (blog media) and no component test needs it; excluding it puts the
shadow tree at ~4.4 MB and a five-file run at ~1 s, so one mutant per changed behavior is cheap.
Mutate with a single-line `sed -i '' '<line>s|old|new|'` — BSD sed will not expand `\n` in the
replacement, so prefer edits that stay on one line (`href={to}` → `href={to} prefetch={false}` is
valid JSX and needs no newline). Revert each mutant by `cp`-ing the pristine file back from the
worktree, and re-run the baseline at the end to prove every revert landed.

**Why it matters:** it converts "the implementer says it's red-green" into evidence, catches the
mutants the implementer did NOT claim to test (a claim about component A says nothing about
component B), and leaves `git status` showing only your memory files — the independence that makes
the loop worth running survives intact. It also finds *surviving* mutants, i.e. properties the code
gets right but no test pins (a one-way latch rewritten as a toggle passing every hover/focus test
is a real, reportable, non-blocking gap).

Related: [[config-object-mutation-not-branch-coverage]], [[deleted-prop-and-collapsing-enum-tests]].
