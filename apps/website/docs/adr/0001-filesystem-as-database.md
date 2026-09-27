# Content lives in the repository as MDX, described once by the Content Registry

Every Post, Topic, Exercise, Console, Game and Standalone Page is an MDX file in `apps/website/src/content/`, with its
media beside it, and the directory layout is the route layout. There is no CMS and no database: content is versioned,
reviewed and deployed with the code that renders it, and every page is generated at build time.

The Content Registry (`apps/website/src/lib/content/registry.ts`) describes every Collection and Standalone Page once,
and whatever needs to enumerate the site is derived from it instead of restating the list: the Markdown Representation
route, site search, the sitemap and `llms.txt`.

## Consequences

- Adding content is adding a file; adding a new kind of page is adding one Content Registry entry.
- Anything that has to know "every page" reads the Content Registry; a hand-maintained list of routes is a bug.
