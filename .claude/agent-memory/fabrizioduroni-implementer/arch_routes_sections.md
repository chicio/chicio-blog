---
name: Routes and Sections Map
description: Complete route map and section component organization for the website
type: project
---

## Routes (src/app/)

| Route | Section |
|-------|---------|
| `/` | Home |
| `/about-me` | About |
| `/blog/post/[year]/[month]/[day]/[slug]` | Blog post detail |
| `/blog/posts/[page]` | Paginated blog list |
| `/blog/tags` | All tags |
| `/blog/tag/[tag]` | Posts by tag |
| `/blog/archive` | Archive view |
| `/chat` | AI chat |
| `/contact` | Contact form (Resend) |
| `/art` | Art portfolio |
| `/videogames/console/[console]` | Console library |
| `/videogames/console/[console]/game/[game]` | Game details |
| `/data-structures-and-algorithms/roadmap` | DSA learning path |
| `/data-structures-and-algorithms/topic/[topic]` | DSA topic |
| `/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]` | DSA exercise |
| `/data-structures-and-algorithms/exercises` | All exercises |
| `/clowns/photos`, `/clowns/videos` | Clowns section |
| `/api/chat` | Chat API (Groq streaming) |
| `/api/contact` | Contact form API (Resend) |
| `/rss.xml`, `/sitemap.ts`, `/robots.ts` | SEO |

## Section Components (src/components/sections/)

- **home/** — hero, about, featured content
- **blog/** — post display, listing, tags; has `use-chrome-summarize` hook (Chrome AI summarization)
- **chat/** — chat UI; has `useFabrizioChat` hook
- **videogames/** — game/console grids; has `use-games-filter` hook
- **data-structures-and-algorithms/** — exercise display, roadmap
- **about-me/** — about page components
- **easter-eggs/** — Neo room (terminal with "Knock, knock"), white rabbit, dejavu
- **clowns/** — clowns section

Legacy blog URLs (`/YYYY/MM/DD/slug`) redirect to `/blog/post/YYYY/MM/DD/slug` via next.config.ts redirects.
