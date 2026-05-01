# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog (App Router) with a Matrix-inspired UI theme, built by Fabrizio Duroni. The site features blog posts, DSA (Data Structures & Algorithms) content, an AI chat interface, and various interactive elements. The codebase follows atomic design principles and uses TypeScript with strict type safety.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Dev server (auto-generates search index)
npm run build && npm start  # Production build
npm run lint             # Linting
npm run search-index     # Search index generation (auto before dev/build)
npm run chat-knowledge-upload  # Upload blog content to Upstash Vector for RAG
npm run release          # Release with conventional changelog
```

**Important**: Search index regenerates automatically before `dev` and `build` via npm hooks.

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages and layouts
├── components/
│   ├── design-system/           # Atomic design: atoms → molecules → organisms → templates
│   └── sections/               # Feature-specific: blog/, chat/, dsa/, easter-eggs/, home/, about-me/
├── content/                      # All MDX content, filesystem-as-database
├── lib/                         # Core business logic and utilities
└── types/                       # TypeScript type definitions
```

### Key Patterns

- **Atomic Design System**: atoms → molecules → organisms → templates. See `.claude/rules/design-system.md`
- **Section Isolation**: Features in `src/components/sections/<section>/` with own `components/` and `hooks/`. See `.claude/rules/sections.md`
- **Business Logic in lib/**: Components are thin, delegate to `src/lib/`
- **Type Safety**: Shared types in `src/types/`, TypeScript strict mode
- **Content as MDX**: Filesystem-as-database. See `.claude/rules/mdx-content.md`
- **API Routes**: Chat (Groq + Upstash Vector RAG) and Contact (Resend). See `.claude/rules/api-routes.md`
- **Testing**: No automated test suite — lint + build + manual browser. See `.claude/rules/testing.md`

## Code Style

See `.claude/rules/code-style.md`. Key points: 4 spaces, 120 char lines, always braces on `if`, `@/` import alias, conventional commits with Gitmoji.

## Technology Stack

Next.js 16 (App Router), React 19, TailwindCSS v4, Framer Motion v12, TypeScript 5 (strict), MDX (@next/mdx), Groq AI (Llama 3.3 70B), Upstash Vector (RAG), elasticlunr (search), Vercel Analytics & Speed Insights, Google Analytics (@next/third-parties).

## Environment Setup

- **Node**: 22.x (specified in `package.json`)
- **Env files**: `.env.development`, `.env.production`
- **Required secrets**: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

## CI/CD

GitHub Actions (`.github/workflows/build.yml`): macOS, Node 22, npm cache, Upstash secrets, build + artifacts.

## Release

`release-it` with conventional changelog (`.release-it.json`). Generates CHANGELOG.md and GitHub releases. Run: `npm run release`

## Code Navigation

Use the LSP tool as the primary code navigation method for all symbol-level work — understanding code, tracing dependencies, and refactoring. It provides semantically accurate, type-aware results that Grep/Glob cannot match. Fall back to Grep/Glob only for text-pattern searches (string literals, comments, file-name patterns).

## Markdown Content Negotiation

AI agents and tools that send `Accept: text/markdown` receive a Markdown representation of the requested page instead of HTML.

**Architecture**:
- `src/middleware.ts` — re-exports `proxy` from `src/proxy.ts` as `middleware`, providing Next.js middleware wiring
- `src/proxy.ts` — generic proxy: if `Accept: text/markdown`, prepends `/markdown` to the path and rewrites; never needs updating for new pages
- `src/app/markdown/[[...path]]/route.ts` — single catch-all route handler; dispatches by path segments to per-section markdown generators; statically pre-rendered via `generateStaticParams`

**Adding markdown for a new page**: Add a new path-matching `if` block in the `GET` handler in `src/app/markdown/[[...path]]/route.ts`, add the path to `generateStaticParams`, and write a generator function that uses existing `src/lib/content/` functions.

## Commit Convention

- Scopes: `performance`, `ux`, `capabilities`, `content`, `ai`, `deps`
- Conventional commits with Gitmoji convention
