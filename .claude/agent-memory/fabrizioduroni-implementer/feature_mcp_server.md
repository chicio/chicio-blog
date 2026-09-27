---
name: MCP Portfolio Server
description: Public MCP server at /api/mcp exposing portfolio content via 10 tools, filesystem-backed, Vercel-compatible
type: project
---

## Architecture
- Route: `apps/website/src/app/api/mcp/route.ts` — exports GET (now a 405, see [[feature_mcp_get_sse_timeout_fix]]), POST, DELETE, OPTIONS
- Server factory: `apps/website/src/lib/mcp/server.ts` — `createMcpServer()` wires all tools
- Tools: `apps/website/src/lib/mcp/tools/register-*.ts` — one file per tool
- Transport: `WebStandardStreamableHTTPServerTransport` from `@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js`
- Mode: **stateless** (`sessionIdGenerator: undefined`) — required for Vercel serverless
- OAuth discovery: `apps/website/src/app/.well-known/oauth-protected-resource/route.ts` returns `authorization_servers: []` (RFC 9728) so clients like mcp-remote skip OAuth
- Dep: `@modelcontextprotocol/sdk@^1.29.0`

## Tools
Backends verified 2026-09-27 (the old `getPosts`/`getAllConsoles`/… accessors are gone, see
[[arch_content_section_factory]]):

| Tool | Backend |
|------|---------|
| `search_content(query, limit?)` | elasticlunr built at request time from `getIndexableContent()` — no filesystem read |
| `list_posts(tag?, limit?)` | `posts.list()` / `getPostsForTag()` |
| `get_post(year, month, day, slug)` | `posts.single(params)` — params are zero-padded strings |
| `get_tags()` | `getTags()` |
| `get_dsa_topics()` | `topics.list()` |
| `get_dsa_exercises(topic?, difficulty?)` | `exercises.list()` (+ `topics`) — difficulty is "Easy"\|"Medium"\|"Hard" |
| `get_about_me()` | `aboutMe` (`apps/website/src/lib/content/about-me/about-me.ts`) |
| `get_videogame_consoles()` | `consoles.list()` — sorted by release year |
| `get_videogame_games(console?, genre?)` | `games.list()` / `getAllGamesForConsole()` — console filter uses name field from get_videogame_consoles |
| `get_site_stats()` | aggregate: Posts, Tags, Topics/Exercises, Consoles/Games, latest Post |

## Key decisions
- 100% filesystem-based — the Knowledge Base (Upstash Vector) is NOT used
- `search_content` builds elasticlunr index at request time (not from `apps/website/public/search-index.json`) to avoid 1.63GB Vercel bundle issue
- `createSearchIndex()` extracted to `apps/website/src/lib/content/search-index-factory.ts` (also fixed pre-existing duplicate-doc bug in original `search.ts`)
- `outputFileTracingExcludes` in `apps/website/next.config.ts` keeps the bundle under 300MB; now
  `{ "/**": ["public/media/**", "src/content/**/media/**"] }` (originally `"/api/**": ["public/images/**"]`)
- CORS headers (`*`) on all responses
- Per-request new server+transport instances (stateless pattern)
- Post dir structure: `apps/website/src/content/blog/post/YYYY/MM/DD/slug/` — month/day are zero-padded

## Public /mcp page
- Route: `apps/website/src/app/mcp/page.tsx` + `apps/website/src/components/content/mcp/mcp-page/` (a Standalone Page,
  copy in `apps/website/src/content/mcp/content.mdx`)
- Five client cards: Claude Code, Cursor, VS Code + Copilot, Claude Desktop/Windsurf, claude.ai
- Server name in all examples: `"fabrizioduroni.it"`
- Cursor and VS Code support HTTP transport directly (no mcp-remote)
- Claude Desktop and Windsurf use mcp-remote as stdio↔HTTP bridge

## Client connection methods
| Client | Config |
|--------|--------|
| Claude Code | `claude mcp add --transport http fabrizioduroni.it https://fabrizioduroni.it/api/mcp` |
| Cursor | `~/.cursor/mcp.json` with `{ "mcpServers": { "fabrizioduroni.it": { "url": "..." } } }` |
| VS Code + Copilot | `.vscode/mcp.json` with `{ "servers": { "fabrizioduroni.it": { "type": "http", "url": "..." } } }` |
| Claude Desktop | `claude_desktop_config.json` with `mcp-remote` bridge |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` with `mcp-remote` bridge (same format as Claude Desktop) |
| claude.ai | Settings → Connectors → Add custom connector |

## Claude Desktop PATH issue (macOS)
If Node.js is installed via `n` or `nvm`, Claude Desktop (GUI app) doesn't inherit shell PATH.
Fix: add `"env": { "PATH": "/Users/<user>/.n/bin:..." }` to the server config in claude_desktop_config.json.

## Site URL
`https://www.fabrizioduroni.it` — centralised in `apps/website/src/lib/mcp/config.ts` as `MCP_SITE_URL`

## MCP Registry
Server can be published to `registry.modelcontextprotocol.io` as a remote server via `server.json` with `"remotes": [{ "type": "streamable-http", "url": "..." }]`. No npm publish needed for remote servers.
Name convention: `io.github.chicio/portfolio`
