---
name: Site deployment info
description: Production domain and key deployment details for fabrizioduroni.it
type: project
---

Production URL: **https://fabrizioduroni.it**

**Why:** The user confirmed this during MCP server work. Previous code incorrectly used `chicio.dev`.

**How to apply:** Always use `fabrizioduroni.it` when constructing absolute URLs (e.g. in MCP tool responses, SEO metadata, RSS feed, sitemaps). The MCP constant lives at `src/lib/mcp/config.ts` as `MCP_SITE_URL`.
