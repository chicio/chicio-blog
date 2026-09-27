---
name: Routes and Sections Map
description: Route map and page-scoped component organization for the website (verified 2026-09-27)
type: project
---

Section, Collection and Standalone Page are glossary terms (apps/website/CONTEXT.md); the table's right column names
what a reader sees at each route.

## Routes (apps/website/src/app/)

| Route | What it is |
|-------|---------|
| `/` | Home |
| `/about-me`, `/cookie-policy`, `/mcp`, `/art` | Standalone Pages |
| `/blog/post/[year]/[month]/[day]/[slug]` | A Post |
| `/blog/posts/[page]` | Paginated Post list |
| `/blog/tags`, `/blog/tag/[tag]` | All Tags, Posts by Tag |
| `/blog/authors`, `/blog/author/[authorId]` | Authors, Posts by Author |
| `/blog/archive`, `/blog/stats` | Archive view, blog stats |
| `/chat` | The Chat |
| `/contact` | Contact form (Resend) |
| `/videogames`, `/videogames/console/[console]`, `.../game/[game]` | Videogames home, a Console, a Game |
| `/data-structures-and-algorithms/roadmap` | The Roadmap |
| `/data-structures-and-algorithms/topic/[topic]` | A Topic |
| `/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]` | An Exercise |
| `/data-structures-and-algorithms/exercises` | All Exercises |
| `/clowns/photos`, `/clowns/videos` | The Clowns Section |
| `/easter-egg-hunt` | The Hunt |
| `/offline` | PWA offline fallback |
| `/markdown/[[...path]]` | Markdown Representation (proxy rewrite target) |
| `/api/chat`, `/api/contact`, `/api/mcp` | Chat (Groq streaming), contact (Resend), MCP server |
| `/rss.xml`, `sitemap.ts`, `robots.txt`, `manifest.ts`, `llms.txt` | SEO / agent discovery |

## Page-scoped components (apps/website/src/components/content/<page>/)

One folder per route (folder-per-component, no `components/`/`hooks/` subdirs): `about-me`, `art`, `blog`, `chat`,
`clowns`, `contact`, `cookie-policy`, `data-structures-and-algorithms`, `easter-eggs` (the Hunt), `home`, `mcp`,
`videogames`. Cross-cutting UI (Easter Egg triggers/overlay, Terminal, command palette, consent, pwa, search, seo,
design-system-next Bindings) lives in `apps/website/src/components/features/`. The old `src/components/sections/`
tree no longer exists.

Legacy blog URLs (`/YYYY/MM/DD/slug`, with or without `.html`) redirect to `/blog/post/YYYY/MM/DD/slug` via
`apps/website/next.config.ts` redirects.
