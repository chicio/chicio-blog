---
paths:
  - "src/components/features/**/*"
---

# Feature Conventions

`src/components/features/<feature>/` holds **cross-cutting UI not tied to a single route** (e.g. `pwa/`, `easter-eggs/`, `seo/`). Features are mounted from layouts, the app composition root, or wherever needed.

Features follow the same folder-per-component + store pattern as the rest of the codebase — full contract in `.claude/rules/component-architecture.md`.

## Dependency direction (enforced at error)

`design-system/**` must NOT import from `features/**`. The dependency points the other way: a feature is **injected into** a design-system component via props at the app/composition layer — never imported by it.

When a design-system component needs feature behavior, expose a prop (a render slot, a component, or a callback) and wire the feature in from above. Examples already in the codebase:
- Easter-egg components are passed into `command-palette` / `brand-header` as props, not imported by them.
- `ContentPage` (a feature wrapper) injects the dejavu easter-egg into the design-system page template.

## Homes

- Cross-cutting feature components → `src/components/features/<feature>/`
- Shared SEO / structured-data components (e.g. `JsonLd`) → `src/components/features/seo/`
- Pure logic (no JSX) used by a feature → `src/lib/<feature>/` (keep components thin)

## New Feature Checklist

1. Create `src/components/features/<name>/` (folder-per-component for each component)
2. Put pure logic (no JSX) under `src/lib/<name>/`
3. Mount from the appropriate layout or composition root; no route required
4. If a design-system component must use it, inject via props — never import `features/` from `design-system/`
