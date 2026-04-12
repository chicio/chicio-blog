# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog (App Router) with a Matrix-inspired UI theme, built by Fabrizio Duroni. The site features blog posts, DSA (Data Structures & Algorithms) content, an AI chat interface, and various interactive elements. The codebase follows atomic design principles and uses TypeScript with strict type safety.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (auto-generates search index via predev hook)
npm run dev

# Production build (auto-generates search index via prebuild hook)
npm run build
npm start

# Linting
npm run lint

# Search index generation (runs automatically before dev/build)
npm run search-index

# Chat knowledge upload (uploads blog content to Upstash Vector for RAG)
npm run chat-knowledge-upload

# Release (uses release-it with conventional changelog)
npm run release
```

**Important**: The search index must be regenerated whenever blog content changes. This happens automatically before `dev` and `build` commands via npm hooks.

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages and layouts
│   ├── api/chat/                # Chat API endpoint
│   └── blog/, chat/, art/, etc. # Feature-specific routes
├── components/
│   ├── design-system/           # Atomic design components
│   │   ├── atoms/              # Basic UI elements
│   │   ├── molecules/          # Composed atom components
│   │   ├── organism/           # Complex composed components (e.g., menu)
│   │   ├── templates/          # Page-level layouts
│   │   └── utils/              # Design system utilities
│   └── sections/               # Feature-specific components
│       ├── about-me/              # Blog-specific components
│       ├── blog/              # Blog-specific components
│       ├── chat/              # Chat UI and hooks
│       ├── dsa/               # DSA content components
│       ├── easter-eggs/       # Matrix rain, white rabbit, etc.
│       └── home/              # Homepage components
├── content/                      # All content is MDX (.mdx), filesystem-as-database
│   ├── about-me/               # Single page (content.mdx)
│   ├── art/                    # Art metadata (art.ts)
│   ├── blog/post/              # Blog posts: [year]/[month]/[day]/[slug]/content.mdx
│   ├── data-structures-and-algorithms/  # DSA: topic/[topic]/content.mdx, .../exercise/[exercise]/content.mdx
│   ├── home/                   # Homepage data (projects.ts, technology.ts, timeline.ts)
│   └── videogames/             # Videogames: console/[console]/game/[game]/content.mdx
├── lib/                         # Core business logic and utilities
│   ├── content/                # Content discovery, loading, frontmatter parsing (gray-matter)
│   ├── chat/                   # Chat LLM prompts, Upstash Vector RAG
│   ├── motion/                 # Framer Motion utilities
│   ├── local-storage/          # localStorage helpers
│   ├── tracking/               # Google Analytics tracking
│   └── consents/               # Cookie consent management
└── types/                       # TypeScript type definitions
```

### Key Architectural Patterns

**Atomic Design System**: Components are organized in layers (atoms → molecules → organisms → templates). Always compose from existing lower-level components before creating new ones.

**Section Isolation**: Each major feature (blog, chat, art, etc.) lives in `src/components/sections/<section>` with its own `components/` and `hooks/` subdirectories. This keeps feature code modular and maintainable.

**Business Logic in lib/**: All utilities, parsers, and core logic live in `src/lib/`. Components should be thin and delegate to lib functions.

**Type Safety**: All shared types are in `src/types/`. Update these when changing data models. The project uses TypeScript strict mode.

### Content Management

All content uses **MDX** (`.mdx`) format with a **filesystem-as-database** approach. Each content piece is a `content.mdx` file inside a directory whose path encodes the route parameters.

**Content Structure**:
- `src/content/blog/post/[year]/[month]/[day]/[slug]/content.mdx` — Blog posts
- `src/content/data-structures-and-algorithms/topic/[topic]/content.mdx` — DSA topics
- `src/content/data-structures-and-algorithms/topic/[topic]/exercise/[exercise]/content.mdx` — DSA exercises
- `src/content/videogames/console/[console]/content.mdx` — Console pages
- `src/content/videogames/console/[console]/game/[game]/content.mdx` — Game pages
- `src/content/about-me/content.mdx` — About me page

**Content Loading** (`src/lib/content/`):
- `content.ts` — Core content discovery engine, scans filesystem with dynamic slug patterns
- `gray-matter.ts` — Frontmatter parsing (title, description, date, image, tags, authors, metadata)
- `posts.ts` — Blog post loading with pagination (7 posts/page)
- `data-structures-and-algorithms.ts` — DSA content with topic navigation, exercise metadata (technique, leetcodeUrl)
- `videogames.ts` — Console and game metadata extraction (logo, release year, genre, PEGI, etc.)
- `search.ts` / `search-filename.ts` — Search index generation (elasticlunr, `public/search-index.json`)

**MDX Processing**:
- Remark plugins: emoji, GFM, math, frontmatter, YouTube embeds
- Rehype plugins: syntax highlighting, KaTeX rendering, figure captions
- Custom MDX components mapped in `src/mdx-components.tsx`
- Configuration in `next.config.ts`

### Chat Feature Architecture

The chat feature uses AI SDK with Groq (Llama 3.3 70B) and RAG via Upstash Vector:

- **UI Components**: `src/components/sections/chat/components/`
- **State Management**: `src/components/sections/chat/hooks/useFabrizioChat.ts` (uses `@ai-sdk/react`)
- **API Route**: `src/app/api/chat/route.ts` (handles chat requests)
- **LLM System Prompt**: `src/lib/chat/llm-prompt.ts` (personality, instructions, RAG context)
- **RAG Implementation**: `src/lib/chat/upstash-vector.ts` (retrieves relevant blog content)
- **Knowledge Upload**: `npm run chat-knowledge-upload` (indexes blog posts in Upstash Vector)

Environment variables required: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

### Navigation, Tracking, and UI Effects

See `.claude/rules/sections.md` for section/route conventions and tracking details.
See `.claude/rules/design-system.md` for Matrix theme, glassmorphism, and motion hooks.

## Code Style

See `.claude/rules/code-style.md` for full conventions. Key points:
- 4 spaces, 120 char lines, always use braces on `if`
- `@/` import alias for `src/`
- Conventional commits with Gitmoji

## Technology Stack

- **Next.js 16**: App Router, server components
- **React 19**: React and React DOM (RC version)
- **TailwindCSS v4**: Utility-first styling with @tailwindcss/postcss
- **Framer Motion v12**: UI animations
- **TypeScript 5**: Strict mode enabled
- **MDX**: Interactive content via @next/mdx
- **Groq AI**: LLM provider (Llama 3.3 70B) for chat
- **Upstash Vector**: Vector database for RAG in chat
- **elasticlunr**: Client-side search
- **Vercel Analytics & Speed Insights**: Performance monitoring
- **Google Analytics**: User tracking (via @next/third-parties)

## Common Tasks

### Adding Content

See `.claude/rules/mdx-content.md` for full MDX conventions, frontmatter format, writing style, and component imports.

Quick reference: create `src/content/blog/post/YYYY/MM/DD/slug-name/content.mdx` with frontmatter, then `npm run dev` or `npm run build` (search index regenerates automatically).

### Adding a New Section

See `.claude/rules/sections.md` for the full checklist (slug types, menu, tracking, routes).

### Extending the Design System

See `.claude/rules/design-system.md` for the atomic design hierarchy and Matrix theme rules.

## Environment Setup

- **Node version**: 22.x (specified in `package.json`)
- **Environment files**:
  - `.env.development` for local development
  - `.env.production` for production
- **Required secrets** (for chat feature):
  - `UPSTASH_VECTOR_REST_URL`
  - `UPSTASH_VECTOR_REST_TOKEN`

## CI/CD

GitHub Actions workflow in `.github/workflows/build.yml`:
- Runs on macOS with Node 22
- Caches npm dependencies
- Requires Upstash Vector secrets
- Builds project and uploads artifacts

## Release Process

Uses `release-it` with conventional changelog plugin (`.release-it.json`):
- Generates `CHANGELOG.md` automatically
- Creates GitHub releases automatically
- Run: `npm run release`

## Commit convention

- Commit scopes: `performance`, `ux`, `capabilities`, `content`
- Follows conventional commits
- Use Gitmojii convention already in place for the commits until today
