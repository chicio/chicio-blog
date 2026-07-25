---
name: e2e-selector-must-be-feature-unique
description: Reject e2e assertions that key off a shared Tailwind utility class; demand a selector unique to the feature under test (clip-path id, data-testid)
metadata:
  type: feedback
---

When reviewing a Playwright spec, check that the locator proving "the feature rendered" cannot match
anything else on the page. Shared Tailwind utility classes are the recurring offender — `.bg-black-alpha-75`
is used by the `overlay` atom, the mobile `menu` overlay and the videogames `game-card`, so
`page.locator(".bg-black-alpha-75")` can pass while the feature never rendered.

**Why:** a selector that matches a shared utility makes the assertion vacuous — it turns a real regression
into a green run, which is worse than a flaky red. Found on the spoon easter-egg chat trigger, where the
warp overlay shares `bg-black-alpha-75` with two unrelated components on the same route.

**How to apply:** for any new/changed e2e assertion, grep the selector across `src/` and confirm it resolves
to exactly one component. Prefer something structurally owned by the feature: an SVG `clipPath` id
(`[style*="matrix-spoon-clip"]`), a `data-testid`, or an accessible role+name. Then ask the inverse
question: would this locator fail if the feature did not render? If the element only exists inside the
feature's conditional branch, yes.

Related: [[e2e-launch-timeout-flake]], [[e2e-search-listbox-flake]]
