---
name: Videogames Section
description: Console and game collection with rich metadata, filtering, and gallery support
type: project
---

The videogames section manages a personal game collection organized by console.

## Content Structure
- Consoles: `src/content/videogames/console/[console]/content.mdx`
- Games: `src/content/videogames/console/[console]/game/[game]/content.mdx`
- 13 consoles, ~159 total MDX files

## Metadata (src/types/content/videogames.ts)
- ConsoleMetadata: logo, releaseYear, acquiredYear, bits, generation, manufacturer, sku, gallery
- GameMetadata: releaseYear, console, developer, publisher, genre, pegiRating, region, formats (Physical/Digital), gallery
- GameFormat enum: Physical | Digital
- VideogamesNavigationOrigin: "all-games" | "console" (stored in sessionStorage)

## Components
- Section: `src/components/sections/videogames/`
- Hook: `use-games-filter` for filtering logic
- GameGrid, GameCard, ConsoleGrid components
