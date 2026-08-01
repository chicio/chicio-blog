---
name: feedback_global_smooth_scroll_class_side_effects
description: A feature that toggles scroll-behavior smooth on <html> affects every OTHER window.scrollTo caller on the page, not just its own scroll — audit them
type: feedback
---

When a feature toggles `scroll-behavior: smooth` on `<html>` (even scoped to a CSS class rather than a
permanent site-wide rule), it silently changes the behavior of every OTHER piece of code on the page that
calls `window.scrollTo` while that class is active — not just the feature's own scrolls.

**Why this bit us**: the reading-companion TOC organism (`use-table-of-contents-store.ts`) toggles a
`reading-companion-smooth-scroll` class on `document.documentElement` while mounted, so its own anchor
clicks animate via native CSS scroll-behavior. `use-lock-body-scroll.ts` (a shared hook used by menus,
modals, the command palette) restores iOS scroll position on unlock via
`window.scrollTo(0, scrollY)`, unconditionally. If a menu/modal closes mid-article while the TOC's smooth
class happens to be active, that restoration animates visibly downward instead of jumping instantly —
Next.js's own router scroll restoration hits the identical footgun and works around it by forcing
`element.style.scrollBehavior = "auto"` around its own `scrollTo` calls, then restoring whatever was
there.

**How to apply**: any time a diff adds `element.style.scrollBehavior` or a CSS class that sets
`scroll-behavior: smooth` on `<html>`/`<body>`, grep for every other `window.scrollTo`/`scrollIntoView`
call in the codebase (`use-lock-body-scroll.ts` is the recurring one — it's shared by menu, modal, and
command-palette overlays) and check whether it can run while the new class might be active. The fix is
always the same shape: force `scrollBehavior: "auto"` immediately before the call, then restore the
original inline value immediately after — never assume the global class is the only place scroll
happens.

Related: `feature_reading_companion_toc.md`, reviewer memory
`in-flow-layout-mutation-breaks-smooth-scroll.md`.
