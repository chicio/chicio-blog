# Facts live in the frontmatter, everything a reader looks at lives in the MDX body

A Collection item's frontmatter holds only the structured facts that code reads: what cards, filters, stats, site
search, the MCP tools and the Markdown Representation's header need (title, cover, years, authors, Volumes, formats…).
Everything a reader reads or looks at is written in the MDX body: prose, tables, and every image carousel, with its
images listed literally (`<ImageCarousel images={[…]} />`). The page component renders only what it derives from the
facts (title, badges, information pills) plus the chrome (breadcrumb, previous/next, structured data), and loads the
body.

This replaced a split where a Game page drew one carousel from `metadata.gallery` in code and a second, the gameplay
screenshots, from its MDX: the same kind of content lived in two places, and where a photo belonged depended on who had
added it.

## Considered Options

- **Everything in the MDX, the component only loads it**: the title, badges and pills would be repeated as the same
  block of tags in every entry, and the body would need to read its own frontmatter (a remark plugin or components
  bound by the page), which it cannot do today.
- **Everything in code**: gameplay screenshots and specs would become frontmatter lists, and the MDX would shrink to
  prose, turning content into schema every time a page wants something new.

## Consequences

- A carousel is added or reordered by editing the MDX; no frontmatter `gallery` exists.
- The Markdown Representation gets carousels from the body (`mdx-to-markdown` already converts a literal
  `ImageCarousel`), so generators must not also render them from metadata.
- An item with no photos yet shows a carousel holding only its cover, written by the skill that creates it.
- A block derived from facts that the MDX needs to position is a slot the page binds (e.g. `<MangaInformation />`): the
  MDX decides where it goes and its data still comes only from the frontmatter. Such slots are listed in
  `componentsRenderedByTheirGenerator`, since the generator already renders their facts.
