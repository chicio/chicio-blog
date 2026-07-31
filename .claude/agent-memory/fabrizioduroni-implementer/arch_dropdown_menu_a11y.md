---
name: arch_dropdown_menu_a11y
description: DropdownMenu is a grouped nested-list disclosure (not an ARIA menu); globals.css re-adds bulleted ul/li styling AFTER Tailwind preflight, so ul/li conversions need explicit resets
type: project
---

`src/components/design-system/molecules/menu/dropdown-menu/` (PR shipped 2026-07-31, `feat/menu-sections-a11y`,
one review round CHANGES_REQUIRED before merge) was reworked from a flat/mixed `DropdownMenuEntry[]`
(item-or-group union) to a groups-only `DropdownMenuGroup[]` prop. Key decisions, useful if extending
Menu/DropdownMenu again:

- **Semantics**: this is a navigation disclosure panel, not an ARIA `menu` widget (no roving
  arrow-key focus is implemented, so `role="menu"` + `aria-haspopup="menu"` were both actively
  wrong and removed). The trigger button just gets `aria-expanded` + `aria-controls` (controls
  only set while open, so it never dangles pointing at an unmounted id). The panel is a plain
  `<ul aria-label={label}>`, each group is `<li><span id=...>label</span><ul aria-labelledby=...>`.
  RTL/Playwright locator is `getByRole("list", { name: <DropdownMenu label> })`, group lists are
  `getByRole("list", { name: <group label> })`.
- **Escape handling**: lives in `use-dropdown-menu-store.ts` as `handleKeyDown`, attached via
  `onKeyDown` on the same wrapping div that already has `onBlur`. Guarded with `if (!open) return;`
  so Escape while already closed is a true no-op (doesn't re-focus an already-focused trigger, and
  won't swallow an Escape meant for some ancestor handler). Closes the panel and refocuses
  `buttonRef.current`.
- **`useId` must live in the store**, not the component (one-hook-per-component rule). Also put the
  *derived* ids there for readability: store exposes `state.panelId` (`${id}-panel`) directly and an
  `effects.getGroupId(index)` curried-by-index function (`${id}-group-${index}`) — component just
  calls `getGroupId(idx)` in the render loop, not a raw template literal computed inline.
- **CRITICAL — Tailwind v4 preflight is NOT the last word on list styling in this repo.**
  `src/app/css/globals.css` has an `@layer base` block (~line 294) that runs AFTER preflight and
  unconditionally re-adds, on every bare `ul`/`ul li` in the app:
  `ul { list-style: none; ...; padding: 0; margin: 1rem; }`, `ul li { position: relative; padding-left: 1rem; margin-bottom: 0.5rem; }`,
  `ul li::before { content: "▸"; position: absolute; left: 0; color: var(--color-primary); font-weight: bold; }`.
  Because Tailwind's utilities layer is generated after `@layer base`, explicit utility classes DO
  win the cascade — but only if you add them. Converting any non-list markup (divs) to `<ul>/<li>`
  in this codebase requires explicit `list-none p-0 m-0` on every `ul` and `pl-0 mb-0 before:content-none`
  on every `li`, at EVERY nesting level, or you get a green matrix "▸" bullet, extra left padding, and
  extra vertical margin on every item — a real, measurable visual regression that no automated gate
  catches (RTL/Playwright only assert roles/text, not computed CSS). Verified by rendering a
  production build and diffing computed styles; confirmed against the precedent already in the repo:
  `form-error-summary.tsx` uses `<li className="before:content-none">`, and
  `globals.css` has a `ul.recharts-default-legend li.recharts-legend-item::before { content: unset !important; }`
  escape for the same reason. **Do not trust `node_modules/tailwindcss/preflight.css` in isolation for
  this repo** — always grep `src/app/css/globals.css` for a later unscoped `ul`/`ol`/`li` rule before
  assuming a bare list element is unstyled.
- **`list-style: none` also strips the `list`/`listitem` ARIA roles in WebKit** (Safari/VoiceOver),
  even though Chromium computes them anyway (which is why RTL/jsdom and Playwright/Chromium stay
  green regardless). Since this component's entire point is to expose grouping semantics, every
  `<ul>` that gets `list-none` (the panel and each group's nested list) also needs an explicit
  `role="list"` to keep the accessible tree correct across browsers.
- **Menu content grouping** (Blog: Posts/Discovery/Insights, Explore: DSA/AI/Computer
  Graphics/Secrets, The Author: Profile/Hobbies) lives entirely in `menu.tsx`'s JSX literals; no
  change to `MenuNavHrefs`, `use-menu-store.ts` (all `onClick*` callbacks), or app-layer tracking
  wiring was needed — regrouping is pure prop-literal restructuring.
- **A dropdown panel getting visually taller (more groups, or un-reset list margins) can break e2e**
  independent of any code bug: Explore went from 3 to 4 groups (added Secrets/Easter eggs, moved out
  of Blog); before the list-style reset above, its un-reset margins made the open panel ~100px taller
  than necessary and pushed the "Easter eggs" link far enough down the viewport to sit under the
  fixed cookie-consent banner (`role="dialog"`, `aria-label="Cookie consent banner"`, `fixed bottom-5`),
  intercepting the click. The fix was NOT to dismiss the banner in the test (that only masks a real
  layout defect) — it was to fix the underlying list-margin bug in commit above; after that fix the
  e2e spec passes with zero cookie-banner handling, verified across 4 repeated runs. If you ever see
  a "banner intercepts pointer events" e2e failure again in this menu, suspect panel height/margin
  regression before reaching for a test-side dismiss-the-banner workaround.
