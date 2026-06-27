---
always: true
---

# Testing Conventions

## Stack

| Layer | Tool | Purpose |
|---|---|---|
| Unit | Vitest (node project) | Pure lib functions — business logic, security, utilities |
| Component | Vitest (jsdom project) + React Testing Library | Design system components — render, interaction, accessibility |
| E2E | Playwright | Full-page flows with real production build + mocked external APIs |
| Live QA | agent-browser (local only) | Agent-driven a11y tree + click-through smoke walks |

Coverage: v8 provider, text + json-summary reporters. No threshold gate yet — add a ratchet in `vitest.config.ts` once the baseline is established.

## File Layout

Tests are co-located beside source files:

```
src/lib/chat/
    guardrails.ts
    guardrails.test.ts        <- unit (node project)

src/components/design-system/molecules/accordion/accordion/
    accordion.tsx
    accordion.test.tsx        <- component (jsdom project)
    use-accordion-store.ts
    (renderHook tests live in accordion.test.tsx)

e2e/
    homepage.spec.ts
    chat.spec.ts
    contact.spec.ts
```

## Vitest Projects

`vitest.config.ts` defines two projects that share the same react-compiler babel transform:

- **node** — `src/lib/**/*.test.ts` — environment: node
- **jsdom** — `src/components/**/*.test.tsx` and `src/components/**/*.test.ts` — environment: jsdom, globals: true, setup: `vitest.setup.ts`

The `@vitejs/plugin-react` v6 plugin is used via `react()` with no extra options. Note: v6 removed the `babel` and `presets` options from its `Options` interface; the `reactCompilerPreset` export is for use with `@rolldown/plugin-babel`, not for vitest. The React Compiler is a production optimization applied by Next.js at build time — it is not replicated in the test transform. Components that use hooks compile and render correctly in tests without it.

## What to Test at Each Layer

### Unit (lib/)

Security-sensitive and correctness-sensitive pure functions have the highest ROI:
- `src/lib/chat/guardrails.ts` — injection pattern matching, LLM gate mocking, fail-open paths
- `src/lib/rate-limit/rate-limit.ts` — throttle window, daily limit, counter increment, fail-open
- `src/lib/consents/consents.ts` — read/write localStorage wrapper, event dispatch
- `src/lib/seo/seo.ts` — metadata shape, structured data, date formatting, headline truncation
- `src/lib/content/search-index-factory.ts` — index creation, search by field, ref correctness

### Component (RTL + renderHook)

**Start in the design system** — it is self-contained and has no network or route dependencies. Seed atoms then molecules, then organisms only when cheap.

Thin components (no store, no side effects) get a render + interaction test. For molecules that have a `use-*-store.ts`, add one `renderHook` block in the same test file to cover store logic that the UI alone cannot trigger (complex state transitions, callbacks).

The component-store nuance: components are thin — the interesting logic is in the store. RTL render covers the integration; `renderHook` covers edge cases in store state.

Do NOT test `features/` or `content/` components without Next.js context — they require routing and server components. The design system is the correct starting point; climb outward only as context permits.

### E2E (Playwright)

Playwright runs against a **production build** (`next build && next start`). External APIs are ROUTE-MOCKED via `page.route()` — no real Groq, Upstash, or Resend calls, no secrets needed.

Committed specs:
1. `e2e/homepage.spec.ts` — homepage loads, navigation exists, /blog and /about-me routes work
2. `e2e/chat.spec.ts` — chat page loads, input visible, mocked stream response renders
3. `e2e/contact.spec.ts` — form validation errors appear, mocked success shows confirmation

## Loop Discipline

- **Bug fix** — strict red-green: write a failing test that reproduces the bug FIRST, then fix the code. Do not merge a fix without a test that would have caught it.
- **Feature** — tests required in the Verify phase. TDD is encouraged: author tests before or alongside implementation, not after.

## Local Commands

```bash
npm run test             # vitest watch (development)
npm run test:run         # vitest run once (CI-friendly)
npm run test:coverage    # vitest run --coverage (v8, prints text summary)
npm run test:e2e         # playwright test (builds prod first)
npm run test:e2e:ui      # playwright test --ui (interactive mode)
npm run typecheck        # tsc --noEmit via tsconfig.typecheck.json (covers src + tests + e2e + config)
```

## Typecheck Coverage

`tsconfig.typecheck.json` extends the main tsconfig and explicitly includes `**/*.test.*`, `e2e/**`, `vitest.config.ts`, `vitest.setup.ts`, and `playwright.config.ts`. It also adds `"vitest/globals"` to `types` so jest-dom matchers type-check correctly. The main `tsconfig.json` excludes these files to avoid confusing Next.js's Turbopack type-checker.

`npm run typecheck` is the authoritative type gate for the full repo. Vitest uses esbuild (no type-check); ESLint ignores test files; `next build` only type-checks src files. None of those catch test type errors — `typecheck` does.

## CI Shape

```
lint           -+
knip           -+
validate-arch  -+- typecheck -+- test -> build -> e2e
                              -+
```

- **typecheck** job: `npm run typecheck` — covers `src/**`, `**/*.test.*`, `e2e/**`, and config files. Zero errors required.
- **test** job: `npm run test:coverage` — prints coverage summary, no gate
- **e2e** job: runs after build, Playwright browsers cached, report uploaded as artifact; no third-party secrets needed (externals are mocked)

## Pre-Push Hook (.husky/pre-push)

```
npm run validate-architecture
npm run typecheck
npm run test:run
```

E2E is NOT in pre-push — the production build takes too long. Run `npm run test:e2e` manually before opening a PR that touches routing or API routes.

## Tooling Exemptions

All static analysis tools ignore test files:

- **ESLint** (`eslint.config.mjs`) — `**/*.test.ts`, `**/*.test.tsx`, `**/*.spec.ts`, `**/*.spec.tsx`, `e2e/**`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts` in `ignores`
- **knip** (`knip.json`) — `**/*.test.*` and `**/*.spec.*` in `ignore`; `e2e/**/*.ts`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts` in `entry`
- **dependency-cruiser** (`.dependency-cruiser.js`) — `\.(test|spec)\.(ts|tsx)$` in `options.exclude.path`

## Verification Checklist

When completing any change, run:

1. `npm run lint` — zero errors (CI enforces `--max-warnings 0`)
2. `npm run validate-architecture` — zero dependency-cruiser violations. Run after any structural/component change.
3. `npm run knip` — zero unused exports/dependencies
4. `npm run typecheck` — zero TypeScript errors across src, tests, e2e, and config files
5. `npm run test:run` — all Vitest tests green
6. `npm run build` — success
7. `npm run test:e2e` — all Playwright specs green (run when touching routing or API routes)
8. Manual browser check for UI/content changes

## Agent-Browser Live QA (local only)

`agent-browser` is a native Rust CDP CLI from vercel-labs. It is NOT a package.json dependency and NOT in CI. It is a local prerequisite for the agent performing live smoke walks.

### Install

```bash
# npm global (recommended for agents)
npm i -g agent-browser

# Homebrew
brew install vercel-labs/tap/agent-browser

# Cargo
cargo install agent-browser

# After install, install browser binaries:
agent-browser install
```

### Canonical smoke walkthrough

The following is the enforced QA pattern for agent-driven live checks. Run with the dev server (`npm run dev`) or a production build (`npm run build && npm start`) already running:

```bash
# 1. Open the homepage and snapshot the accessibility tree
agent-browser open http://localhost:3000 --snapshot a11y

# 2. Navigate to the blog listing and verify it loads
agent-browser navigate http://localhost:3000/blog --snapshot a11y

# 3. Navigate to the chat page
agent-browser navigate http://localhost:3000/chat --snapshot a11y

# 4. Navigate to the contact page and verify form fields exist
agent-browser navigate http://localhost:3000/contact --snapshot a11y

# 5. Navigate to about-me
agent-browser navigate http://localhost:3000/about-me --snapshot a11y
```

For each step: verify the a11y tree contains the expected landmark roles (`navigation`, `main`, `form` on contact). Flag any missing landmarks or broken aria attributes before claiming the page passes visual QA.
