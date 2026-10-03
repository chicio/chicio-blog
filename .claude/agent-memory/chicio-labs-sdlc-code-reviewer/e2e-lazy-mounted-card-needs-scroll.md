---
name: e2e-lazy-mounted-card-needs-scroll
description: CoverCard/GameCard mount their link/button only within 600px of the viewport (useInViewList); an e2e locator on a card below the fold never exists, and toBeVisible does not scroll. Replay it port-free against an existing .next via page.route
metadata:
  type: feedback
---

Rule: when a new e2e step targets something inside a lazily mounted card (the design system's `CoverCard`, which
mounts its `<a>`/`<button>` only once `useInViewList({ rootMargin: "600px" })` fires), check where the grid sits on
the page. At the default 1280x720 viewport anything whose container top is past ~1320px is simply absent from the
DOM, so `expect(locator).toBeVisible()` times out. `toBeVisible` and `waitFor` never scroll; only actions do, and
an action on a locator that matches nothing cannot scroll to it either.

**Why:** found on the Videogames console page (2026-09-29): the Games grid starts ~2700px down, below the
hardware table, Startup embed and trivia. The implementer added "clicking a game cover opens the game page" without
running e2e; replayed as written it timed out, and scrolling the SSR-present "Games" heading into view first made
the anchor mount. /art is fine only because its grid starts ~540px down.

**How to apply:** for any e2e locator on a card grid, measure the grid top, or demand the spec scroll an ancestor
that exists in the SSR markup (the section heading, the grid div) into view before asserting. To measure without
building or binding a port: `node -e` a script that `require`s `<worktree>/node_modules/playwright-core`, launches
chromium, and `page.route("**/*")`-fulfills a fake host (`http://site.test`) from an existing build:
`/_next/static/*` from `.next/static`, documents from `.next/server/app/<path>.html`, the rest from `public/`. The
main checkout's `apps/website/.next` is usable when the diff does not change the layout above the element. Heredocs
that write the script to the scratchpad are refused in worktree sessions; `node -e '<script>'` works.

Re-verifying the fix: a sibling Work Unit's worktree (`.claude/worktrees/<feature>/.claude/worktrees/*/apps/website/.next`)
often has a fresher feature-branch build than main's; compare `BUILD_ID` mtimes and use the newest one whose Work
Unit does not touch the page. Serve RSC requests (`rsc: 1` header) from `.next/server/app/<path>.rsc` so a card
click navigates client-side. `locator.scrollIntoViewIfNeeded()` centres the heading (scrollY ~ top - 360), so
roughly the first three 336px rows of a `sm:grid-cols-3` CoverCard grid mount; a target card further down still
needs its own scroll. Check `heading.count() === 1` too: `getByRole({ name })` is a case-insensitive substring match.

Related: [[overflow-hidden-card-clips-focus-ring]], [[prove-e2e-guard-non-vacuous-with-control-page]],
[[e2e-selector-must-be-feature-unique]].
