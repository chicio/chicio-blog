---
name: Easter Eggs System
description: Hidden Matrix-themed features (neo room, white rabbit, dejavu) plus the public /easter-egg-hunt page
type: project
---

Easter egg features live in `src/components/features/easter-eggs/` (NOT `sections/` — that path is stale):

- **Neo Room** (`neo-room-easter-egg/`): Matrix-themed terminal with a knock button and sound effects, triggered by the command palette (search "101").
- **White Rabbit**: triggered from the same command-palette flow.
- **Dejavu** (`dejavu/`): `DejavuEasterEgg` is the `headerWrapper` injected into every standard content page's `BrandHeader` (wired inside `ContentPage`/`ReadingContentPage`, not per-page).

`MatrixTerminal` (`design-system/molecules/effects/matrix-terminal`) is the shared typed-terminal-line animation atom reused both by Neo Room and by the public `/easter-egg-hunt` page's intro sequence.

## /easter-egg-hunt page (public hunt page, not a hidden easter egg itself)

`src/components/content/easter-eggs/easter-eggs/` — lists cryptic hints for the hidden eggs with a per-card reveal toggle. As of 2026-07-17 it was refactored (PR #470 follow-up) from a bespoke `PageTemplate` + `GenericHeader` composition to the **standard `ContentPage`** feature wrapper (same family as `/art`, `/videogames`, `/cookie-policy`). Pattern reference for any future "use the standard template" migration:

- `ContentPage` (`@/components/features/content/content-page`) requires `author` + `trackingCategory: string`; it wires nav/footer/palette tracking + `DejavuEasterEgg` headerWrapper internally — a page's own store must NOT also pass `navHrefs`/`footerNavHrefs`/`socialLinks`/`menuTracking` once it adopts `ContentPage`.
- The page's own title/intro moves into the top of the `ContentPage` children as `<PageTitle>` (design-system molecule, renders an `h1`) + a plain `<p>` intro — this is the established pattern in `art-header.tsx`, `blog-tags.tsx`, `videogames-collection.tsx`. `ContentPage`'s `ContentContainer` centers everything automatically; do not add a competing width/alignment wrapper around the body.
- `GenericHeader` (design-system organism) is still legitimately used elsewhere (`chat`, `clowns`) — do not delete it just because one page stops using it; check `grep -rl GenericHeader src/` first.
- For a toggle-style CTA that visually matches the terminal "> label" nav-CTA look (used e.g. as the blog post-card "Read more" button) but must NOT navigate: use `TerminalButton` (`design-system/molecules/buttons/terminal-button`) in action mode (`onClick` + optional `ariaExpanded`, no `to`) — see [[design-system_terminal_button]]. `TerminalLink` was deleted 2026-07-18 in favor of this polymorphic component; do not recreate it.
- Page title icons: `PageTitle` already accepts `PropsWithChildren` (ReactNode, not just a string) — an `<Icon className="inline-block mr-3 align-middle" />` before the title text renders inline and inherits the heading's `currentColor`, no component change needed. Used for the Easter Egg Hunt title's `SiCoderabbit` (react-icons/si) — confirmed present in the installed `react-icons@^5.6.0`.
- `MatrixTerminal` (design-system/molecules/effects/matrix-terminal) gained an optional `widthClassName` prop (2026-07-18, default `"w-[95%] sm:w-[600px]"`) so a caller can override the terminal's width (e.g. `widthClassName="w-full"` on `/easter-egg-hunt` to match the egg cards below it) without touching the 404/neo-room/dejavu callers that rely on the default.
- Test-file consequence: once a content component's own store no longer owns nav/footer/palette tracking, its RTL test can drop all the next/navigation, next/link, next/image, framer-motion, MotionDiv, matrix-rain-webgpu, command-palette-events, and motion-state `vi.mock`s that were only needed because `PageTemplate` rendered `Menu`/`Footer` directly — mock only `@/components/features/content/content-page` (`ContentPage: ({children}) => <div>{children}</div>`), matching the pattern already used in `blog-stats.test.tsx`/`blog-author.test.tsx`. Prefer `@/test-utils`'s `render`/`screen` re-export over importing RTL directly once the test no longer needs manual next.js mocks.
