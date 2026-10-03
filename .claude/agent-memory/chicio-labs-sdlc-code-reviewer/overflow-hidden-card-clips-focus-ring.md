---
name: overflow-hidden-card-clips-focus-ring
description: A card whose interactive child fills an overflow-hidden container (block h-full anchor, absolute inset-0 button) loses its focus ring to the clip; the design system has no focus-visible styling to compensate. Probe it with headless Playwright on a file:// page, no port needed
metadata:
  type: feedback
---

Rule: when a diff puts a focusable element that fills its parent (`block h-full w-full` link,
`absolute inset-0` overlay button) inside an `overflow-hidden rounded-*` card, assume the keyboard
focus ring is clipped. The browser draws the ring outside the element's border box, which is exactly
where the parent's clip starts. `.glow-container`'s `focus:border-accent` never fires, because the
container itself is not focusable, and `packages/matrix-design-system/src/styles/` has no
`outline`/`focus-visible` rule anywhere.

**Why:** measured on CoverCard (2026-09-28) in headless Chromium: the link variant showed no ring at
all (same as the old GameCard), and the lightbox overlay button showed a 1px sliver. The `figure > button`
it replaces on /art showed a full ring. No gate catches this.

**How to apply:** report it, non-blocking unless the plan names keyboard focus, and point to an inset
outline on the child or a `has-[:focus-visible]` border on the container. You can verify it without
binding a port, which a Unit Review forbids: write a minimal HTML page to the scratchpad reproducing
the geometry, then run a `.cjs` script that `require`s `<worktree>/node_modules/playwright`, calls
`chromium.launch()` (it talks over a pipe, not a port), presses Tab and compares `page.screenshot({ clip })`
before and after. Save PNGs and Read them. Some pixels always differ, so a changed screenshot does not
prove the ring is visible.

Related: [[globals-css-ul-li-bullet-base-rule]].
