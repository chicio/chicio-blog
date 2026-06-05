---
name: project-ci-pipeline
description: GitHub Actions CI pipeline architecture — three-job workflow with lint/knip gates before build
metadata:
  type: project
---

CI workflow lives at `.github/workflows/ci.yml` (renamed from `build.yml` on 2026-06-05; workflow name changed from `Build` to `CI`).

## Job topology

Three jobs, all on `ubuntu-latest`:

- `lint` — runs `npm run lint -- --max-warnings 0`
- `knip` — runs `npm run knip` (static dead-code analysis)
- `build` — full Next.js build with `needs: [lint, knip]`; does NOT start unless both gates pass

**Why:** Failing fast on lint/knip avoids paying for `prebuild` (image copy + search index generation) plus a full Next.js compile on trivially broken code. Parallel gates give faster signal than sequential steps inside a single job.

## Key design decisions

- **One workflow file, not three separate files**: same PR status check granularity per job, single place to maintain triggers/caching, no duplication. Separate files only worth it if triggers or ownership diverged.
- **`--max-warnings 0` added at CI invocation, not in `package.json`**: preserves local-dev ergonomics while making CI strict. The ESLint config does not gate warnings by default.
- **Knip exit semantics**: exits 1 when findings exist, 0 when clean — no flag needed to make it a hard gate. The gate returns to green automatically once findings are resolved.
- **No Upstash/Resend secrets on lint/knip jobs**: neither executes runtime code. Build job retains the secrets as before.
- **`concurrency` group**: `${{ github.workflow }}-${{ github.ref }}` with `cancel-in-progress: true` — superseded pushes on the same branch get cancelled.
- **`npm ci` everywhere** (not `npm install`): deterministic, fails on lockfile drift.
- **`actions/setup-node@v4` with `cache: 'npm'`** replaces the previous custom `actions/cache@v4` step, which had a latent bug — the cache key referenced `${{ env.cache-name }}` (an env var that was never set), resolving to an empty string.

## Platform migration

Build job moved from `macos-latest` to `ubuntu-latest`: ~10x cheaper GitHub Actions minutes, faster runners, closer parity with Vercel's Linux build environment.

## Contextual notes for future work

- Vercel handles all production deploys; the GitHub Actions `build` job is primarily for artifact archival (`public/` upload) and gating — not deploys.
- No automated test suite exists (per `.claude/rules/testing.md`). CI verification = `lint` + `knip` + `build` + manual browser. Knip is the third static-analysis check added to the suite.
- YAML in this repo uses 2-space indentation — the "4 spaces" rule in `code-style.md` applies to TS/TSX only.
- Conventional commit scope for CI/workflow changes: `ci` (or `capabilities` if mixed with feature work).
