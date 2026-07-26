# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog (App Router) with a Matrix-inspired UI theme, built by Fabrizio Duroni. The site features blog posts, DSA (Data Structures & Algorithms) content, an AI chat interface, and various interactive elements. The codebase follows atomic design principles and uses TypeScript with strict type safety.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Dev server (auto-generates search index + copies images)
npm run build && npm start  # Production build
npm run lint             # Linting (--max-warnings 0 in CI)
npm run validate-architecture  # dependency-cruiser: import rules, layering, isolation (all at error)
# Search index generation and content-media copy have no standalone npm script:
# both run automatically via src/lib/build/prebuild.ts before dev/build (see note below).
# The copy step mirrors <post-dir>/media/ into public/media/content/.
npm run chat-knowledge-upload  # Upload blog content to Upstash Vector for RAG
npm run release          # Release with conventional changelog
```

**Important**: Search index and content image copy both run automatically before `dev` and `build` via `src/lib/build/prebuild.ts`. `validate-architecture` is NOT part of prebuild — it runs as its own CI job (and should be run during development; see below) and fails CI on violations.

## Architecture

### Key Patterns

- **Folder-Per-Component + Store Model**: every component lives in its own kebab-case folder with a `<name>.tsx`, a `use-<name>-store.ts` hook, and an `index.ts` barrel. Components call exactly one hook (`use<Name>Store()`). `useGlassmorphism` is permanently exempt. See `.claude/rules/component-architecture.md` for the full specification.
- **Atomic Design System**: atoms → molecules → organisms → templates. Layering enforced at error by dependency-cruiser. See `.claude/rules/design-system.md`
- **Page-Content Isolation**: Each route's components live in `src/components/content/<page>/` (no separate `components/` or `hooks/` subdirs — folder-per-component directly). Cross-cutting UI lives in `src/components/features/<feature>/`. See `.claude/rules/content.md`
- **Business Logic in lib/**: Components are thin. Non-hook pure logic lives in `src/lib/`, never in `design-system/utils/` (eliminated).
- **Type Safety**: Shared types in `src/types/`, TypeScript strict mode
- **Store Return Types**: `StateStore<S>`, `EffectsStore<E>`, `ComponentStore<S,E>` from `@/types/component-store`. Never pad with `Record<string,never>` or `{}`.
- **No Functions in JSX**: `react/jsx-no-bind` enforced at error. Curry handlers in the store.
- **Content as MDX**: Filesystem-as-database. See `.claude/rules/mdx-content.md`
- **Co-located Images**: Blog post images live in `<post-dir>/media/`, other content images in `src/content/<section>/media/` (the folder MUST be named `media` — the copy script keys off that path segment). A build-time script (`src/lib/images/copy-content-media.ts`) mirrors them to `public/media/content/`. The `public/media/content/` directory is gitignored and regenerated on every build.
- **API Routes**: Chat (Groq + Upstash Vector RAG) and Contact (Resend). See `.claude/rules/api-routes.md`
- **Testing**: Automated suite — Vitest (node project for `lib/**`, jsdom + RTL for `components/**`), Playwright e2e, plus lint + typecheck + build; CI gates on coverage thresholds. agent-browser for local live-QA. See `.claude/rules/testing.md`

## Code Style

See `.claude/rules/code-style.md`. Key points: 4 spaces, 120 char lines, always braces on `if`, `@/` import alias, conventional commits with Gitmoji, one-hook-per-component, no functions in JSX.

## Environment Setup

- **Env files**: `.env.development`, `.env.production`
- **Required secrets**: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`): four jobs — lint (ESLint `--max-warnings 0`), knip, validate-architecture (dependency-cruiser, all rules at error), and build (Next.js). lint, knip, and validate-architecture all gate build. Upstash/Resend secrets injected for build.

## Release

`release-it` with conventional changelog (`.release-it.json`). Generates CHANGELOG.md and GitHub releases. Run: `npm run release`

## Code Navigation

The workspace is indexed by CodeGraph (`.codegraph/`, MCP server in `.mcp.json`). Navigation order:

1. **CodeGraph first** — `codegraph_explore` (MCP tool) or `codegraph explore "<question or symbols>"` (CLI). One call returns the verbatim line-numbered source of the relevant symbols grouped by file, the call paths between them (including dynamic-dispatch hops grep can't follow), and a blast-radius summary of what depends on them. Use it for every "where is X / how does X work / what depends on X" question, before Read/Grep/LSP.
2. **LSP for precise symbol-level follow-ups** — hover types, exact references, call hierarchy during refactoring. Semantically accurate, type-aware results that Grep/Glob cannot match.
3. **Grep/Glob only for text patterns** — string literals, comments, file-name patterns.

## Markdown Content Negotiation

AI agents and tools that send `Accept: text/markdown` receive a Markdown representation of the requested page instead of HTML.

**Architecture**:
- `src/middleware.ts` — re-exports `proxy` from `src/proxy.ts` as `middleware`, providing Next.js middleware wiring
- `src/proxy.ts` — generic proxy: if `Accept: text/markdown`, prepends `/markdown` to the path and rewrites; never needs updating for new pages
- `src/app/markdown/[[...path]]/route.ts` — single catch-all route handler; dispatches by path segments to per-section markdown generators; statically pre-rendered via `generateStaticParams`

**Adding markdown for a new page**: Add a new path-matching `if` block in the `GET` handler in `src/app/markdown/[[...path]]/route.ts`, add the path to `generateStaticParams`, and write a generator function that uses existing `src/lib/content/` functions.

## Agentic SDLC Pipeline (code work)

Non-trivial **code** changes can be run through an orchestrated, multi-agent SDLC via the
`fabrizioduroni-blog-sdlc` skill — interactive (two human gates, main-thread, never auto-triggers) or
`--autonomous --from-issue <N>` (issue-as-contract, PR-only, never merges). The skill documents every stage,
both modes, the agent roster with models, the mechanical gates, and worktree isolation; it loads on
invocation, so that detail is not repeated here. Related skills: `/fabrizioduroni-task` (author a loop-ready
issue), `/fabrizioduroni-scout` (file code-health tasks), `/fabrizioduroni-autopilot` and
`fabrizioduroni-loop` (drive `/loop`). Full design spec: `docs/agentic-sdlc/`.

**When to use what**: full pipeline (`/fabrizioduroni-blog-sdlc`) for non-trivial code features/fixes; call
`fabrizioduroni-implementer` **directly** as a quick-path escape hatch for trivial, well-specified code
changes; use the writer agents (`fabrizioduroni-writer-engineer`, `fabrizioduroni-writer-dsa-engineer`) for
content — the pipeline refuses content tasks.

## Commit Convention

- Scopes: `performance`, `ux`, `capabilities`, `content`, `ai`, `deps`
- Conventional commits with Gitmoji convention
