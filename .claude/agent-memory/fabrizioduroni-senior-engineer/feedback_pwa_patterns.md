---
name: PWA and State Management Patterns
description: Confirmed patterns from the PWA feature session — store hooks, consent gating, SW design
type: feedback
---

Use useSyncExternalStore pattern for any global state backed by localStorage + custom events.
The project has two confirmed instances: useMotionStore and useConsentStore.

**Why:** Fabrizio pointed out this pattern himself when the manual useState/useEffect/addEventListener
approach was used first. The store pattern is the established convention in this codebase.

**How to apply:** Whenever a piece of state lives in localStorage and needs to be reactive across
components without prop drilling: create a lib function that writes to localStorage and dispatches
a camelCase named CustomEvent, then create a `use[X]Store` hook in
`src/components/design-system/utils/hooks/` using `useSyncExternalStore`.

---

Gate install prompt (and any analytics-dependent UI) on cookie consent accepted, not just "decided".

**Why:** The install prompt fires GA tracking events. Showing it to users who rejected cookies is
semantically inconsistent — they'd be tracked for rejecting tracking.

**How to apply:** Use `useConsentStore()` directly. The `visible` condition should be
`isInstallable && cookieAccepted`, never just `isInstallable`.

---

New UI banners must match existing banner layout exactly, not invent their own glassmorphism.

**Why:** Fabrizio asked to align the install prompt with the cookie banner after the first
implementation used a custom Framer Motion slide-in with different sizing/positioning.

**How to apply:** Check `cookie-consent-banner.tsx` for the canonical fixed-bottom banner pattern.
Copy its className string verbatim: `fixed right-0 bottom-5 left-0 mx-auto my-0 p-4 flex
max-w-[95%] flex-col items-center gap-4 lg:max-w-[60%] lg:flex-row z-50` + `useGlassmorphism`.

---

New error/fallback pages must match the 404 page structure exactly.

**Why:** Fabrizio asked to align the offline page with the 404 page after the first implementation
used a custom terminal block layout.

**How to apply:** Use `MatrixRain` (not `MatrixBackground`), animate-glitch heading, `MatrixTerminal`
with typewriter, BluePillLink + RedPillButton row. Check `src/app/not-found.tsx` as the reference.
