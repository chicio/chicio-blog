---
name: Videogames Section
description: Console and Game Collections with rich metadata, view switching, and gallery support
type: project
---

The Videogames Section holds two Collections: Consoles and Games (each Game belongs to exactly one Console).

## Content Structure
- Consoles: `apps/website/src/content/videogames/console/[console]/content.mdx`
- Games: `apps/website/src/content/videogames/console/[console]/game/[game]/content.mdx`
- 11 Consoles (verified 2026-09-27)

## Metadata (apps/website/src/types/content/videogames.ts)
- ConsoleMetadata: logo, releaseYear, acquiredYear, bits, generation, manufacturer, sku, gallery
- GameMetadata: releaseYear, console, developer, publisher, genre, pegiRating, region, formats (Physical/Digital), gallery
- GameFormat enum: Physical | Digital (the Game's Format)
- VideogamesNavigationOrigin: "all-games" | "console" (stored in sessionStorage)

## Components (apps/website/src/components/content/videogames/, verified 2026-09-27)
- `videogames-collection`, `videogames-catalog`, `videogames-view-switcher` (with `console-card`), `games-grid`
  (with `game-card`), `console`, `game`, `videogames-stats`, `videogame-navigation`
- Stores at folder root: `use-videogames-view-store.ts`, `use-videogames-navigation-origin-store.ts`
- The old `use-games-filter` hook and `src/components/sections/videogames/` tree no longer exist
- Console pages can have a Startup (see [[feature_console_startup_section]])
