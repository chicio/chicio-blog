---
name: feedback_lazy_derive_dont_precompute_per_item
description: Don't add a field to Content (or any type walked by every content-ingestion test) that is populated eagerly for every item — derive it on demand at the few real call sites instead
type: feedback
---

When a new feature needs a derived value per content item (headings, word counts, related-post scores,
anything requiring real parsing work), do NOT add it as a field populated eagerly inside
`getAllContentFor`/`getSingleContentBy` in `src/lib/content/content.ts`. Those two functions are the choke
point every content-walking test in `src/lib/content/**`, `src/lib/build/**`, and `src/lib/mdx/**` goes
through, and `cached()` (`src/lib/build/build-cache.ts`) is a deliberate no-op outside
`NODE_ENV === "production"` — so every test file re-walks and re-parses the whole ~550-file content tree
on its first call, inside the default 5s Vitest `testTimeout`. Vitest isolates module registries per test
file, so even a module-level memo on the derivation function itself is cold in every file.

**Why this bit us**: the reading-companion TOC feature added `Content.headings` as an eager, required
field computed via a full remark AST parse on every ingested item. This pushed
`indexable-content.test.ts` — a test that never even looks at headings — from 860ms to 4795-5651ms,
right at the edge of timing out under coverage instrumentation. The first attempted fix added a
`beforeAll(..., 15000)` warm-up to the one file that was observed failing; that only relocated the cost,
it didn't remove it (a hook timeout doesn't raise the per-`it()` timeout, and every OTHER content-walking
test file still pays the cost cold). The real fix, authorized as an explicit supersede of the original
plan: remove the field from `Content` entirely, and call the (still memoized-by-input) derivation
function directly at the handful of real consumer call sites (rendering a page, generating one markdown
document). Confirmed via `npx vitest run --coverage --reporter=verbose src/lib/content/ src/lib/build/
src/lib/mdx/` — max per-test time before the fix was ~4.8s, after was 974ms.

**How to apply**: before adding any field to `Content` that requires nontrivial computation, count the
real consumers. If it's a handful (not "every render path"), keep it out of the type entirely and export
a plain, memoized-by-input function from `lib/` that callers invoke directly. This also means test
fixtures across the whole repo (every hand-typed `Content` object literal in `*.test.ts(x)`) don't need a
placeholder value for a field they never exercise — removing `Content.headings` deleted ~20 lines of dead
`headings: []` boilerplate across unrelated test files.

**Verification recipe for "is this ingestion-path change actually cheap enough"**: run
`npx vitest run --coverage --reporter=verbose src/lib/content/ src/lib/build/ src/lib/mdx/` and check every
per-test duration is comfortably under ~2.5s (half the 5s default timeout). Do this BEFORE claiming a fix
works, not just re-running the one file that was observed failing — the whole class of content-walking
test files pays the same cold-cache cost.

Related: `feature_reading_companion_toc.md` (the feature this was extracted from), reviewer memory
`per-item-ingestion-cost-times-out-first-test.md`.
