---
name: Design System & Matrix Theme
description: Atomic design hierarchy, Matrix color palette, glassmorphism/motion patterns, and key hooks
type: project
---

## Matrix Theme (globals.css)
- Primary: `#00FF41`, Secondary: `#00CC33`, Accent: `#39FF14`
- Background: `#001100`, Text: `#E8FFE8`
- Typography: Open Sans + Courier Prime
- Custom keyframes: glitch, pulse, bounce, opacity, blink

## Key CSS Classes
- `.glassmorphism` — backdrop-blur with accent border, hover scales 1.02
- `.glassmorphism-lite` — solid background variant for reduced motion
- `.glow-border`, `.glow-container` — accent borders with transitions
- `.pill` — button with gradient reflection and hover
- `.call-to-action` — prominent action buttons with scaling

## Design System Hooks (src/components/design-system/utils/hooks/)
- `useMotionStore` — global motion setting via `useSyncExternalStore`, syncs across tabs
- `useConsentStore` — cookie consent state via `useSyncExternalStore`; subscribes to `consentChangeEvent` from `src/lib/consents/consents.ts`; mirrors useMotionStore exactly
- `useGlassmorphism` — returns `.glassmorphism` or `.glassmorphism-lite` based on motion preference
- `useReducedMotions` — OS prefers-reduced-motion detection
- `useInView` / `useInViewList` — intersection observer
- `useReadingProgress` — scroll position tracking
- `useScrollDirection` — up/down scroll detection
- `useTypewriter` — typewriter text animation
- `useSearch` — search box functionality
- `useLockBodyScroll` — modal body scroll lock
- `useSnapScroll` — snap scroll behavior
- `useIsIOS` — iOS device detection
- `useDeviceCapabilities` — device feature detection

## Motion System
- localStorage key: `fabrizioduroni_motion` ("on"/"off")
- Custom event `motion-change` for cross-tab sync
- Default: enabled (null = on)
- SSR-safe: defaults to enabled to prevent hydration mismatches

## Matrix Rain (atoms/effects/matrix-rain.tsx)
- Canvas-based with memoization and intersection observer
- Configurable fontSize, frameRate (default 20), density
- Japanese katakana + symbols character set
- Color gradient based on drop height
- Respects prefers-reduced-motion
