---
name: prove-e2e-guard-non-vacuous-with-control-page
description: Prove a new e2e assertion would fail on regression by running it from a scratchpad config against a page that lacks the feature
metadata:
  type: feedback
---

To decide whether a newly added e2e assertion is meaningful or green-but-vacuous, run its exact locators against
a **control page that legitimately lacks the feature** and confirm they fail with "element(s) not found", plus a
positive control on the real page. This answers "would this fail if the behaviour regressed" empirically instead
of by reading.

Mechanics that work here without touching the repo (reviewer is read-only):
- Put the control spec **and** its own `defineConfig` in the scratchpad; import `@playwright/test` by absolute
  path into the worktree's `node_modules` (a bare specifier will not resolve from outside the project).
- Point `testDir` at the scratchpad dir and `baseURL` at your own `next start -p 3100` server.
- Use `page.goto(url, { waitUntil: "domcontentloaded" })`: some content pages (the NES console page, galleries)
  carry enough media that the default `load` wait blows the 30s test timeout and you get a navigation failure
  that tells you nothing about the assertion.

**Why:** a green assertion proves nothing on its own, and "a green-but-meaningless test is a blocking finding"
is the standard this review stage exists to enforce. Ten minutes of control-running converts a judgement call
into evidence.

**How to apply:** good control pages in this repo are the deliberate exclusions — the NES console page has no
Startup section, `/chat` has no static content in the terminal shell. Note what the assertion still does *not*
pin down (an `iframe[src*='youtube.com/embed']` locator passes even with the wrong videoId) and report that as
non-blocking.

Related: [[e2e-selector-must-be-feature-unique]], [[e2e-reuse-existing-server-stale-app]].
