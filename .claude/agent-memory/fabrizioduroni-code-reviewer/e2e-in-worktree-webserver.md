---
name: e2e-in-worktree-webserver
description: Running test:e2e inside an isolated SDLC worktree can fail on webServer startup (EADDRINUSE / stale .next / prebuild rmSync ENOTEMPTY) — not a diff regression
metadata:
  type: feedback
---

`npm run test:e2e` inside a pipeline worktree (`.claude/worktrees/<branch>`) may fail before any test runs, with
webServer errors that are environmental, NOT diff regressions:
- `EADDRINUSE :::3000` — a leftover server from a prior run.
- `ENOENT .next/required-server-files.json` — playwright's `next start` raced an incomplete build.
- `ENOTEMPTY rm public/media/content` — prebuild's `copy-content-media` rmSync flakes on macOS.

**Why:** playwright.config webServer runs `npm run build && npm run start` with `reuseExistingServer: !CI`; the
build's prebuild step and port binding are fragile when a worktree shares the machine with other node processes.

**How to apply:** before calling the e2e result a failure, do the deterministic recovery: `lsof -ti :3000 | xargs
kill -9`, `rm -rf public/media/content`, `npm run build` manually, then start `npm run start` in the background and
let playwright reuse it (reuseExistingServer is true locally). Only a genuine per-test assertion failure is a
blocking finding. Related: [[e2e-launch-timeout-flake]].
