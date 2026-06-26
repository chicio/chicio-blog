---
name: arch-design-system-purity
description: Design-system is now FULLY pure — type-only @/types, no config-const exception; slugs/siteMetadata/tracking injected as props; design-system-types-type-only rule at error
metadata:
  type: project
---

## Status: COMPLETE (2026-06-26, PR #392, branch feat/design-system-purity)

### The Invariant
Every import in `src/components/design-system/**` from `@/types/**` must be **type-only** (`import type { ... }`).
Zero runtime/value imports from `@/types` (and still zero `@/lib`) anywhere in design-system.
Enforced by: `design-system-types-type-only` rule in `.dependency-cruiser.js` (severity: error, `dependencyTypesNot: ["type-only"]`).

### What Was Removed from Design-System
- `slugs` from `menu.tsx`, `use-menu-store.ts`, `footer.tsx`, `social-contacts.tsx`, `use-command-palette-store.ts`
- `siteMetadata` from `social-contacts.tsx`
- `tracking` from `use-menu-store.ts`, `use-footer-store.ts`
- All `import { ComponentStore/EffectsStore/StateStore }` → `import type { ... }` across all design-system stores
- `import { SearchResult/EasterEggTerminalLines }` → `import type` in use-search.ts, command-palette.tsx, use-command-palette-store.ts

### Prop Inversion Architecture
Nav hrefs and social links come from **`src/components/features/content/nav-config.ts`** (imports slugs + siteMetadata).

**Menu** now receives:
- `navHrefs: MenuNavHrefs` (blog, dsaRoadmap, dsaExercises, chat, mcp, aboutMe, art, videogames, contact)
- `tracking?: MenuTrackingCallbacks` (per-item `onTrack*: () => void` callbacks)
- `chatSlug: string` passed internally from `navHrefs.chat` to `useMenuStore`

**Footer** now receives:
- `navHrefs: FooterNavHrefs`
- `socialLinks: SocialContactLinks` (re-exported from social-contacts index)
- `navTracking?: FooterNavTrackingCallbacks`
- `socialTracking?: FooterSocialTrackingCallbacks`

**SocialContacts** now receives: `links: SocialContactLinks`, `contactHref: string`

**CommandPalette** now receives: `chatSlug: string`

### Wiring Points
- `PageTemplate` (design-system/templates) threads all new props to Menu + Footer
- `ContentPageTemplate` + `ReadingContentPageTemplate` thread to PageTemplate
- `ContentPage` (features/) wires nav-config + tracking from `useContentPageStore`
- `ReadingContentPage` (features/) wires nav-config + tracking from `useReadingContentPageStore`
- `Homepage` (content/home) passes `menuNavHrefs` directly to `<Menu>`
- `Chat` (content/chat) passes `menuNavHrefs` directly to `<Menu>`
- `ClownsPageTemplate` (content/clowns) passes all three to `<PageTemplate>`
- `LayoutAdditionalContent` (features) passes `slugs.chat` to `<CommandPalette>`

### Feature Store Pattern for Tracking
`useContentPageStore` and `useReadingContentPageStore` now:
1. Create generic `onTrackNavigation(action: string)` and `onTrackSocial(action: string)` via `useCallback`
2. Build per-item curried callbacks with `useCallback(() => onTrackNavigation(tracking.action.open_home), [...])`
3. Assemble into `menuTracking: MenuTrackingCallbacks`, `footerNavTracking`, `footerSocialTracking` plain const objects
4. Return `{ effects: { onPaletteTrigger, menuTracking, footerNavTracking, footerSocialTracking } }`
   Note: MUST use plain const objects (not `useMemo(() => ({ ... }))`) to avoid `chicio/store-return-shape` ESLint false positive

### Dependency-Cruiser Rule

The rule lives in a **separate config file**: `.dependency-cruiser-purity.js` (not in the main `.dependency-cruiser.js`).

**Why separate?** The rule needs `tsConfig: { fileName: "tsconfig.json" }` to resolve `@/` aliases so `dependencyTypes` correctly includes `"type-only"` for `import type` statements. Adding tsConfig globally to the main config surfaces ~146 pre-existing `seal-private-nested-folders` violations (from other ongoing migrations). The separate file scopes tsConfig to only the design-system purity check.

```js
// .dependency-cruiser-purity.js
{
  name: "design-system-types-type-only",
  severity: "error",
  from: { path: "^src/components/design-system/" },
  to: { path: "^src/types/", dependencyTypesNot: ["type-only"] }
}
// options: tsPreCompilationDeps: true, tsConfig: { fileName: "tsconfig.json" }
```

**npm script**: `validate-design-system-purity` → `depcruise src/components/design-system --config .dependency-cruiser-purity.js`  
**CI**: runs as second step inside the `validate-architecture` job  
**Pre-push**: `.husky/pre-push` runs both `validate-architecture` AND `validate-design-system-purity`

`dependencyTypesNot: ["type-only"]` = flag the dependency if it is NOT type-only.
So `import type { X }` → passes; `import { X }` → error.

### Verification Commands
```bash
# 1. Grep check (fast)
grep -rn 'from "@/types' src/components/design-system | grep -v 'import type'
# Must return empty

# 2. Rule check (authoritative)
npm run validate-design-system-purity
# Must return 0 violations
```
