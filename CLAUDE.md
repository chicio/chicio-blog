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
│       ├── blog/              # Blog-specific components
│       ├── chat/              # Chat UI and hooks
│       ├── dsa/               # DSA content components
│       ├── easter-eggs/       # Matrix rain, white rabbit, etc.
│       └── home/              # Homepage components
├── content/
│   ├── posts/                  # Blog posts (Markdown .md files)
│   └── dsa/                    # DSA content (MDX .mdx files)
├── lib/                         # Core business logic and utilities
│   ├── posts/                  # Post parsing, search index generation
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

**Blog Posts** (`src/content/posts/*.md`):
- Markdown files with frontmatter (title, description, date, image, tags, authors)
- Parsed using `gray-matter` in `src/lib/posts/`
- Search index generated from frontmatter via `npm run search-index` (creates `public/search-index.json`)
- Uses elasticlunr for client-side search

**DSA Content** (`src/content/dsa/*.mdx`):
- MDX files that support interactive React components
- Custom MDX components mapped in `src/mdx-components.tsx`
- Supports math equations (KaTeX), syntax highlighting, and custom figures

**Markdown/MDX Processing**:
- Remark plugins: emoji, GFM, math, frontmatter, YouTube embeds
- Rehype plugins: syntax highlighting, KaTeX rendering, figure captions
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

### Navigation and Menu

Main menu is in `src/components/design-system/organism/menu.tsx`. Uses `MenuItemWithTracking` for analytics. When adding new sections:
1. Add section type to `src/types/slug.ts`
2. Register in menu component
3. Update tracking events in `src/types/tracking.ts`

### Tracking and Analytics

All navigation and UI interactions are tracked via Google Analytics (gated by cookie consent):
- Use `trackWith` helper from `src/lib/tracking/`
- Update `src/types/tracking.ts` for new events
- Cookie consent managed in `src/lib/consents/`

### UI Effects

**Glassmorphism**: Use `useGlassmorphism` hook for consistent glass effects across UI.

**Motion Settings**: Controlled via `useMotionSettings` hook. Settings stored in localStorage with `fabrizioduroni_` prefix. Users can toggle animations.

**Easter Eggs**: Matrix rain, white rabbit, and other special effects in `src/components/sections/easter-eggs/`.

## Code Style

- **Indentation**: 4 spaces (not tabs)
- **Line length**: 120 characters max
- **Prettier**: Configured in `.prettierrc` with Tailwind plugin
- **ESLint**: Extends Next.js core-web-vitals and TypeScript configs
- **Author attribution**: Add author name to new files
- **Import alias**: Use `@/` for imports (maps to `src/` via `tsconfig.json`)

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

### Adding a Blog Post

1. Create `src/content/posts/YYYY-MM-DD-slug.md`
2. Add frontmatter (see existing posts for format):
   ```yaml
   ---
   title: "Post Title"
   description: "Post description"
   date: YYYY-MM-DD
   image: /images/posts/image.jpg
   tags: [tag1, tag2]
   authors: [fabrizio_duroni]
   ---
   ```
3. Run `npm run dev` or `npm run build` (search index regenerates automatically)

### Adding a New Section

1. Create `src/components/sections/<section-name>/`
2. Add `components/` and `hooks/` subdirectories as needed
3. Update `src/types/slug.ts` with new section type
4. Register in `src/components/design-system/organism/menu.tsx`
5. Update `src/types/tracking.ts` for analytics events
6. Create route in `src/app/<section-name>/page.tsx`

### Extending the Design System

1. Add atoms to `src/components/design-system/atoms/`
2. Compose molecules from atoms in `src/components/design-system/molecules/`
3. Build organisms from molecules in `src/components/design-system/organism/`
4. Create page templates in `src/components/design-system/templates/`

### Updating Chat Personality

Edit `src/lib/chat/llm-prompt.ts` to modify:
- System prompt and personality
- RAG instructions
- Example responses

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
- Follows conventional commits
- Commit scopes: `performance`, `ux`, `capabilities`, `content`
- Creates GitHub releases automatically
- Run: `npm run release`
