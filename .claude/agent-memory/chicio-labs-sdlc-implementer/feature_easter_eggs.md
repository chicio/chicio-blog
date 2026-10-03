---
name: Easter Eggs System
description: Six Easter Eggs sharing one video overlay, each fired by its own Trigger, plus the /easter-egg-hunt page (the Hunt)
type: project
---

Vocabulary (Easter Egg, Trigger, Found, Reveal, Hunt, Hint) is defined in apps/website/GLOSSARY.md; use it as is.

## Current architecture (verified 2026-09-27)

- Catalog: `apps/website/src/lib/easter-eggs/easter-egg-catalog.ts` — six eggs (`the-white-rabbit`, `the-choice`,
  `i-know-kung-fu`, `there-is-no-spoon`, `the-one`, `dodge-this`), each with `/media/video/<slug>.mp4` + poster + `.vtt`.
- Every Trigger funnels through `triggerEasterEgg(slug)` (`lib/easter-eggs/trigger-easter-egg.ts`): opens the shared
  overlay, `markEasterEggFound`, fires tracking. No-op while another egg is showing. Found state is persisted per
  browser by `lib/easter-eggs/easter-egg-found.ts` (localStorage `chicio-easter-egg-hunt`, event
  `easter-egg-found-change`). Only a Trigger makes an egg Found; a Reveal never does.
- One overlay for all eggs: `apps/website/src/components/features/easter-eggs/easter-egg-overlay/` (with a
  `boot-terminal/`), state in `lib/easter-eggs/easter-egg-overlay-state.ts`.
- Triggers: Konami keys and the spoon-activation drain in `features/easter-eggs/easter-egg-triggers/` (renders
  nothing); kung fu also via the genre pill of a fighting game (`features/easter-eggs/fighting-game-trigger/`, replaced
  the old invisible corner tap hotspot); spoon via the Chat input (`trySpoonPhrase` in `lib/easter-eggs/spoon-activation.ts`);
  the-choice via a header click sequence (`features/easter-eggs/the-choice/`); the-white-rabbit via the "101" palette
  query (`use-layout-additional-content-store.ts`); the-one via `whoami` in the Terminal; dodge-this via rain speed at
  max in the Matrix Rain control panel.
- `EasterEggOverlay` and `EasterEggTriggers` mount in `LayoutAdditionalContent` via `dynamic(..., { ssr: false })`
  (hence the pending-activation drain latch; see [[arch_easter_eggs_konami_spoon]]).
- Gone: the Neo Room egg (and its knock sound), `DejavuEasterEgg` headerWrapper, per-egg components
  `kung-fu-easter-egg/` / `spoon-easter-egg/`, and `GenericHeader`. `MatrixTerminal`
  (`packages/matrix-design-system/src/molecules/effects/matrix-terminal/`) survives, used by `not-found.tsx` and
  `offline/page.tsx`.

## /easter-egg-hunt page (the Hunt)

`apps/website/src/components/content/easter-eggs/` — `easter-eggs/` (page), `egg-card/`, `egg-solution/` (Reveal/Hide
toggle + Replay), `egg-hunt-progress/`. As of 2026-07-17 it was refactored (PR #470 follow-up) from a bespoke `PageTemplate` + `GenericHeader` composition to the **standard `ContentPage`** (a Content Page; same family as `/art`, `/videogames`, `/cookie-policy`). Pattern reference for any future "use the standard Template" migration:

- `ContentPage` (`@/components/features/content/content-page`) requires `author` + `trackingCategory: string`; it wires nav/footer/palette tracking internally — a page's own store must NOT also pass `navHrefs`/`footerNavHrefs`/`socialLinks`/`menuTracking` once it adopts `ContentPage`.
- The page's own title/intro moves into the top of the `ContentPage` children as `<PageTitle>` (design-system molecule, renders an `h1`) + a plain `<p>` intro — this is the established pattern in `art-header.tsx`, `blog-tags.tsx`, `videogames-collection.tsx`. `ContentPage`'s `ContentContainer` centers everything automatically; do not add a competing width/alignment container around the body.
- For a toggle-style CTA that visually matches the Terminal Chrome "> label" nav-CTA look (used e.g. as the post-card "Read more" button) but must NOT navigate: use `TerminalButton` (through its Binding `@/components/features/design-system-next/terminal-button`) in action mode (`onClick` + optional `ariaExpanded`, no `to`) — see [[design-system_terminal_button]]. `TerminalLink` was deleted 2026-07-18 in favor of this polymorphic component; do not recreate it.
- Page title icons: `PageTitle` accepts `PropsWithChildren` (ReactNode, not just a string) — an `<Icon className="inline-block mr-3 align-middle" />` before the title text renders inline and inherits the heading's `currentColor`. This pattern was tried for the Hunt title (`SiCoderabbit`, react-icons/si) but **removed 2026-07-18** as a visual-polish tweak — a plain-text H1 was preferred. `SiCoderabbit` is still kept in the command-palette entry (`easter-egg-hunt-item.tsx`). Don't re-add a title icon here without checking first.
- Test-file consequence: once a content component's own store no longer owns nav/footer/palette tracking, its RTL test can drop all the next/navigation, next/link, next/image, framer-motion, MotionDiv, matrix-rain-webgpu, command-palette-events, and motion-state `vi.mock`s that were only needed because `PageTemplate` rendered `Menu`/`Footer` directly — mock only `@/components/features/content/content-page` (`ContentPage: ({children}) => <div>{children}</div>`), matching the pattern already used in `blog-stats.test.tsx`/`blog-author.test.tsx`. Prefer `@/test-utils`'s `render`/`screen` re-export over importing RTL directly once the test no longer needs manual next.js mocks.
- The Hunt's copy is now a Standalone Page: `apps/website/src/content/easter-egg-hunt/content.mdx`, ingested as
  `easterEggHunt = createSection({ slug: slugs.easterEggHunt })` (`apps/website/src/lib/content/easter-eggs/easter-eggs.ts`)
  and registered in the Content Registry as a searchable `mdxPage`. Its frontmatter feeds `generateMetadata`
  (`apps/website/src/app/easter-egg-hunt/page.tsx`), search and the Markdown Representation. History: this replaced an
  `easterEggHuntPageDescription` constant in `easter-eggs-content.ts`, which no longer exists. After editing it,
  re-run the prebuild step (`npm run dev`/`npm run build` run it automatically) to regenerate `apps/website/public/search-index.json`.
- 2026-07-18 visual polish on `EggCard`: solution steps switched from `<ol className="list-decimal">` to `<ul className="list-disc">`; the cryptic Hint moved off the shared `QuoteText` atom (green/`text-accent`, shared with `MatrixTerminal` quote lines — do not restyle it) to a local `<p className="... text-primary-text ...">` so the Hint reads white/neutral against the green Terminal Chrome.
- `TerminalButton` color bug (white instead of Matrix green, fixed 2026-07-18 with `text-accent` on both label spans): check this first if a future TerminalButton consumer looks off-color.
