---
paths:
  - "src/components/content/**/*"
  - "src/app/**/page.tsx"
---

# Page-Content Conventions

`src/components/content/<page>/` holds the components that compose a route — one folder per menu entry / route, mirroring `src/content/<page>/` where MDX exists (e.g. `src/components/content/blog/` ↔ `src/content/blog/`).

Content pages may depend on the design system, `src/components/features/`, and `src/lib/` — but there are **no cross-page imports between `content/` folders** (enforced at error by dependency-cruiser). Cross-cutting UI belongs in `features/` — see `.claude/rules/features.md`.

Components follow the folder-per-component + store pattern; the full contract is in `.claude/rules/component-architecture.md`. There are no separate `components/`/`hooks/` subdirectories inside a page folder — private children (used by exactly 1 parent) nest directly inside the parent component's folder.

## New Page Checklist

1. Create `src/components/content/<name>/` (folder-per-component for each component)
2. Add page type to `src/types/slug.ts`
3. Register in `src/components/design-system/organism/menu/menu.tsx` (uses `MenuItemWithTracking`)
4. Add tracking events in `src/types/tracking.ts`
5. Create route in `src/app/<name>/page.tsx`
6. If the page renders MDX, create the matching `src/content/<name>/` folder

## Tracking

All navigation and UI interactions tracked via Google Analytics (gated by cookie consent):
- Use `trackWith` helper from `src/lib/tracking/`
- Every new clickable UI element needs a tracking action
- Category/action/label structure defined in `src/types/tracking.ts`

## Route Pages

- Use async Server Components with `generateStaticParams()` for dynamic routes
- Include `generateMetadata()` for SEO
- Import syntax highlighting CSS (`highlight.js/styles/tokyo-night-dark.css`) and KaTeX CSS in pages that render MDX
