---
name: project-ci-pipeline
description: GitHub Actions CI pipeline architecture — seven parallel gate jobs, then build, then e2e
metadata:
  type: project
---

CI workflow lives at `.github/workflows/ci.yml` (renamed from `build.yml` on 2026-06-05; workflow name changed from `Build` to `CI`).
It triggers on `push` to every branch (`"**"`); there is no separate `pull_request` trigger.

## Job topology

Nine jobs, all on `ubuntu-latest` (verified against `ci.yml` 2026-09-27):

- Gates, in parallel: `lint` (`npx turbo run lint`; `--max-warnings 0` lives in each workspace's own lint script),
  `format` (`npm run format:check`, repo-wide, not a turbo task), `knip`, `validate-architecture`, `typecheck`,
  `test` (Vitest with coverage thresholds), `verify-packages` (the published packages)
- `build` — `npx turbo run build` with `needs:` all seven gates; does NOT start unless every gate passes
- `e2e` — `E2E (Playwright)`, `needs: [build]`; caches `~/.cache/ms-playwright`, installs chromium, runs
  `npx turbo run test:e2e`, uploads `apps/website/playwright-report/`

**Why:** Failing fast on the static gates avoids paying for `prebuild` (image copy + search index generation) plus a full Next.js compile on trivially broken code. Parallel gates give faster signal than sequential steps inside a single job.

## Key design decisions

- **One workflow file, not one per job**: same PR status check granularity per job, single place to maintain triggers/caching, no duplication. Separate files only worth it if triggers or ownership diverged.
- **Knip exit semantics**: exits 1 when findings exist, 0 when clean — no flag needed to make it a hard gate.
- **Secrets only where the app runs**: Upstash/Resend secrets are injected on `build` and `e2e` only; the gates never execute runtime code.
- **Turborepo remote cache**: every turbo job exchanges GitHub's OIDC token via `vercel/setup-turborepo-remote-cache-action` (`continue-on-error: true`, so a missing policy just means no cache, never a red job).
- **`concurrency` group**: `${{ github.workflow }}-${{ github.ref }}` with `cancel-in-progress: true` — superseded pushes on the same branch get cancelled.
- **`npm ci` everywhere** (not `npm install`): deterministic, fails on lockfile drift.
- **`actions/setup-node@v5` with `node-version-file: "package.json"` and `cache: "npm"`**. History: this replaced a custom `actions/cache@v4` step whose key referenced an unset `${{ env.cache-name }}`.

## Platform migration

Build job moved from `macos-latest` to `ubuntu-latest`: ~10x cheaper GitHub Actions minutes, faster runners, closer parity with Vercel's Linux build environment.

## Contextual notes for future work

- Vercel handles all production deploys; the GitHub Actions `build` job gates and archives `apps/website/public` as the `site` artifact — it does not deploy.
- The automated suite (Vitest + Playwright, see `.claude/rules/testing.md`) is gated here by `test` and `e2e`.
- YAML in this repo uses 2-space indentation — the "4 spaces" rule in `code-style.md` applies to TS/TSX only.
- Conventional commit scope for CI/workflow changes: `ci` (or `capabilities` if mixed with feature work).
