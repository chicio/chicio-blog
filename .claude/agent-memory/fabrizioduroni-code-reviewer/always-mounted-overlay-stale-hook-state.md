---
name: always-mounted-overlay-stale-hook-state
description: Overlays that stay mounted and `return null` when closed keep all their hook state; per-open animations (useTypewriter, counters, step indices) silently run only the first time
metadata:
  type: feedback
---

When a component is mounted once (e.g. in `LayoutAdditionalContent`) and hides itself with
`if (!x) { return null; }` rather than being conditionally rendered by its parent, its store hook —
and every hook the store calls — keeps state for the whole page session. Any "plays once per open"
behaviour built on a hook with internal progress state runs correctly the FIRST time and is
instantly-complete on every subsequent open.

The canonical trap here is `useTypewriter` (`src/components/design-system/hooks/use-typewriter.tsx`):
it owns `lineIndex`/`charIndex` internally and exposes no reset. Once `lineIndex >= lines.length`,
`isComplete` stays true forever, so a boot/intro sequence never types again. Same shape applies to
`useInView` latches, step counters, and `hasFired` refs.

**Why:** found in the easter-egg overlay review — the shared `EasterEggOverlay` typed its four boot
lines only for the first egg of a page session; every later trigger (and every hunt-page `replay`)
rendered all lines at once. Unit tests all passed because each test re-rendered a fresh component,
and e2e triggered exactly one egg per page load. Neither layer can see it.

**How to apply:** whenever a diff adds an always-mounted overlay/modal/toast with a per-open
animation, ask "what resets the animation state on the second open?" Acceptable answers: the subtree
is keyed by the identity of the thing being shown (`key={slug}`), the store's state is derived and
reset when the identity changes, or the parent conditionally renders. If the answer is "nothing",
verify it live — open the thing twice in one page load — and demand a test that opens A, closes it,
then opens B on the same render. A store that resets *some* per-open state (`setSkipped(false)` on
identity change) but not the hook it delegates to is a strong smell.

Related: [[dynamic-ssr-false-event-drain-latch]] (the same always-mounted pattern, but the failure is
on the *first* open instead of later ones).
