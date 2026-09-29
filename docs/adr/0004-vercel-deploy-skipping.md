# Vercel skips deploys through `turbo query affected`

Vercel's `ignoreCommand` (in `apps/website/vercel.json`) asks `turbo query affected` whether a commit can change the
website, and skips the deploy when it cannot. It replaced Vercel's default ignore step, `git diff HEAD^ HEAD --quiet`,
which has no path scope and so answers "changed" for every commit: one Dependabot batch produced 20 deployments in ten
minutes that way.

The decision is made by turbo's dependency graph, not by paths: a `matrix-design-system` change counts as a website
change, while a `matrix-rain-showcase` or `.github` change does not (those reach GitHub Pages through `pages.yml`).
Turbo prunes the root lockfile per package, so a bump that only moves a `matrix-rain-showcase` dependency does not mark
the website affected even though `package-lock.json` changed. That is what makes this work for Dependabot, and it was
measured: `101c5f67` (rain-showcase dependency and lockfile) skips, `5a8ccff6` (design-system dependency and lockfile)
builds. `--exit-code` maps onto Vercel's contract directly: 0 when nothing is affected (skip), 1 when something is
(build). Nothing is lost by skipping: the next website commit builds the full tree, and `scheduled-rebuild.yml`
redeploys every Monday regardless.

## Considered Options

- **Vercel's default ignore step**: no path scope, so it never skips.
- **`npx turbo-ignore website --fallback=HEAD^1`**: the predecessor. Identical verdicts on both test commits, but it is
  deprecated in favour of `turbo query affected`, prints a deprecation warning into every build log, and costs a second
  registry fetch because it shells out to `npx -y turbo@... --dry=json`. Worse, on an unreachable base it silently falls
  back to its `--fallback` ref and can wrongly skip, where `turbo query affected` exits 1 and builds. That matters
  because every skip leaves `VERCEL_GIT_PREVIOUS_SHA` further back, drifting out of Vercel's clone depth precisely as
  skipping succeeds. It still ships with every turbo release, so it remains a working fallback.

## Consequences

- `--base` is `VERCEL_GIT_PREVIOUS_SHA` when set, else the tip of `main`. The variable holds the last successful
  deployment's SHA and is only exposed when an ignore step is configured, but it is empty on any branch with no previous
  deployment (every Dependabot PR, and the first push of any feature branch); an empty `--base` makes `turbo query
  affected` exit 2. The fallback was first `HEAD^1`, on the assumption that such branches are always one commit off
  `main`. That holds for Dependabot but not for a feature branch pushed with many commits: a last commit touching only
  `.claude/` looked unaffected against `HEAD^1`, and the preview of a 40-commit branch was skipped. The logic now lives in
  `apps/website/scripts/vercel-ignore-build.sh`, which runs `git fetch --depth=1 origin main` and uses
  `--base=FETCH_HEAD`, so the whole branch is compared with `main`. A failed fetch exits 1 (build). A branch that is
  behind `main` can build when its own changes did not need it, never the reverse.
- `--head` is never passed: `--base=<sha>^ --head=<sha>` reports the website affected for a rain-showcase-only commit,
  where `--base=<sha>^` alone correctly reports it unaffected.
- `turbo` is pinned to a major (`turbo@^2`): the ignore step runs before `npm install`, so `npx` fetches turbo from the
  registry, and an unpinned turbo 3 could change the change-detection semantics mid-deploy.
- Vercel's "Skip deployments when there are no changes" toggle must stay off, or two mechanisms with different semantics
  decide the same thing.
