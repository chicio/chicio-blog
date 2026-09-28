---
name: registry-dep-vitest-mock-externalization
description: Website tests that vi.mock("cmdk") break when matrix-design-system resolves from the registry instead of the workspace symlink
metadata:
  type: feedback
---

When the website resolves `matrix-design-system` from the npm registry (real `apps/website/node_modules/matrix-design-system`), vitest externalizes it, so `vi.mock("cmdk")` no longer reaches the package's own `cmdk` import and the 5 command-palette test files (28 tests) fail with `Cannot read properties of undefined (reading 'subscribe')`. The workspace symlink is inlined, so it passes.

**Why:** discovered in PR 1 of the injected-navigation v2 work (2026-09-28): the plan assumed the website could sit on registry 1.1.1 untouched, but its tests went red. Verified fix: `server: { deps: { inline: ["matrix-design-system"] } }` in the jsdom project of `apps/website/vitest.config.ts` (159/159 files green).

**How to apply:** any plan that leaves the website on a published design-system version needs that vitest config line; typecheck and `next build` are unaffected.
