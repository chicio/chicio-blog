---
name: per-item-ingestion-cost-times-out-first-test
description: Any diff adding per-content-item work to ingestion must be timed against the FIRST it() of every content-walking node test — the 5s testTimeout is the real gate, and a memo plus one file's beforeAll warm-up only fixes the instance you observed
metadata:
  type: feedback
---

When a diff adds work to the content ingestion path (AST parse, slugging, extra frontmatter derivation),
time the **first `it()` of every content-walking node test file** — not just the one that was observed
failing.

**Why:** `cached()` in `build-cache.ts` is a deliberate no-op outside `NODE_ENV === "production"`, so every
test that calls `getIndexableContent()` / `posts.list()` / `generateFilesystemManifest()` re-walks and
re-parses the whole ~550-file content tree. Vitest isolates module registries per test file, so a
module-level memo in `lib/` is cold in each file: **every** content-walking file pays the full first-walk
cost inside the default 5s `testTimeout`. On the reading-companion TOC branch, heading extraction pushed
`indexable-content.test.ts`'s first test from 860ms (main) to 4795ms isolated and 5117-5651ms under the
full parallel suite — red gate. The implementer had added a memo plus a `beforeAll(..., 15000)` warm-up
to `filesystem-manifest-factory.test.ts`, the one file it had watched fail, and shipped it as fixed.

**How to apply:** this is the reproducible-measurement recipe, do all three:

1. `npm run test:coverage` on the branch, then the same on the `main` worktree back-to-back on the same
   machine. Same machine, same session — that is what separates regression from contention. (main's
   baseline prints 91.9 / 84.41 / 89.17 / 92.45.)
2. Re-run the failing file alone: `npx vitest run --coverage <file>`. **It will usually pass alone** —
   that is not exoneration, it means the margin is thin. Compare per-test durations with
   `--reporter=verbose` against the same command in the main worktree.
3. Sweep the class, not the instance:
   `npx vitest run --coverage --reporter=verbose src/lib/content/ src/lib/build/ src/lib/mdx/` and list
   every test over ~2.5s. Anything near 5s is the next failure.

A `beforeAll` with a raised **hook** timeout does not raise the per-`it()` timeout — it only moves cost
out of the first test in that one file. Treat "added a warm-up" as suspicious until the sweep is clean.

Related: [[run-test-coverage-not-just-test-run]].
