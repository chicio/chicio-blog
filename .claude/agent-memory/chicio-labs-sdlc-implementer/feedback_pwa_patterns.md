---
name: PWA and State Management Patterns
description: Confirmed patterns from the PWA feature session — store hooks, consent gating, SW design
type: feedback
---

Use the useSyncExternalStore pattern for any Shared Store (see packages/matrix-design-system/GLOSSARY.md) backed by
localStorage + custom events. Confirmed instances: useMotionStore, useMatrixSettingsStore (design system) and
useConsentStore (Website).

**Why:** Fabrizio pointed out this pattern himself when the manual useState/useEffect/addEventListener
approach was used first. The store pattern is the established convention in this codebase.

**How to apply:** Whenever a piece of state lives in localStorage and needs to be reactive across
components without prop drilling: create a lib function that writes to localStorage and dispatches
a camelCase named CustomEvent, then create a `use[X]Store` hook using `useSyncExternalStore`. Put it in
`packages/matrix-design-system/src/hooks/` (state in `src/state/`) only if the design system itself owns the value
(Motion Preference, rain settings); application state such as consent goes in the Website's feature folder
(`apps/website/src/components/features/consent/use-consent-store.ts`).

---

Gate install prompt (and any analytics-dependent UI) on cookie consent accepted, not just "decided".

**Why:** The install prompt fires GA tracking events. Showing it to users who rejected cookies is
semantically inconsistent — they'd be tracked for rejecting tracking.

**How to apply:** Read the consent Shared Store through the component's own store hook (one hook per component). The `visible` condition should be
`isInstallable && cookieAccepted`, never just `isInstallable`.

---

New UI banners must match existing banner layout exactly, not invent their own glassmorphism.

**Why:** Fabrizio asked to align the install prompt with the cookie banner after the first
implementation used a custom Framer Motion slide-in with different sizing/positioning.

**How to apply:** Check `packages/matrix-design-system/src/organism/cookie-consent-banner/cookie-consent-banner.tsx` for the canonical fixed-bottom banner pattern.
Copy its className string verbatim: `fixed right-0 bottom-5 left-0 mx-auto my-0 p-4 flex
max-w-[95%] flex-col items-center gap-4 lg:max-w-[60%] lg:flex-row z-50` + `useGlassmorphism`.

---

New error/fallback pages must match the 404 page structure exactly.

**Why:** Fabrizio asked to align the offline page with the 404 page after the first implementation
used a custom terminal block layout.

**How to apply:** Use `MatrixRain` (not `MatrixBackground`), animate-glitch heading, `MatrixTerminal`
with typewriter, BluePillLink + RedPillButton row. Check `apps/website/src/app/not-found.tsx` as the reference.
