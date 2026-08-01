---
name: in-flow-layout-mutation-breaks-smooth-scroll
description: Scroll-spy state committed during an in-flight smooth scroll can abort it — judge the fix on the merits, never on the stated mechanism; and the committed e2e (1280px) cannot see the xl rail at all
metadata:
  type: feedback
---

When scroll position drives React state that re-renders a widget during an in-flight smooth scroll,
suspect a scroll abort — but **name the symptom, not the mechanism**, unless you have instrumented it.

**Why:** on the reading-companion TOC I diagnosed this as in-flow layout shift (a scroll-spy `forceOpen`
animating a collapsible's height above `#reading-content-container`). The sentinel disproved it: the
stall reproduced on the `position: fixed` gutter rail, where in-flow layout shift is impossible. The
implementer then blamed React re-render main-thread work, which is also not a real abort mechanism. Two
rounds went to mechanism narratives. What actually fixed it, verifiably, was **removing the
competition**: drop `preventDefault()` + `window.history.pushState` (Next patches `pushState`, reads a
manual call as a soft navigation, and replays stale scroll restoration), use a plain `<a href="#id">`
with `scroll-behavior: smooth` in CSS, and **debounce the scroll-spy state commit so nothing commits
while the browser is still crossing headings**.

**How to apply:** review the fix on the merits, not the stated cause. The deciding question is "can any
code path perform a scroll or mutate the scrolled document between click and arrival?" — a debounce or
latch that answers "no" is sound even when the committed comment misattributes why. Then **measure it**:
a throwaway Playwright spec (own config, `testDir` in the scratchpad, `reuseExistingServer: true`)
asserting the `window.scrollY` delta and the target heading's `getBoundingClientRect().top` over 5
repeats settles it in one run. A correct long jump here is deterministic: delta 5892px, heading top
exactly 80px (`scroll-mt-20`), zero variance.

**The committed e2e runs at 1280px, so it never covers the rail.** `xl` is 1600px in this codebase, the
rail is `hidden` below it, and the inline `<details>` is `xl:hidden` above it — the two surfaces are
never simultaneously visible. Any scroll/position/layout claim about the rail needs an explicit
`viewport: { width: 1800 }` probe; the repo's own spec is blind to it. (Same probe cheaply answers
target-size and gutter-overlap questions: measure `getBoundingClientRect()` instead of arguing.)

Corollary — **a determinism workaround that switches the app's motion toggle off is a red flag**. Watch
for `page.addInitScript(() => localStorage.setItem("fabrizioduroni_motion", "off"))` in a position- or
layout-asserting Playwright test: it makes the scroll instant and single-frame, so the test goes green
while the only path real users take stays untested. Treat "pre-existing, so out of scope" claims with
suspicion: check `git show main:<file>` / `git log -S<symbol> main..HEAD` — here "pre-existing" has meant
"introduced earlier in this same branch".

The repo has **no** `prefers-reduced-motion` handling anywhere (`grep -rn "prefers-reduced-motion" src/`
returns nothing); `useReducedMotions` = app localStorage toggle (`useMotionStore`) OR low-end device. Do
not demand the media query in a feature-scoped diff. A feature needing animated in-page scrolling
therefore toggles a class on `<html>` from an effect — when you see that, check **who else scrolls the
document on those pages**: `use-lock-body-scroll.ts` restores position with `window.scrollTo(0, scrollY)`
on iOS, which a global `scroll-behavior: smooth` silently turns into a visible animation. Next.js itself
is immune (its `handleSmoothScroll` forces `scrollBehavior: auto` around router scrolls).

Related: [[e2e-reuse-existing-server-stale-app]], [[intersection-observer-stub-hides-scroll-spy]].
