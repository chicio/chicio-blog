# Architecture Layers

This document defines the dependency boundaries between the major layers of the codebase.
All rules described here are enforced at error level by dependency-cruiser (`npm run validate-architecture`).

## Layer Map

```
src/app/          → composition root (pages, layouts, API routes)
src/components/
  content/<page>/ → page-scoped UI components (one folder per route)
  features/<f>/   → cross-cutting UI not tied to a route (pwa, easter-eggs, seo, consent, layout)
  design-system/  → pure, self-contained UI library (atoms → molecules → organisms → templates)
src/lib/          → pure business logic (no JSX, no React components)
src/types/        → TypeScript types and pure configuration constants
```

## Dependency Rules (all at error level)

### design-system is self-contained

`src/components/design-system/**` may ONLY import from:
- npm packages
- other files within `design-system/**`
- `src/types/**` — **type-only** (`import type { ... }`) exclusively

**Forbidden** at error level (enforced by `design-system-no-features`, `design-system-no-lib`, and `design-system-types-type-only` rules):
- Any runtime import from `src/lib/**`
- Any import from `src/components/features/**`
- Any import from `src/components/content/**`
- Any import from `src/app/**`
- Any value (non-type-only) import from `src/types/**` — including `slugs`, `siteMetadata`, and `tracking`

**Rationale**: the design-system is a reusable UI library. It must not know about application concerns (tracking, consent, chat, PWA, route slugs, or site metadata). Route hrefs, social contact links, and per-item tracking callbacks are injected as props from the feature/content layer above. The `design-system-types-type-only` rule enforces this: any `import { ... }` (not `import type`) from `src/types/` inside design-system is a CI error.

### lib is a leaf

`src/lib/**` may ONLY import from:
- npm packages
- other files within `lib/**`
- `src/types/**`

**Forbidden** at error level (enforced by `lib-no-components` rule):
- Any import from `src/components/**`
- Any import from `src/app/**`

**Rationale**: `lib/` is the business-logic layer. It is consumed by components; it does not consume them. Keeping `lib/` free of component imports makes it independently testable and prevents circular dependency chains.

### features can depend on lib and design-system

`src/components/features/**` may import from:
- `src/lib/**`
- `src/components/design-system/**` (through `index.ts` barrels)
- `src/types/**`
- npm packages

Features must NOT import from `src/components/content/**` (content pages are isolated).

### content pages are isolated from each other

`src/components/content/<pageA>/**` must NOT import from `src/components/content/<pageB>/**`.
Cross-page shared UI must be extracted to `src/components/features/` or `src/components/design-system/`.

## Atomic Design Layering (within design-system)

Enforced at error level:
- `atoms/` must not import from `molecules/`, `organism/`, or `templates/`
- `molecules/` must not import from `organism/` or `templates/`
- `organism/` must not import from `templates/`
- All layers may import from `hooks/` (shared hooks)

## Adding a New Rule

Add rules to `.dependency-cruiser.js` in the `forbidden` array with `severity: "error"`.
Run `npm run validate-architecture` after every structural change to catch regressions early.
The CI pipeline runs `validate-architecture` as a standalone job that gates the build.
