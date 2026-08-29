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
- Page-level layouts are NOT part of the design system: they arrange this site's chrome and live in
  `src/components/features/content/`
- **Hooks** (`src/components/design-system/hooks/`): Shared hooks used by 2+ components (motion, glassmorphism,
  in-view, etc.). A hook that depends on this site lives in its feature domain instead
  (e.g. `useSearch` in `src/components/features/search/`).

## Styling

The design system owns its stylesheet: `src/components/design-system/styles/`.

- `theme.css` — the `@theme` tokens and the overridden breakpoint scale (`md:` is 992px, not 768px).
  It also defines the `hide-scrollbar` utility, so this file is not safe to import as tokens only
- `base.css` — element-level styling components assume (headings, lists, tables, links); a component
  rendered without it looks unstyled
- `components.css` — the composed classes (`.glassmorphism*`, `.glow-*`, `.container-*`, `.call-to-action`)
- `pills.css` — the pill motif
- `index.css` — the entry a consumer imports after `@import "tailwindcss"`

The four files share no selectors, so their order relative to each other does not affect the cascade.
The ordering that IS load-bearing is one level up: `globals.css` must import `index.css` BEFORE its own
`@layer base`, so the site's article rules can override the element styling `base.css` sets.

Three rules are deliberately **outside** any `@layer` and therefore beat every Tailwind utility:
`:root { color-scheme: dark }` in base.css, and `.scroll-locked .menu-container` / `.remove-scroll-width`
in components.css (they read `--scrollbar-width`, which a utility cannot express). Trying to override
those with a utility class will silently lose.

The site's own `globals.css` imports that entry and adds only what is specific to this site: the
`#reading-content-container` article layout, katex and the chat bubble.

## Framework injection

The design system imports nothing from `next` — `design-system-no-next` fails CI on any such import.
Where a component needs framework behaviour it takes it as a prop, with a framework-free default:

- `linkComponent` (defaults to `AnchorLink`, a plain `<a>`) — see `atoms/links/anchor-link`
- `imageComponent` (defaults to `PlainImage`, a real `<img>` that reproduces `fill` and blur
  placeholders) — see `atoms/effects/plain-image`
- `currentPath` on `Menu`, instead of reading a router
- site assets, such as `BrandHeader`'s `logo`

The site's bindings live in `src/components/features/design-system-next/`, which is what website code imports.
`PrefetchStrategy` ("viewport" | "hover" | "never") belongs to the design system — deciding *when* to
prefetch is a design concern; the adapter decides *how*.

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
