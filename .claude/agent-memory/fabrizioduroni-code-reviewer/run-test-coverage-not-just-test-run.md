---
name: run-test-coverage-not-just-test-run
description: The CI test job runs npm run test:coverage, not test:run; content-tree-walking tests sit near the 5s testTimeout under v8 instrumentation, so any new per-item parse in lib/content can turn CI red while test:run stays green
metadata:
  type: project
---

`npm run test:run` passing does NOT prove the CI `test` job passes. `.github/workflows/ci.yml` runs
`npm run test:coverage`, and v8 instrumentation multiplies wall time roughly 3x. Several existing tests
that walk the whole content tree already sit at ~1.3-2.0s uninstrumented / ~4.5s instrumented against
vitest's default 5000ms `testTimeout`:

- `src/lib/build/filesystem-manifest-factory.test.ts`
- `src/lib/content/indexable-content.test.ts`

**Why:** `src/lib/build/build-cache.ts` gates `cached()` on `process.env.NODE_ENV === "production"`, so
under vitest the cache is a **no-op** and *every* test re-walks and re-parses all ~547 `content.mdx`
files. Any new eager per-item work inside `getAllContentFor` / `getSingleContentBy` is therefore paid
once per test, not once per process — a ~600ms addition (e.g. a `unified` parse per file) becomes ~2s
under coverage and pushes those tests over the limit.

**How to apply:** whenever a diff adds work to the content ingestion path (`src/lib/content/content.ts`
and anything it calls), run `npm run test:coverage` yourself, not just `test:run`. To attribute a
timeout, measure the added pass in isolation (`node --input-type=module -e` replicating it over
`src/content/**/content.mdx`) and compare it against the uninstrumented per-test duration from
`npx vitest run --reporter=verbose <file>`; the instrumented/uninstrumented ratio is ~3.4x.
Reject "just raise `testTimeout`" — it hides a real doubling of ingestion cost. Memoizing the new work
by content string, or making the field lazy, is the right fix.

Coverage thresholds themselves live in `vitest.config.ts` (currently statements 91 / branches 84 /
functions 88 / lines 92) — note `.claude/rules/testing.md` still documents the old 64/59/61/65 floor and
is stale.
