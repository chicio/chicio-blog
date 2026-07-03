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
npm run search-index     # Search index generation (auto before dev/build)
npm run copy-images      # Copy content images to public/images/content/ (auto before dev/build)
npm run chat-knowledge-upload  # Upload blog content to Upstash Vector for RAG
npm run release          # Release with conventional changelog
```

**Important**: Search index and content image copy both run automatically before `dev` and `build` via `src/lib/build/prebuild.ts`. `validate-architecture` is NOT part of prebuild — it runs as its own CI job (and should be run during development; see below) and fails CI on violations.

## Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router pages and layouts
├── components/
│   ├── design-system/           # Atomic design: atoms → molecules → organisms → templates
│   │   └── hooks/               # Shared hooks (motion, glassmorphism, in-view, search, etc.)
│   ├── content/                 # Page-content components, one folder per route (mirrors src/content/)
│   └── features/                # Cross-cutting UI not tied to a route: pwa/, easter-eggs/, seo/
├── content/                      # All MDX content, filesystem-as-database
├── lib/                         # Core business logic and utilities (no JSX)
└── types/                       # TypeScript type definitions
```

### Key Patterns

- **Folder-Per-Component + Store Model**: every component lives in its own kebab-case folder with a `<name>.tsx`, a `use-<name>-store.ts` hook, and an `index.ts` barrel. Components call exactly one hook (`use<Name>Store()`). `useGlassmorphism` is permanently exempt. See `.claude/rules/component-architecture.md` for the full specification.
- **Atomic Design System**: atoms → molecules → organisms → templates. Layering enforced at error by dependency-cruiser. See `.claude/rules/design-system.md`
- **Page-Content Isolation**: Each route's components live in `src/components/content/<page>/` (no separate `components/` or `hooks/` subdirs — folder-per-component directly). Cross-cutting UI lives in `src/components/features/<feature>/`. See `.claude/rules/content.md`
- **Business Logic in lib/**: Components are thin. Non-hook pure logic lives in `src/lib/`, never in `design-system/utils/` (eliminated).
- **Type Safety**: Shared types in `src/types/`, TypeScript strict mode
- **Store Return Types**: `StateStore<S>`, `EffectsStore<E>`, `ComponentStore<S,E>` from `@/types/component-store`. Never pad with `Record<string,never>` or `{}`.
- **No Functions in JSX**: `react/jsx-no-bind` enforced at error. Curry handlers in the store.
- **Content as MDX**: Filesystem-as-database. See `.claude/rules/mdx-content.md`
- **Co-located Images**: Blog post images live in `<post-dir>/images/`, other content images in `src/content/<section>/images/`. A build-time script (`src/lib/images/copy-content-images.ts`) mirrors them to `public/images/content/`. The `public/images/content/` directory is gitignored and regenerated on every build.
- **API Routes**: Chat (Groq + Upstash Vector RAG) and Contact (Resend). See `.claude/rules/api-routes.md`
- **Testing**: Automated suite — Vitest (node project for `lib/**`, jsdom + RTL for `components/**`), Playwright e2e, plus lint + typecheck + build; CI gates on coverage thresholds. agent-browser for local live-QA. See `.claude/rules/testing.md`

## Code Style

See `.claude/rules/code-style.md`. Key points: 4 spaces, 120 char lines, always braces on `if`, `@/` import alias, conventional commits with Gitmoji, one-hook-per-component, no functions in JSX.

## Technology Stack

Next.js 16 (App Router), React 19, TailwindCSS v4, Framer Motion v12, TypeScript 5 (strict), MDX (@next/mdx), Groq AI (Llama 3.3 70B), Upstash Vector (RAG), elasticlunr (search), Vercel Analytics & Speed Insights, Google Analytics (@next/third-parties).

## Environment Setup

- **Node**: 24.x (specified in `package.json`)
- **Env files**: `.env.development`, `.env.production`
- **Required secrets**: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`): four jobs — lint (ESLint `--max-warnings 0`), knip, validate-architecture (dependency-cruiser, all rules at error), and build (Next.js). lint, knip, and validate-architecture all gate build. Upstash/Resend secrets injected for build.

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

## Agentic SDLC Pipeline (code work)

Non-trivial **code** changes can be run through an orchestrated, multi-agent SDLC. The **interactive** modes are
manual and main-thread — invoke the orchestrator skill explicitly; it never auto-triggers. The **autonomous** mode
runs the same pipeline unattended from a GitHub issue.

- **Orchestrator**: `/fabrizioduroni-blog-sdlc [description] [--fix] [--in-place]` — sequences the agents, hosts two
  human gates (plan approval, PR approval), and runs a bounded implement⇄review loop (max 3 rounds). Code only — it
  refuses content tasks and points at the writer agents. **Runs in an isolated worktree by default** (pass `--in-place`
  to run in the current tree); isolation is pipeline-level, never per-agent.
- **Feature mode**: explore → brainstorm (grilling) 🚪 → implement ⇄ review → PR 🚪.
- **Fix mode** (`--fix` or a pasted stack trace): investigate → confirm-root-cause 🚪 → implement ⇄ review → PR 🚪.
- **Autonomous mode** (`--autonomous --from-issue <N>`, Phase 2): reads GitHub issue `#N` as the contract and runs
  unattended — the `loop:ready` label + a pre-flight contract check replace the plan gate; it opens a PR and **never
  merges** (the human merge click is the async gate). Terminal state is a PR (`loop:review`) or `loop:blocked` with a
  reason. Task source for the session-bound `/loop` drainer (Phase 2 spec in `docs/agentic-sdlc/`).

Agent roster:

| Agent | Model | Role |
|-------|-------|------|
| `fabrizioduroni-explorer` | haiku | read-only map of the change area (files, reusable design-system surface, registration points, test surface) |
| `fabrizioduroni-implementer` | sonnet | writes code + tests, micro-commits, runs the mechanical gates (repurposed from the former senior-engineer) |
| `fabrizioduroni-code-reviewer` | opus | re-runs the gates to verify + reviews the diff against rules/plan; severity-classified findings |
| `fabrizioduroni-bug-investigator` | opus | fix-mode root-cause report from the codebase + git history (no Sentry/Jira) |
| `fabrizioduroni-e2e-sentinel` | sonnet | review-stage live-QA arm: drives agent-browser against the running app when UI/route/flow changed; findings fold into the review verdict |

Content agents are **separate** and unchanged: `fabrizioduroni-writer-engineer` (blog prose),
`fabrizioduroni-writer-dsa-engineer` (DSA articles).

**When to use what**: full pipeline for non-trivial code features/fixes; call `fabrizioduroni-implementer` **directly**
as a quick-path escape hatch for trivial, well-specified code changes; use the writer agents for content. Design spec
(temporary, while the pipeline is being built out): `docs/agentic-sdlc/`.

## Commit Convention

- Scopes: `performance`, `ux`, `capabilities`, `content`, `ai`, `deps`
- Conventional commits with Gitmoji convention
