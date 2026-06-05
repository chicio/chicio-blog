---
paths:
  - "src/components/sections/**/*"
  - "src/app/**/*"
---

# Section & Route Conventions

## Section Isolation
Each feature lives in `src/components/sections/<section>/` with its own `components/` and `hooks/` subdirectories. No cross-section imports — sections depend only on the design system and `src/lib/`.

## New Section Checklist
1. Create `src/components/sections/<name>/` with `components/` and `hooks/` subdirs
2. Add section type to `src/types/slug.ts`
3. Register in `src/components/design-system/organism/menu.tsx` (uses `MenuItemWithTracking`)
4. Add tracking events in `src/types/tracking.ts`
5. Create route in `src/app/<name>/page.tsx`

## Tracking
All navigation and UI interactions tracked via Google Analytics (gated by cookie consent):
- Use `trackWith` helper from `src/lib/tracking/`
- Every new clickable UI element needs a tracking action
- Category/action/label structure defined in `src/types/tracking.ts`

## Route Pages
- Use async Server Components with `generateStaticParams()` for dynamic routes
- Include `generateMetadata()` for SEO
- Import syntax highlighting CSS (`highlight.js/styles/tokyo-night-dark.css`) and KaTeX CSS in pages that render MDX
