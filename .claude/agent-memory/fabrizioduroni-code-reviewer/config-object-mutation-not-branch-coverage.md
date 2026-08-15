---
name: config-object-mutation-not-branch-coverage
description: 100% branch coverage never proves a provider/config object (providerOptions, maxOutputTokens, model id) is tested — delete the whole options block in a scratchpad copy and re-run to prove the assertion exists
metadata:
  type: feedback
---

When a diff changes a **configuration object** passed to a third-party call (`providerOptions`, `maxOutputTokens`,
`temperature`, a model id, request headers, retry options), coverage numbers say nothing about whether a test would
catch its removal. A config key is not a branch: `src/lib/chat/guardrails.ts` sat at **100% statements / branches /
functions / lines** while deleting its entire `providerOptions: { groq: { reasoningFormat, reasoningEffort } }` block
left all 1557 tests green.

**Why:** the coverage gate and `test:run` both reward *executing* the object literal, not *asserting* its contents.
Implementers routinely assert the config on one call site (the one they thought about) and forget the sibling call
site, so the review has to check each changed key individually.

**How to apply:** run a mutation harness outside the repo (you are read-only on the codebase):

```
S=<scratchpad>/redgreen
cp src/lib/<mod>.ts src/lib/<mod>.test.ts $S/
ln -sfn <repo>/node_modules $S/node_modules      # so `vitest`/mocked ids resolve
printf 'import {defineConfig} from "vitest/config";\nexport default defineConfig({test:{environment:"node",include:["*.test.ts"]}});\n' > $S/vitest.config.ts
cd $S && npx vitest run --root $S                 # baseline green
# then mutate $S/<mod>.ts once per changed key and re-run
```

One mutant per changed key/behavior. A mutant that leaves the suite green = an untested behavior change =
blocking under "every changed behavior needs a test that fails on regression". Mutants that each kill exactly
one named test = a genuine red-green proof you can cite in the review.

Also check the *strength* of a surviving assertion: `expect(maxOutputTokens).toBeGreaterThan(5)` dies on a revert
to 5 (non-vacuous) but still passes at 6, which reproduces the very outage the change fixed. Prefer an exact
`toBe(<value>)` and say so as a non-blocking note.

Related: [[knip-does-not-ignore-test-files]] (green tool ≠ complete change),
[[prove-e2e-guard-non-vacuous-with-control-page]] (same proof discipline for e2e locators).
