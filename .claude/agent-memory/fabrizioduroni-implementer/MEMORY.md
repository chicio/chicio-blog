# Memory Index

## Site
- [Site Info](project_site_info.md) — Production domain is fabrizioduroni.it (not chicio.dev)

## Architecture
- [Content System](arch_content_system.md) — Filesystem-as-database with slug patterns, metadata adapters, search indexing
- [Design System & Matrix Theme](arch_design_system.md) — Atomic design, Matrix palette, glassmorphism/motion hooks
- [Routes & Sections](arch_routes_sections.md) — Complete route map, section components, legacy URL redirects
- [Next.js Config](arch_next_config.md) — MDX plugins, React Compiler, image optimization, release pipeline
- [Media Co-location & Public Static Media](arch_image_colocation.md) — all media under public/media/ (content/ gitignored; sounds/, authors/, clowns/, PNGs flat at top level); copy-content-media.ts; 3 redirects; SelfHostedVideo molecule

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
- [Mermaid Diagrams](feature_mermaid_diagrams.md) — MDX diagrams via ```mermaid blocks, lazy singleton loader, Matrix theme, no next/dynamic

## Features (continued 3)
- [Markdown Negotiation](feature_markdown_negotiation.md) — Accept: text/markdown support via proxy.ts + /markdown-content/* routes, Next.js 16 proxy convention
- [Matrix Rain Control Panel](feature_matrix_rain_panel.md) — Command-palette drawer for live WebGPU rain tweaks; localStorage settings, webGpuFailed as local useState (no shared store), fontSize commits on release only

## Infrastructure
- [CI Pipeline](project_ci_pipeline.md) — Three-job workflow (lint, knip, build); lint/knip gate build; ubuntu-latest; npm ci; concurrency cancel; 2026-06-05

## Architecture (continued)
- [Design System Purity](arch_design_system_purity.md) — FULLY pure: type-only @/types, no config-const exception; slugs/siteMetadata/tracking injected as props; design-system-types-type-only rule at error

## Features (continued 4)
- [Testing Pyramid](feature_testing_pyramid.md) — Vitest+RTL+Playwright introduced PR #395; vi.hoisted() gotcha, react-dom pin, reactCompilerPreset v6 API, node/jsdom split, mock-per-test discipline

## Features (continued 5)
- [Chart Theme](feature_chart_theme.md) — shared chartTheme module in types/configuration; fixed-slot palette; recharts Legend labelStyle vs wrapperStyle gotcha

## Features (continued 6)
- [Blog Comments](feature_blog_comments.md) — giscus live widget (custom-element, lazy, full-replacement theme CSS) + static legacy Disqus archive; worktree .env gotcha

## Features (continued 7)
- [Terminal List Item](feature_terminal_list_item.md) — shared molecule (terminal "> title" + dim description), used by SearchResultItem and Read next
- [Blog Comments update](feature_blog_comments.md) — BlogComments now legitimately owns a store (simulated TerminalProgressBar until giscus postMessage), mount-start chosen over useInView
- [Terminal Button](design-system_terminal_button.md) — polymorphic link/action molecule replacing TerminalLink (2026-07-18); post-card/console-card/egg-card callers
- [Read Next Terminal Window](feature_read_next_terminal_window.md) — private client shell wraps read-next in command-palette-style terminal chrome; h2 base-layer override gotcha; e2e locator `../..`

## Features (continued 8)
- [Terminal Navigation](feature_terminal_navigation.md) — global full-screen overlay (evolved from windowed /terminal, 2026-07-23); open/cat in-shell render+popstate mirroring; AppRootBoundary inert; set-state-in-effect/KeyboardEvent-collision gotchas
- [mdxToMarkdown Sanitizer](feature_mdx_to_markdown_sanitizer.md) — pure lib/ MDX→markdown AST sanitizer wired into 7 /markdown generators; remark-math-before-remark-mdx ordering gotcha; flow-vs-text JSX classification rules

## Features (continued 9)
- [Markdown Generalization](feature_markdown_generalization.md) — markdownDocument/mdxPageMarkdown/contactMarkdown (2026-07-23); rehype-figure wraps images in figure not p; leading-H1 dedup for mcp/cookie-policy; art/cookie-policy MDX migrations
- [Terminal Navigation Part 2](feature_terminal_navigation.md) — sticky/shareable /terminal boot URL (router.replace moved from boot to close); full markdown content coverage wiring
- [Konami/Spoon Easter Eggs](arch_easter_eggs_konami_spoon.md) — global-listener eggs (Kung Fu, Spoon) + unified tap hotspot on kung-fu, set-state-in-effect fix (ref-in-handler not effect+state), vi.hoisted/framer-motion mock gotchas, nested-worktree knip false positives

## Features (continued 10)
- [Terminal Navigation Part 3](feature_terminal_navigation.md) — REVERSED Part 2: /terminal boot link/sticky URL removed entirely, palette-only in-place open, no URL change ever (2026-07-24)

## Feedback
- [PWA & State Patterns](feedback_pwa_patterns.md) — useSyncExternalStore for localStorage state, consent-gated UI, banner/error page alignment rules
- [Worktree git stash hazard](feedback_worktree_git_stash_hazard.md) — never `git stash` inside a pipeline worktree, refs/stash is shared across all worktrees
- [Prettier CLI 2-space regression](feature_markdown_generalization.md) — never run raw `npx prettier --write`, it reformats to 2-space against this repo's 4-space convention (no format script/tabWidth config; 4-space comes from VS Code's editor.tabSize fallback)
