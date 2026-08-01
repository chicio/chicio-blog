---
name: intersection-observer-stub-hides-scroll-spy
description: A no-op IntersectionObserver/matchMedia stub in an RTL test makes scroll-spy and in-view logic look covered while never running — demand the use-in-view.test.tsx capture-the-callback pattern
metadata:
  type: feedback
---

When a new component's test stubs `IntersectionObserver` (or `ResizeObserver`, `matchMedia`) with a class whose
`observe`/`disconnect` are bare `vi.fn()`, treat every behavior downstream of the callback as **untested** —
active-section highlighting, in-view reveal, lazy loading, sticky state. Coverage numbers will not show the
gap, because the effect body still executes.

**Why:** the reading-companion TOC organism shipped a green RTL suite where the observer was a no-op stub AND
the test rendered no elements with the heading ids, so `document.getElementById(...)` returned null for every
heading, the effect hit its `elements.length === 0` early return, and the observer was never even constructed.
Scroll-spy highlighting plus "force the active h2 group open" — a binding plan requirement and the most
intricate logic in the store — had zero coverage.

**How to apply:** the repo already has the correct pattern at
`src/components/design-system/hooks/use-in-view.test.tsx` — a `FakeIntersectionObserver` whose constructor
pushes the callback into a module-level `capturedCallbacks` array, then `act(() => callback([{ target, isIntersecting: true }]))`.
Require that pattern (plus rendering stub elements carrying the ids the store looks up) for any new
observer-driven component. Cite `use-in-view.test.tsx` in the finding so the implementer has no excuse to
re-stub a no-op.
