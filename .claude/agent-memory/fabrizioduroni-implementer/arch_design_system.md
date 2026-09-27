---
name: Design System & Matrix Theme
description: Atomic design hierarchy, Matrix Theme values, glassmorphism/motion patterns, and key hooks
type: project
---

The design system is the published package `packages/matrix-design-system` (vocabulary:
packages/matrix-design-system/CONTEXT.md). Paths below verified 2026-09-27.

## Matrix Theme (packages/matrix-design-system/src/styles/theme.css)
- Primary: `#00FF41`, Secondary: `#00CC33`, Primary-light: `#39FF14`
- Background: `#001100`, Text: `#E8FFE8`
- Typography: Open Sans + Courier Prime
- Custom keyframes: glitch, pulse, bounce, opacity, blink, ee-fade

## Key CSS Classes (styles/components.css, styles/pills.css)
- `.glassmorphism` — backdrop-blur with accent border, hover scales 1.02
- `.glassmorphism-lite` — solid background variant used when the Motion Preference is off
- `.glow-border`, `.glow-container` — accent borders with transitions
- `.pill` (+ `.pill-red`/`.pill-blue` variants) — the Pill motif, gradient reflection and hover
- `.call-to-action` — prominent action buttons with scaling

## Design System Hooks (packages/matrix-design-system/src/hooks/)
- `useMotionStore` — reads the Motion Preference, a Shared Store (`packages/matrix-design-system/src/state/motion/motion.ts`) via
  `useSyncExternalStore`, syncs across tabs
- `useGlassmorphism` — returns `.glassmorphism` or `.glassmorphism-lite` based on the Motion Preference
- `useReducedMotions` — true when the Motion Preference is off OR the device is low-end (`useDeviceCapabilities`);
  despite its name it does NOT read the OS prefers-reduced-motion setting (verified 2026-09-27)
- `useInView` / `useInViewList` — intersection observer
- `useReadingProgress` — scroll position tracking
- `useScrollDirection` — up/down scroll detection
- `useTypewriter` — typewriter text animation
- `useLockBodyScroll` — modal body scroll lock
- `useIsIOS` — iOS device detection
- `useDeviceCapabilities` — device feature detection
- Also: `useClipboardAvailable`, `useMatrixSettingsStore`, `useOsModifierKey`, `useWebgpuSupported`

Site-specific hooks moved out of the design system into the Website: `useConsentStore` lives in
`apps/website/src/components/features/consent/use-consent-store.ts` (subscribes to `consentChangeEvent` from
`apps/website/src/lib/consents/consents.ts`, mirrors useMotionStore), `useSearch` in
`apps/website/src/components/features/search/use-search.ts`. `useSnapScroll` no longer exists.

## Motion Preference (Shared Store)
- localStorage key: `fabrizioduroni_motion` ("on"/"off")
- Custom event `motion-change` for cross-tab sync
- Default: enabled (null = on)
- SSR-safe: defaults to enabled to prevent hydration mismatches

## Matrix Rain (atoms/effects/matrix-rain/matrix-rain/matrix-rain.tsx)
- Renders `MatrixRainWebGPU` from the `matrix-rain-webgpu` package (vocabulary: packages/matrix-rain-webgpu/CONTEXT.md)
  when WebGPU is supported, else the `Matrix2DCanvas` fallback (fontSize, density)
- Store: `use-matrix-rain-store.ts`; pause/activity via `use-matrix-rain-activity.ts`
