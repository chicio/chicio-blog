---
name: videogames-content-in-mdx
description: ADR-0002 applied to Games/Consoles (2026-09-29): no frontmatter gallery, own-copy carousel + GameInformation/ConsoleInformation slot in the MDX body; conversion gotchas
metadata:
  type: project
---

Game/Console pages bind `GameInformation`/`ConsoleInformation` slots via the MDX `components` prop (like Manga's
`MangaInformation`); `ConsoleTimeInformation` stays shared with the console card. Both slot names are in
`componentsRenderedByTheirGenerator`, and the Console/Game markdown generators now also emit Acquired/Architecture/PEGI
so the facts appear once.

**Why:** ADR-0002 (`apps/website/docs/adr/0002-facts-in-frontmatter-content-in-mdx.md`); console card cover = `frontmatter.image`.

**How to apply:** when converting content en masse, script it with per-file verification (gallery list == carousel list,
body identical after removing the inserted block). Gotchas seen: gallery items were bare/quoted mixed, always the last
frontmatter key; videogame media lives in `<dir>/media/...` on disk but URLs drop the `media` segment for consoles'
`gallery/` and keep it for games' `media/N.jpeg`. Pre-existing content bugs left alone: ape-escape lists a 3rd photo
that does not exist; super-mario-odyssey's gameplay carousel points at super-mario-bros-wonder images.
