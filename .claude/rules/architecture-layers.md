# Architecture Layers

This document defines the dependency boundaries between the major layers of the codebase. Each boundary is marked
**enforced** (dependency-cruiser fails `npm run validate-architecture`, and CI, at error level) or **convention**
(nothing checks it: hold it by hand, and grep before claiming it holds).

There are two dependency-cruiser configs, one per workspace that holds components:
`packages/matrix-design-system/.dependency-cruiser.cjs` and `apps/website/.dependency-cruiser.js`. Both exclude tests;
the design system's also excludes stories, which compose across layers on purpose.

## Layer Map

```
packages/matrix-design-system/src/  → the published design system: atoms → molecules → organism, plus hooks/,
                                      state/ (Shared Stores) and styles/. Framework-agnostic.
apps/website/src/app/               → composition root (pages, layouts, API routes)
apps/website/src/components/
  content/<page>/     → page-scoped UI components (one folder per route)
  features/<f>/       → cross-cutting UI not tied to a route (pwa, easter-eggs, seo, consent, terminal, …)
    content/          → the Templates and Content Pages that arrange this site's chrome
    design-system-next/ → the site's Bindings: design-system components bound to next/link, next/image, the
                        router path and this site's assets
apps/website/src/lib/               → pure business logic (no JSX, no React components)
apps/website/src/types/             → TypeScript types and pure configuration constants
```

## The design system is self-contained

- **Enforced (`no-next`)**: the design system imports nothing from `next`. What only the host can know (link and image
  implementations, the current path, its assets, tracking callbacks) arrives as props; see
  [ADR-0001](../../packages/matrix-design-system/docs/adr/0001-framework-agnostic-with-bindings.md).
- **Structural, no rule needed**: it cannot import the website at all. It is a separate package with no path into
  `apps/website`, so there is no `@/` alias to reach for; types it needs are its own.
- **Enforced (`root-barrel-no-optional-peers`)**: nothing reachable from the root barrel (`src/index.ts`) may need an
  optional peer dependency (recharts, cmdk, the unified/remark/rehype stack), type-only imports included. Those live
  behind the `matrix-design-system/chart`, `/markdown` and `/command-palette` entry points.

## Atomic layering, inside the design system

- **Enforced (`layering-atoms`)**: `atoms/` must not import from `molecules/` or `organism/`.
- **Enforced (`layering-molecules`)**: `molecules/` must not import from `organism/`.
- Every layer may import from `hooks/` and `state/`.

## lib is a leaf

- **Enforced (`lib-no-components`)**: `apps/website/src/lib/**` must not import from `apps/website/src/components/**`
  or `apps/website/src/app/**`. It may import npm packages, other `lib/` files and `apps/website/src/types/**`.

`lib/` is consumed by components, never the reverse, which keeps it testable in the node Vitest project and free of
circular chains.

## Content pages are isolated from each other

- **Enforced (`content-page-isolation`)**: `apps/website/src/components/content/<pageA>/**` must not import from
  `apps/website/src/components/content/<pageB>/**`. Cross-page UI goes to `features/` or to the design system.
- **Convention**: `features/**` must not import from `content/**`. It holds today (no such import exists), but no rule
  checks it.

## How the website uses the design system

- **Convention**: when a Binding exists in `features/design-system-next/` (brand-header, breadcrumb, footer, menu,
  internal-link, next-link, tag, terminal-button, …), site code imports the Binding, never the raw component. Every other
  component is imported straight from `matrix-design-system` (or one of its entry points); most site files do exactly
  that, and it is correct. Holds today; not checked.
- A new Binding is needed only when a component takes a framework injection (`linkComponent`, `imageComponent`,
  `currentPath`) or a site asset.

## Rules shared by both workspaces

- **Enforced (`import-only-via-index`)**: a component's internal `.tsx` may only be imported through its folder's
  `index.ts` barrel. In the design system `src/hooks/` and `src/test-utils/` are exempt; in the website the rule
  covers `src/components/**`.
- **Enforced (`no-circular`)**: circular dependencies are forbidden.

The component-store rules (one store hook per component, store return shapes, folder composition) are enforced by
ESLint through `packages/eslint-plugin-chicio`, not by dependency-cruiser; see `.claude/rules/component-architecture.md`.

## Adding a New Rule

Add it to the `forbidden` array of the config for the workspace it constrains, with `severity: "error"`, and mark it
**enforced** here. Run `npm run validate-architecture` after every structural change; CI runs it as its own job.
