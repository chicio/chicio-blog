---
name: Markdown Content Negotiation
description: Accept: text/markdown header support for AI agent discoverability (level 3)
type: project
---

Implemented on the feat/capabilities-markdown-content-negotiation branch.

**Why:** isitagentready.com level 3 (Agent-Readable) requires responding to Accept: text/markdown with markdown content and Content-Type: text/markdown. Part of the ongoing AI discoverability initiative.

**Architecture:**
- `src/proxy.ts` — Next.js 16 proxy (replaces old `middleware.ts` convention). Intercepts requests with `Accept: text/markdown` header and rewrites to `/markdown-content/*` internal routes.
- `src/app/markdown-content/route.ts` — Homepage markdown (static, top 10 recent posts)
- `src/app/markdown-content/blog/route.ts` — Blog listing with all posts and tags (static)
- `src/app/markdown-content/blog/post/[year]/[month]/[day]/[slug]/route.ts` — Individual blog posts (SSG, 92 paths), serves raw MDX `content` field directly

**Key decisions:**
- Underscore-prefixed dirs (`_markdown`) are excluded from Next.js App Router routing — use plain names instead
- In Next.js 16 the file convention changed from `middleware.ts` → `proxy.ts`, exported function from `middleware()` → `proxy()`
- Blog post markdown wraps the raw MDX content (gray-matter strips frontmatter) with a YAML-style header block
- Token count estimated at `content.length / 4` — rough but sufficient for the `x-markdown-tokens` header

**How to apply:** When adding new markdown-negotiated routes, add the path to the `MARKDOWN_ROUTES` map (or a new pattern matcher) in `src/proxy.ts`, then create the corresponding route handler under `src/app/markdown-content/`.
