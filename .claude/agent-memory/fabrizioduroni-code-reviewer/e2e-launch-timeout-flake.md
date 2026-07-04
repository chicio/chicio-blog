---
name: e2e-launch-timeout-flake
description: Full Playwright suite flakes with "browserType.launch Timeout" under parallel load on this machine; re-run failing specs with --workers=1 before calling it a regression
metadata:
  type: feedback
---

When `npm run test:e2e` reports a scattered set of failures across UNRELATED specs (e.g. blog listing + post page + search all failing together), check the `test-results/**/error-context.md` artifacts for `TimeoutError: browserType.launch: Timeout 180000ms exceeded`. That is Chromium failing to spawn under parallel-worker resource starvation on this dev machine — NOT a code regression.

**Why:** During the issue #419 review, 8 specs failed in the full parallel run (16.7m) with launch timeouts; re-running the exact same specs with `npx playwright test <specs> --workers=1` passed all 22. The `.next` prod build was already present, so the webServer reused it.

**How to apply:** Before recording an e2e failure as a blocking finding, re-run the failing spec files with `--workers=1` (kill any stale process on :3000 first). Only a reproducible single-worker failure is a real regression. A launch-timeout that clears on re-run is environmental and should be reported as e2e: pass with a note, not CHANGES_REQUIRED.
