#!/bin/sh
# Vercel ignoreCommand: exit 0 to skip the deploy, 1 to build. See docs/adr/0004-vercel-deploy-skipping.md.
# Every path here must err toward building: a wrongly skipped deploy is worse than a wasted one.

if [ -n "$VERCEL_GIT_PREVIOUS_SHA" ]; then
    base="$VERCEL_GIT_PREVIOUS_SHA"
else
    # No previous deployment: the first push of a branch, which may carry many commits (HEAD^1 sees only the last).
    git fetch --quiet --depth=1 origin main || exit 1
    base=FETCH_HEAD
fi

# --head is deliberately not passed: see the ADR.
npx --yes turbo@^2 query affected --base="$base" --packages website --exit-code
