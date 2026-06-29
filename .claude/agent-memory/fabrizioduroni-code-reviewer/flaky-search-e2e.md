---
name: flaky-search-e2e
description: e2e/search.spec.ts listbox-option tests flake under full parallel Playwright load but pass in isolation
metadata:
  type: project
---

`e2e/search.spec.ts` tests that assert `getByRole('listbox', { name: 'Suggestions' }).getByRole('option')`
is visible (around lines 36 and 44) intermittently FAIL when the full `npm run test:e2e` suite runs all specs
across 5 parallel workers, but PASS reliably when the file is run in isolation (`npx playwright test
e2e/search.spec.ts`). Root cause is timing/resource contention loading the elasticlunr search index under
parallel load, not a product bug.

**Why:** observed during review of `feat/read-next-tag-related` (2026-06-29) — implementer flagged it as
pre-existing flake; verified by isolated re-run (5/5 green) and by confirming the diff touched nothing in the
search index / command-palette path.

**How to apply:** when `search.spec.ts` listbox-option assertions fail in a full e2e run, DON'T treat it as a
blocking finding UNLESS the diff under review actually touches the search index pipeline
(`src/lib/content/search-index*`, the search prebuild step), the command palette component, or its store.
Re-run the spec in isolation to confirm green before dismissing. If the diff IS search-related, the failure is
in-scope and blocking.
