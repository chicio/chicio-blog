<!--
AI Agent Instructions for chicio-blog
-->

# Project Overview

This is a personal blog built with Next.js (App Router), React, and TailwindCSS, featuring a Matrix-inspired design. The codebase is organized for clarity, maintainability, and extensibility, with a focus on atomic design and strong separation of concerns.

## Key Architectural Patterns

- **Atomic Design System**: UI components are structured as atoms, molecules, organisms, and templates under `src/components/design-system`. Reuse and extend these blocks for new UI features.
- **Section-based Structure**: Each main section (e.g., blog, chat, art) has its own folder in `src/components/sections`, with `components/` and `hooks/` subfolders. This enables isolated development and testing of section-specific logic.
- **Business Logic & Utilities**: All business logic and utility functions are in `src/lib`. For example, post parsing, search index generation, and tracking utilities.
- **Type Safety**: All shared types are in `src/types`. Always update or reference these when changing data models or API contracts.
- **Markdown Content**: Blog posts are Markdown files in `/posts`. Frontmatter is parsed using `gray-matter` and custom logic in `src/lib/posts`.

## Developer Workflows

- **Install dependencies**: `npm install`
- **Development server**: `npm run dev`
- **Production build**: `npm run build` then `npm start`
- **Release**: `npm run release` (uses `release-it`)
- **Linting**: `npm run lint` (uses ESLint)
- **Search index**: Automatically generated before dev/build via `npm run search-index` (runs `tsx src/lib/posts/search.ts` to create `public/search-index.json` from Markdown posts)
- **CI/CD**: See `.github/workflows/build.yml` for GitHub Actions build pipeline (runs on macOS, caches npm, builds with secrets for Upstash Vector)

## Project-Specific Conventions

- **Glassmorphism & Motion**: Use the `useGlassmorphism` and `useMotionSettings` hooks for consistent UI effects and accessibility. Motion settings are persisted in localStorage with a project-specific prefix.
- **Tracking**: All navigation and key UI actions are tracked via Google Analytics, gated by cookie consent. Use the `trackWith` utility and `tracking` types for new tracked events.
- **Menu & Navigation**: The main menu is a reusable organism (`design-system/organism/menu.tsx`) with search, tracking, and section links. Update slugs in `src/types/slug.ts` for new sections.
- **Chat Section**: Uses `@ai-sdk/groq` and `@ai-sdk/react` for LLM chat. The chat UI is in `sections/chat/components`, with state managed by `useFabrizioChat`.
- **Search**: Client-side search is powered by `elasticlunr`. The index is built from Markdown frontmatter and stored in `public/search-index.json`.
- **Easter Eggs**: Special UI/UX features (e.g., Matrix rain, white rabbit) are implemented as React components in `sections/easter-eggs`.

## Integration Points & External Dependencies

- **Next.js**: App Router structure in `src/app`. Update routes and layouts here.
- **TailwindCSS**: Utility-first styling, configured in `tailwind.config.js`.
- **Framer Motion**: For all UI animations and transitions.
- **Markdown Rendering**: Uses `remark`, `rehype`, `katex`, and related plugins for advanced Markdown features (math, emoji, GFM, syntax highlighting).
- **Upstash Vector**: Used in CI for search/chat features (secrets required).

## Examples & References

- **Add a new blog post**: Place a Markdown file in `/posts` with frontmatter (see existing posts for schema). The search index will update automatically on next build/dev.
- **Add a new section**: Create a folder in `src/components/sections`, with `components/` and `hooks/` as needed. Register navigation in the menu and update slugs.
- **Extend the design system**: Add new atomic components under `design-system/atoms`, then compose in molecules/organisms/templates.
- **Implement tracked navigation**: Use `MenuItemWithTracking` and update `tracking` types for new actions.

---
For further details, see `README.md`, `src/types`, and the `src/lib` utilities. Keep this file up to date with new patterns or workflows.