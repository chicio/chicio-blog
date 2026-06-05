---
paths:
  - "src/components/content/**/*"
  - "src/components/features/**/*"
  - "src/app/**/*"
---

# Page-Content & Feature Conventions

## Two component buckets

- `src/components/content/<page>/` — components that compose a route. One folder per menu entry / route. Names mirror `src/content/<page>/` where MDX exists, so the component-side ↔ MDX-side mapping is visible at a glance (e.g. `src/components/content/blog/` ↔ `src/content/blog/`).
- `src/components/features/<feature>/` — cross-cutting UI not tied to a specific route (e.g. `pwa/`, `easter-eggs/`). Mounted from layouts, the design-system header, or wherever needed.

Each folder has its own `components/` and `hooks/` subdirectories. No cross-page imports between `content/` folders — depend only on the design system, `src/components/features/`, and `src/lib/`.

## New Page Checklist
1. Create `src/components/content/<name>/` with `components/` and `hooks/` subdirs
2. Add page type to `src/types/slug.ts`
3. Register in `src/components/design-system/organism/menu.tsx` (uses `MenuItemWithTracking`)
4. Add tracking events in `src/types/tracking.ts`
5. Create route in `src/app/<name>/page.tsx`
6. If the page renders MDX, create the matching `src/content/<name>/` folder

## New Feature Checklist (cross-cutting UI)
1. Create `src/components/features/<name>/` with `components/` and `hooks/` subdirs
2. Pure logic (no JSX) goes under `src/lib/<name>/` — keep components thin
3. Mount from the appropriate layout or design-system entry point; no route required

## Tracking
All navigation and UI interactions tracked via Google Analytics (gated by cookie consent):
- Use `trackWith` helper from `src/lib/tracking/`
- Every new clickable UI element needs a tracking action
- Category/action/label structure defined in `src/types/tracking.ts`

## Route Pages
- Use async Server Components with `generateStaticParams()` for dynamic routes
- Include `generateMetadata()` for SEO
- Import syntax highlighting CSS (`highlight.js/styles/tokyo-night-dark.css`) and KaTeX CSS in pages that render MDX
