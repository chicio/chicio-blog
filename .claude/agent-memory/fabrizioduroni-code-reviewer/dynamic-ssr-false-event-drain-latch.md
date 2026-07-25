---
name: dynamic-ssr-false-event-drain-latch
description: Features mounted via dynamic(ssr:false) in LayoutAdditionalContent cannot receive window events fired before their chunk mounts — any window-event trigger needs a pending-flag drain latch
metadata:
  type: project
---

Everything in `src/components/features/layout-additional-content/layout-additional-content.tsx` is mounted
with `dynamic(..., { ssr: false })` (command palette, terminal, kung-fu egg, spoon egg, lightbox, PWA
banner...). Those chunks mount some time AFTER hydration. A `window.dispatchEvent(...)` trigger fired before
the chunk mounts is lost silently — there is no listener yet.

**Why:** this produced a real swallowed-interaction bug in the spoon easter egg: the chat submit handler
consumed the user's message on a phrase match whether or not the egg was listening, so a cold-load
submission vanished with no visible effect.

**How to apply:** when reviewing a trigger that reaches one of these lazily-mounted features via a window
event, ask whether the producer can fire before the consumer mounts. If yes, the event alone is
insufficient — it needs a module-level pending latch (set by the producer, drained once per mount by the
consumer behind a `useRef` guard so an effect keyed on state cannot re-drain). Two invariants to check on
such a latch: the drain must be clear-on-read, and the event handler must clear the flag *unconditionally*
before the guarded activation, otherwise a trigger arriving while the feature is mid-animation leaves the
flag set and replays on a later mount. The unconditional-clear ordering is only safe because
`dispatchEvent` is synchronous — flag any change that defers the dispatch.

The latch is in-memory by design; it deliberately does not survive a reload (persisting it would replay a
surprise animation on an unrelated later page load).
