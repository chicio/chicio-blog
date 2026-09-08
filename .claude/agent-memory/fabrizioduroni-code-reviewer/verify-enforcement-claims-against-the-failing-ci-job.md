---
name: verify-enforcement-claims-against-the-failing-ci-job
description: To accept a doc claim that "X is already enforced by the <job> gate", read the guard's real condition in node_modules, prove which copy it resolves, and pull the historical failing job log with gh — all three, read-only
metadata:
  type: feedback
---

When a diff justifies a config choice with "this is already enforced elsewhere, gate Y fails
outright", confirm three separate things before accepting it:

1. **The guard's actual condition**, in the installed source, not from the changelog. Example:
   `node_modules/typescript-eslint/dist/index.js` throws only when
   `versionMajorMinor.split('.')[0] >= 7`; below that, the unsupported-version notice comes from
   `@typescript-eslint/typescript-estree/dist/parseSettings/warnAboutTSVersion.js`, whose behaviour
   defaults to `'warn'` (`tsestreeOptions.onUnsupportedTypeScriptVersion ?? 'warn'`) and prints to
   the console — it is not an ESLint diagnostic, so `--max-warnings 0` never sees it.
2. **Which copy the guard resolves**, because in a workspaces monorepo the guard may read a
   different dependency copy than the one the diff bumped:
   `node -e "const p=require('path'); console.log(require.resolve('typescript',{paths:[p.dirname(require.resolve('typescript-eslint/package.json'))]}))"`.
3. **That the claimed job really failed that way**, from history:
   `gh pr checks <n>` to see which single job went red, then
   `gh run view --log-failed --job <id>` and grep for the guard's message. This turns "the lint job
   enforces it" from an assertion into a citation.

**Why:** a round-2 blocking finding on `chore/typescript-7` was a comment promising a guard that
`legacy-peer-deps = true` had voided. The round-3 replacement claimed a *different* guard, and only
this three-step check showed the new claim was sound (PR #620: Lint the sole red job, failing at
`typescript-eslint/dist/index.js:52`, everything else green).

**How to apply:** run it whenever a comment or `CLAUDE.md` paragraph shifts the burden of safety onto
a gate rather than onto the config in front of you. Cheap (three commands), and it is the only way to
distinguish a real belt-and-braces note from a second unverified promise.
See [[legacy-peer-deps-voids-peer-range-guarantees]].
