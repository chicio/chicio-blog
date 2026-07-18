---
name: e2e-search-listbox-flake
description: e2e/search.spec.ts "typing a query shows search results" can flake under parallel workers — listbox renders but options aren't populated in time; re-run serially before blaming a search-index change
metadata:
  type: feedback
---

`e2e/search.spec.ts:36` ("typing a query shows search results in the listbox") can fail
under parallel Playwright workers with: `getByRole('listbox',{name:'Suggestions'})` visible
but `.getByRole('option').first()` "element(s) not found" within the 10s timeout.

**Why:** the command-palette search index loads client-side and cmdk filters asynchronously;
under parallel-worker CPU contention the options list hasn't populated before the assertion.
The tell-tale that it is a flake and NOT a regression: the sibling test at line 44
("search results include posts matching the query") uses the **identical** query `"react"`
and passes in the same run — a genuinely broken search index cannot return results for one
`"react"` query and none for an identical one.

**How to apply:** when a diff regenerates `public/search-index.json` (e.g. adding a synthetic
search entry) and only `search.spec.ts:36` fails while line 44 passes, do NOT call it a
regression. Re-run `npx playwright test e2e/search.spec.ts --workers=1` to confirm it passes
serially. Related parallel-load flakes: [[e2e-launch-timeout-flake]], [[e2e-in-worktree-webserver]].
