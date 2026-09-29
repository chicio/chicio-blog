#!/bin/sh
# Vercel ignoreCommand: exit 0 to skip the deploy, 1 to build. See docs/adr/0004-vercel-deploy-skipping.md.
# Every path here must err toward building: a wrongly skipped deploy is worse than a wasted one.

if [ -n "$VERCEL_GIT_PREVIOUS_SHA" ]; then
    base="$VERCEL_GIT_PREVIOUS_SHA"
else
    # No previous deployment: the first push of a branch, which may carry many commits (HEAD^1 sees only the last).
    # Compare with where the branch left main, not main's tip: the tip also carries main's own newer commits, and
    # turbo cannot relate a depth-1 FETCH_HEAD to Vercel's shallow clone at all (GitRefNotFound, so always build).
    # A fork point older than the clone has no merge-base here, which builds.
    # Vercel's clone has no `origin` remote, so main is fetched by URL (the repository is public).
    [ -n "$VERCEL_GIT_REPO_OWNER" ] && [ -n "$VERCEL_GIT_REPO_SLUG" ] || exit 1
    git fetch --quiet --depth=50 "https://github.com/$VERCEL_GIT_REPO_OWNER/$VERCEL_GIT_REPO_SLUG.git" main || exit 1
    base=$(git merge-base HEAD FETCH_HEAD) || exit 1
fi

# --head is deliberately not passed: see the ADR.
npx --yes turbo@^2 query affected --base="$base" --packages website --exit-code
