---
name: arch-design-system-purity
description: Design-system is now FULLY pure — type-only @/types, no config-const exception; slugs/siteMetadata/tracking injected as props; design-system-types-type-only rule at error
metadata:
  type: project
---

## Status: COMPLETE (2026-06-26, PR #392, branch feat/design-system-purity) — then SUPERSEDED by the package extraction

**Current state (verified 2026-09-27):** the design system is now its own package, `packages/matrix-design-system/src/`,
with no `@/` alias at all, so it cannot import the Website's `types`/`lib` in the first place. Purity is structural;
the package's own `packages/matrix-design-system/.dependency-cruiser.cjs` enforces `no-next`,
`root-barrel-no-optional-peers`, `layering-atoms`, `layering-molecules`, `import-only-via-index`, `no-circular`. The
`design-system-types-type-only` rule below no longer exists. What survives from this work is the prop-inversion
architecture: everything the design system cannot know is injected by the Website (via its Bindings in
`apps/website/src/components/features/design-system-next/`, and the Templates in `apps/website/src/components/features/content/`).
The sections below are the history of how the inversion was done; paths in them are pre-extraction.

### The Invariant (historical)
Every import in `src/components/design-system/**` from `@/types/**` had to be **type-only** (`import type { ... }`).
Enforced then by a `design-system-types-type-only` rule (severity: error, `dependencyTypesNot: ["type-only"]`).

### What Was Removed from Design-System
- `slugs` from `menu.tsx`, `use-menu-store.ts`, `footer.tsx`, `social-contacts.tsx`, `use-command-palette-store.ts`
- `siteMetadata` from `social-contacts.tsx`
- `tracking` from `use-menu-store.ts`, `use-footer-store.ts`
- All `import { ComponentStore/EffectsStore/StateStore }` → `import type { ... }` across all design-system stores
- `import { SearchResult/EasterEggTerminalLines }` → `import type` in use-search.ts, command-palette.tsx, use-command-palette-store.ts

### Prop Inversion Architecture
Nav hrefs and social links come from **`apps/website/src/components/features/content/nav-config.ts`** (imports slugs + siteMetadata).

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
- `PageTemplate` (now `apps/website/src/components/features/content/page-template/`, a Template) threads all new props to Menu + Footer
- `ContentPageTemplate` + `ReadingContentPageTemplate` thread to PageTemplate
- `ContentPage` (a Content Page, features/content/) wires nav-config + tracking from `useContentPageStore`
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

### Dependency-Cruiser Rule (historical, pre-extraction)

The rule lives in the SINGLE main config `.dependency-cruiser.js` (the earlier separate `.dependency-cruiser-purity.js` + `validate-design-system-purity` command were CONSOLIDATED away — do NOT recreate them).

The main config now has `tsConfig: { fileName: "tsconfig.json" }` in `options`, so `@/` aliases resolve and `dependencyTypes` correctly classifies `type-only`. (The old `seal-private-nested-folders` rules — which false-positived under alias resolution by conflating public deep folders with private nesting — were DROPPED; `import-only-via-index` is the folder boundary guard and excludes the flat `design-system/hooks/` home.)

```js
// in .dependency-cruiser.js forbidden[]
{
  name: "design-system-types-type-only",
  severity: "error",
  from: { path: "^src/components/design-system/" },
  to: { path: "^src/types/", dependencyTypesNot: ["type-only"] }
}
// options: tsPreCompilationDeps: true, tsConfig: { fileName: "tsconfig.json" }
```

`dependencyTypesNot: ["type-only"]` = flag the dependency if it is NOT type-only.
So `import type { X }` → passes; `import { X }` → error.

**npm script**: `validate-architecture` runs per workspace (`apps/website`: `depcruise src --config .dependency-cruiser.js`;
`packages/matrix-design-system`: `depcruise src --config .dependency-cruiser.cjs`)
**CI**: the `validate-architecture` job
**Pre-push**: `.husky/pre-push` runs `validate-architecture`

### Verification Commands
```bash
# Rule check (authoritative), from the repository root — runs every workspace's rules
npm run validate-architecture
# Must return 0 violations
```
