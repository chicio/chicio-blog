---
name: Markdown Content Negotiation
description: Accept: text/markdown support for AI agent discoverability (level 3), serving the Markdown Representation
type: project
---

Originally shipped on the feat/capabilities-markdown-content-negotiation branch; the routing below is the current shape
(verified 2026-09-27).

**Why:** isitagentready.com level 3 (Agent-Readable) requires responding to `Accept: text/markdown` with a Markdown
Representation (see apps/website/GLOSSARY.md) and `Content-Type: text/markdown`. Part of the ongoing AI discoverability
initiative.

**Architecture:**
- `apps/website/src/proxy.ts` — Next.js 16 proxy (replaces the old `middleware.ts` convention). When `Accept` includes
  `text/markdown` it fires `trackMarkdownPageView` and rewrites to `/markdown<pathname>`. Generic: never needs
  updating for new pages. Its matcher excludes `_next`, `markdown`, `api`, `static` and dotted paths.
- `apps/website/src/app/markdown/[[...path]]/route.ts` — the single catch-all handler (`force-static`).
  `generateStaticParams` and `GET` both iterate `contentRegistry`, matching the path against each entry's slug template
  (`matchSlugTemplate` / `pathSegmentsFor` from `apps/website/src/lib/content/slug-template.ts`) and calling
  `entry.markdown(params)`; no match → `notFound()`.
- `apps/website/src/lib/content/registry.ts` — the Content Registry: one `ContentRegistryEntry` (`slug`, optional
  `params`, `markdown`, optional `content`, `searchable`) per Collection and Standalone Page. Standalone Pages come
  first so an exact literal slug wins over a Collection template of the same length.

**Key decisions:**
- Underscore-prefixed dirs (`_markdown`) are excluded from Next.js App Router routing — use plain names instead
- In Next.js 16 the file convention changed from `middleware.ts` → `proxy.ts`, exported function from `middleware()` → `proxy()`
- Post markdown wraps the MDX body (gray-matter strips frontmatter, `mdxToMarkdown` sanitizes it) with a header block
- Token count estimated at `Math.ceil(text.length / 4)` — rough but sufficient for the `x-markdown-tokens` header

**How to apply:** To give a new page a Markdown Representation, add an entry to `contentRegistry` in
`apps/website/src/lib/content/registry.ts` (a standard `content.mdx` Standalone Page is a single `mdxPage(slug)` call);
the route and proxy pick it up without changes.
