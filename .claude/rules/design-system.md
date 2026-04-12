---
paths:
  - "src/components/design-system/**/*"
  - "src/app/css/**/*"
---

# Design System Rules

## Atomic Design Hierarchy
- **Atoms** (`src/components/design-system/atoms/`): Basic UI elements (buttons, typography, icons, effects, links, loader)
- **Molecules** (`src/components/design-system/molecules/`): Composed from atoms (button variants, form components, menu items, breadcrumbs, accordion, animation, effects)
- **Organisms** (`src/components/design-system/organism/`): Complex composed sections
- **Templates** (`src/components/design-system/templates/`): Page-level layouts

Always compose from existing lower-level components before creating new ones. New atoms should be justified — check if an existing atom can be extended first.

## Matrix Theme
- Primary: `#00FF41`, Secondary: `#00CC33`, Accent: `#39FF14`
- Background: `#001100`, Text: `#E8FFE8`
- Typography: Open Sans + Courier Prime
- Never introduce colors or visual elements that break the green-on-black Matrix aesthetic

## Key CSS Classes
- `.glassmorphism` — backdrop-blur with accent border, hover scales 1.02 (for motion-enabled)
- `.glassmorphism-lite` — solid background variant (for reduced motion)
- `.glow-border`, `.glow-container` — accent borders with transitions
- `.pill` — button with gradient reflection and hover
- `.call-to-action` — prominent action button with scaling

## Hooks
- `useGlassmorphism` — returns `.glassmorphism` or `.glassmorphism-lite` based on motion preference
- `useMotionStore` — global motion setting via `useSyncExternalStore`, syncs across tabs
- `useReducedMotions` — OS prefers-reduced-motion detection
- Always respect user's motion preference. Use `useGlassmorphism` for glass effects, never hardcode the class.
