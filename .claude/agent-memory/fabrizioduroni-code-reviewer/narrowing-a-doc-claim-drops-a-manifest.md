---
name: narrowing-a-doc-claim-drops-a-manifest
description: When a review forces an over-broad doc claim ("every workspace pins X") into an explicit enumeration, re-check the enumeration against `git diff --stat` — the rewrite reliably omits one manifest the same diff touched
metadata:
  type: feedback
---

A doc sentence rewritten from a quantifier ("every workspace's `typescript` is `^7.0.2`") into an
explicit list ("`apps/website`, `packages/matrix-design-system` and `packages/matrix-component-store`
each pin ... (`packages/eslint-plugin-chicio` declares none; the `matrix-rain-*` packages keep
`tsover@6.0.2`)") reads as an exhaustive accounting because it enumerates the exceptions too. Verify
the list against the diff's own file list, not against the prose.

**Why:** on `chore/typescript-7` the round-3 commit that correctly fixed the over-broad "every
workspace" claim produced a three-item list while the same diff bumped **four** manifests to
`^7.0.2` — `apps/matrix-design-system-showcase` was bumped and then left out of both the list and
the exception parenthetical. The imprecision moved rather than disappeared. This monorepo has five
`typescript`-declaring manifests across `apps/` and `packages/`, and the showcase app is the one
reviewers and authors forget.

**How to apply:** for any doc/comment claim of the form "these N places do X", run the grep that
enumerates the real set (`grep -rn '"typescript"' package.json apps/*/package.json
packages/*/package.json`) and diff it against the prose. Classify a missing member as non-blocking
docs completeness unless the omission would make someone change code (then it is a correctness
claim). See [[legacy-peer-deps-voids-peer-range-guarantees]] for the sibling shape: a doc claim
about enforcement that no gate actually makes.
