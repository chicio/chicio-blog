---
name: Content System Architecture
description: Filesystem-as-database content loading with dynamic slug patterns, ingested via createSection()
type: project
---

All content is MDX (`content.mdx` files) organized in a directory hierarchy that maps directly to URL routes.

Content loading engine in `src/lib/content/content.ts` uses dynamic slug pattern matching to discover content and
extract route parameters from directory paths. Since 2026-07-24 (see [[arch_content_section_factory]]), every
section is ingested via `createSection<TMeta>({ slug, sort? })` from `src/lib/content/section.ts`, which returns
`{ list(), single(params?) }`. The old per-section metadata-adapter functions (`consoleMetadataAdapter`,
`gamesMetadataAdapter`, `exerciseMetadataAdapter`) and their matching accessor functions (`getPosts`, `getAllConsoles`,
etc.) are deleted — metadata typing now comes purely from the generic type argument to `createSection`, and
`grayMatterContent` passes raw frontmatter metadata straight through when no adapter is given.

Content types and their metadata:
- **Blog posts**: No custom metadata beyond standard frontmatter (title, description, date, image, tags, authors)
- **DSA exercises**: `technique`, `leetcodeUrl`
- **Videogame consoles**: `logo`, `releaseYear`, `acquiredYear`, `bits`, `generation`, `manufacturer`, `manufacturerLogo`, `sku`, `gallery`
- **Videogame games**: `releaseYear`, `acquiredYear`, `console`, `developer`, `publisher`, `genre`, `pegiRating`, `region`, `formats`, `gallery`

Search index uses elasticlunr with SHA256 content hashing (`.search-index-cache`) to rebuild only when content changes.

Chat RAG knowledge base chunks blog content to 800 chars (splitting by paragraphs, then sentences) and stores in Upstash Vector with metadata (postId, postTitle, postDate, postUrl, etc.).
