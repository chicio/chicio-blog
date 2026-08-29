---
name: globals-css-ul-li-bullet-base-rule
description: Any new <ul>/<li> in a component inherits globals.css @layer base rules (m-4, li pl-4 mb-2, and a green ▸ ::before bullet) — Tailwind preflight does NOT save you; demand explicit resets
metadata:
  type: feedback
---

`src/components/design-system/styles/base.css` `@layer base` contains **unscoped** rules that override Tailwind v4 preflight:

```css
ul     { @apply list-none text-primary-text text-base leading-normal p-0 m-4; }
ul li  { @apply relative pl-4 mb-2; }
ul li::before { @apply content-['▸'] absolute left-0 text-primary font-bold; }
```

So **every** `<ul>`/`<li>` anywhere in the app gets 1rem margin on the list, 1rem left padding +
0.5rem bottom margin per item, and a **visible matrix-green ▸ triangle** before every `<li>`.
There is no global escape hatch — the codebase opts out case by case
(`form-error-summary.tsx` uses `<li className="before:content-none">`; globals.css has a
`ul.recharts-default-legend li.recharts-legend-item::before { content: unset !important }` block).
`<ol>`/`<ol> <li>` are NOT affected (the selectors are `ul` / `ul li`).

**Why:** an implementer converted a `<div>`-based dropdown panel to semantic `<ul>/<li>` and argued
"Tailwind v4 preflight already strips list-style/margin/padding". That is true of preflight but
false for this repo, because the base layer re-adds them afterwards. Result: green bullets next to
every nav item, +64px of indentation, +100px of panel height, and a nav link pushed under the fixed
cookie-consent banner where it became unclickable. **No mechanical gate catches this** — lint,
typecheck, vitest/jsdom (no CSS) and Playwright role queries were all green.

**How to apply:** whenever a diff introduces `<ul>`/`<li>` markup (or `list-none` reasoning appears
in a rationale), do not accept the preflight argument. Verify in a real browser: build, `next start`
on a non-3000 port, and read `getComputedStyle(li, "::before").content` + the element's margin and
padding, or take a screenshot. Require explicit resets (`m-0 p-0` on the lists,
`before:content-none pl-0 mb-0` on the items) and confirm pixel parity against `origin/main`.
Related: [[e2e-selector-must-be-feature-unique]].

Second-order effect: `list-style: none` on a `<ul>` makes **WebKit/VoiceOver drop the `list` /
`listitem` roles**. If the semantics of the list are the point of the change (or if e2e/unit
locators use `getByRole("list", { name })`), require an explicit `role="list"` on each `<ul>`.
Chromium computes the role anyway, so Playwright will never catch the Safari gap.
