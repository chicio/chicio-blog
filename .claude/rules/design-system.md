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
- **Hooks** (`src/components/design-system/hooks/`): Shared hooks used by 2+ components (motion, glassmorphism, search, in-view, etc.)

Always compose from existing lower-level components before creating new ones. New atoms should be justified — check if an existing atom can be extended first.

Layering is enforced by dependency-cruiser at error: no upward imports between tiers; design-system components may not import from `features/`.

## Folder-Per-Component Model

Every design-system component follows the folder-per-component + store pattern (own kebab-case folder matching the `.tsx` name, a `use-<name>-store.ts` hook, an `index.ts` barrel, one hook per component file). The full contract lives in `.claude/rules/component-architecture.md` — it is not restated here.

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

- `useGlassmorphism` — returns `.glassmorphism` or `.glassmorphism-lite` based on motion preference. Permanently exempt from the one-hook-per-component rule.
- `useMotionStore` — global motion setting via `useSyncExternalStore`, syncs across tabs
- `useReducedMotions` — OS prefers-reduced-motion detection
- Always respect user's motion preference. Use `useGlassmorphism` for glass effects, never hardcode the class.
