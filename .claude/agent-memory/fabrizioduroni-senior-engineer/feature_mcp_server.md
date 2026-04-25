---
name: MCP Portfolio Server
description: Public MCP server at /api/mcp exposing portfolio content via 8 tools, filesystem-backed, Vercel-compatible
type: project
---

## Architecture
- Route: `src/app/api/mcp/route.ts` — exports GET, POST, DELETE, OPTIONS
- Server factory: `src/lib/mcp/server.ts` — `createMcpServer()` wires all tools
- Tools: `src/lib/mcp/tools/register-*.ts` — one file per tool
- Transport: `WebStandardStreamableHTTPServerTransport` from `@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js`
- Mode: **stateless** (`sessionIdGenerator: undefined`) — required for Vercel serverless
- New dep: `@modelcontextprotocol/sdk@^1.29.0`

## Tools
| Tool | Backend |
|------|---------|
| `search_content(query, limit?)` | elasticlunr `public/search-index.json` — filesystem |
| `list_posts(tag?, limit?)` | `getPosts()` / `getPostsForTag()` |
| `get_post(year, month, day, slug)` | `getPostBy()` — params are zero-padded strings |
| `get_tags()` | `getTags()` |
| `get_dsa_topics()` | `getAllDataStructuresAndAlgorithmsTopics()` |
| `get_dsa_exercises(topic?, difficulty?)` | `getAllExercises()` — difficulty is "Easy"|"Medium"|"Hard" |
| `get_about_me()` | `getAboutMe()` |
| `get_site_stats()` | `getPosts()` + `getAllExercises()` + `getAllDataStructuresAndAlgorithmsTopics()` |

## Key decisions
- 100% filesystem-based — Upstash Vector NOT used (only about-me is in Upstash Vector, not full blog)
- `search_content` uses elasticlunr index loaded from `public/search-index.json` server-side; uses `index.documentStore.getDoc(ref)` to enrich results without re-loading MDX
- CORS headers (`*`) on all responses for browser-based MCP clients
- Per-request new server+transport instances (stateless pattern)
- Blog post dir structure: `src/content/blog/post/YYYY/MM/DD/slug/` — month/day are zero-padded

## Connection (Claude Desktop)
```json
{ "mcpServers": { "chicio-portfolio": { "url": "https://fabrizioduroni.it/api/mcp" } } }
```

## Site URL
`https://fabrizioduroni.it` — centralised in `src/lib/mcp/config.ts` as `MCP_SITE_URL`

**Why:** ESLint@10 + typescript-eslint@8.x incompatibility (pre-existing from eslint-config-next@16.2.4 bump) blocked `npm run lint`, but `npm run build` and `tsc --noEmit` both pass clean.
