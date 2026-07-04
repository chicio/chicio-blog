---
name: feature_a11y_scan_harness
description: Runtime accessibility scan harness (axe-core/playwright) for the fabrizioduroni-scout skill
type: project
---

`src/lib/a11y/axe-scan.ts` (npm script `a11y-scan`, invoked via `tsx`) is a standalone dev/ops script — NOT part of
the Next.js build graph or any product import. Built 2026-07-04 as scanner tooling for the `fabrizioduroni-scout`
skill's a11y dimension.

**Shape**: launches headless Playwright chromium, hits a curated list of ~10 representative routes
(home, blog listing/authors/tags/archive, about-me, chat, contact, one sample post, one author detail) against
`process.env.A11Y_BASE_URL` (default `http://localhost:3000` — caller boots the server, script only scans), runs
`@axe-core/playwright`'s `AxeBuilder(page).analyze()` per route, writes `a11y-report.json` (gitignored, grouped by
route) and prints an impact-sorted `(rule, route)` summary to stdout. Always exits 0 — it's a report, not a gate.

**Gotcha (cost a smoke-test round-trip)**: `AxeBuilder.analyze()` internally calls `context.newPage()` to run
`axe.finishRun()` on a blank page. Playwright's `browser.newPage()` shortcut creates a context with an "owner page"
already set, and calling `newPage()` again on that context throws `Error: Please use browser.newContext()`. Fix:
create the context explicitly — `const context = await browser.newContext(); const page = await context.newPage();`
— never `browser.newPage()` when the caller (or a dependency like axe-core) might call `page.context().newPage()`
again later.

**Wiring**: no explicit `knip.json` entry needed — knip auto-detects `tsx <path>` scripts referenced in
`package.json` "scripts" as entry points (confirmed by knip's own "Remove redundant entry pattern" hint when an
explicit entry was added alongside the npm script; other build scripts like `prebuild.ts` and
`chat-knowledge-upload.ts` follow the same auto-detected pattern and are NOT in `knip.json`'s `entry` array either).
`axe-core` needed an explicit `devDependencies` entry (not just `@axe-core/playwright`) because the script
type-imports `ImpactValue`/`Result` directly from `axe-core` — knip flags direct imports from transitive-only
packages as "Unlisted dependencies" even when a parent package re-exports the types.

Coverage-excluded in `vitest.config.ts` (`src/lib/a11y/**`) alongside prebuild/copy-content-media/chat-knowledge-upload
— same rationale (IO/network dev script, no meaningful unit-test surface, mock-heavy tests would be noise not signal).
