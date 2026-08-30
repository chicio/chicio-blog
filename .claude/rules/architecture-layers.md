# Architecture Layers

This document defines the dependency boundaries between the major layers of the codebase.
All rules described here are enforced at error level by dependency-cruiser (`npm run validate-architecture`).

## Layer Map

```
apps/website/src/app/          → composition root (pages, layouts, API routes)
apps/website/src/components/
  content/<page>/ → page-scoped UI components (one folder per route)
  features/<f>/   → cross-cutting UI not tied to a route (pwa, easter-eggs, seo, consent, layout)
    content/      → page-level layouts (page-template, content-page-template, …): they arrange
                    THIS site's chrome, so they are not part of the design system
    search/       → site search (useSearch); site-specific shared hooks live in their domain
    design-system-next/ → the site's Next bindings for the design system: injects next/link,
                    next/image, the router path and this site's logo. Everything the site
                    renders imports from here, not from design-system/ directly.
  design-system/  → pure, self-contained UI library (atoms → molecules → organisms).
                    Framework-agnostic: it imports nothing from next. Owns its own CSS in
                    styles/ (theme tokens, base element styling, composed classes, pills).
apps/website/src/lib/          → pure business logic (no JSX, no React components)
apps/website/src/types/        → TypeScript types and pure configuration constants
```

## Dependency Rules (all at error level)

### design-system is self-contained

`packages/matrix-design-system/src/**` may ONLY import from:
- npm packages
- other files within `design-system/**`
- `apps/website/src/types/**` — **type-only** (`import type { ... }`) exclusively

**Forbidden** at error level (enforced by `design-system-no-features`, `design-system-no-lib`,
`design-system-no-next`, and `design-system-types-type-only` rules):
- Any runtime import from `apps/website/src/lib/**`
- Any import from `apps/website/src/components/features/**`
- Any import from `apps/website/src/components/content/**`
- Any import from `apps/website/src/app/**`
- Any value (non-type-only) import from `apps/website/src/types/**` — including `slugs`, `siteMetadata`, and `tracking`
- Any import from `next` — link and image implementations are injected as props (`linkComponent`,
  `imageComponent`), the active route arrives as `currentPath`, and site assets like the logo are props

**Rationale**: the design-system is a reusable UI library. It must not know about application concerns (tracking, consent, chat, PWA, route slugs, or site metadata). Route hrefs, social contact links, and per-item tracking callbacks are injected as props from the feature/content layer above. The `design-system-types-type-only` rule enforces this: any `import { ... }` (not `import type`) from `apps/website/src/types/` inside design-system is a CI error.

### lib is a leaf

`apps/website/src/lib/**` may ONLY import from:
- npm packages
- other files within `lib/**`
- `apps/website/src/types/**`

**Forbidden** at error level (enforced by `lib-no-components` rule):
- Any import from `apps/website/src/components/**`
- Any import from `apps/website/src/app/**`

**Rationale**: `lib/` is the business-logic layer. It is consumed by components; it does not consume them. Keeping `lib/` free of component imports makes it independently testable and prevents circular dependency chains.

### features can depend on lib and design-system

`apps/website/src/components/features/**` may import from:
- `apps/website/src/lib/**`
- `packages/matrix-design-system/src/**` (through `index.ts` barrels)
- `apps/website/src/types/**`
- npm packages

Features must NOT import from `apps/website/src/components/content/**` (content pages are isolated).

### content pages are isolated from each other

`apps/website/src/components/content/<pageA>/**` must NOT import from `apps/website/src/components/content/<pageB>/**`.
Cross-page shared UI must be extracted to `apps/website/src/components/features/` or `packages/matrix-design-system/src/`.

## Atomic Design Layering (within design-system)

Enforced at error level:
- `atoms/` must not import from `molecules/` or `organism/`
- `molecules/` must not import from `organism/`
- All layers may import from `hooks/` (shared hooks)

## Adding a New Rule

Add rules to `apps/website/.dependency-cruiser.js` in the `forbidden` array with `severity: "error"`.
Run `npm run validate-architecture` after every structural change to catch regressions early.
The CI pipeline runs `validate-architecture` as a standalone job that gates the build.
