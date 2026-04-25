# Memory Index

## Site
- [Site Info](project_site_info.md) — Production domain is fabrizioduroni.it (not chicio.dev)

## Architecture
- [Content System](arch_content_system.md) — Filesystem-as-database with slug patterns, metadata adapters, search indexing
- [Design System & Matrix Theme](arch_design_system.md) — Atomic design, Matrix palette, glassmorphism/motion hooks
- [Routes & Sections](arch_routes_sections.md) — Complete route map, section components, legacy URL redirects
- [Next.js Config](arch_next_config.md) — MDX plugins, React Compiler, image optimization, release pipeline

## Integrations
- [Chat Feature](integration_chat.md) — Groq LLM + Upstash Vector RAG, streaming, knowledge upload
- [Contact & Rate Limiting](integration_contact_ratelimit.md) — Resend emails, honeypot, Upstash Redis rate limiting

## Features
- [DSA Section](feature_dsa_section.md) — Routes, visualizers, content loading, navigation; content authoring owned by DSA agent
- [Chrome AI](feature_chrome_ai.md) — Chrome built-in Summarizer API in blog section
- [Easter Eggs](feature_easter_eggs.md) — Neo room terminal, white rabbit, dejavu, search-triggered
- [Videogames](feature_videogames.md) — Console/game collection with rich metadata and filtering
- [Copy Code Button](feature_copy_code_button.md) — Copy-to-clipboard on all MDX code blocks, key pitfalls (hydration, DOM vs React tree)
- [PWA](feature_pwa.md) — Serwist configurator mode, offline caching, install prompt, background sync; critical SW gotchas documented

## Features (continued)
- [Command Palette](feature_command_palette.md) — ⌘K palette, MotionDiv blink suppression pattern, stable close/ESC, search pill design

## Features (continued 2)
- [MCP Portfolio Server](feature_mcp_server.md) — Public MCP server at /api/mcp, 10 tools (incl. videogames), stateless, OAuth discovery endpoint, /mcp page with 5 client cards

## Feedback
- [PWA & State Patterns](feedback_pwa_patterns.md) — useSyncExternalStore for localStorage state, consent-gated UI, banner/error page alignment rules
