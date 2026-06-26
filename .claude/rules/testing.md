---
always: true
---

# Testing Conventions

## Current Approach
- **No automated test suite** — this project relies on manual browser testing and build-time verification
- Verification is done via `npm run lint` (ESLint + Prettier), `npm run validate-architecture` (dependency-cruiser: component-store layering & boundaries), and `npm run build` (TypeScript strict mode + Next.js build)
- Visual correctness is checked manually in the browser

## What NOT to Do
- Do not add test frameworks (Jest, Vitest, Playwright, etc.) unless explicitly requested
- Do not create `*.test.ts`, `*.spec.ts`, or `__tests__/` directories
- Do not add testing-related dependencies to `package.json`
- Do not generate test boilerplate or scaffolding alongside new code

## Verification Checklist
When completing any change, run:
1. `npm run lint` — zero errors (CI enforces `--max-warnings 0`)
2. `npm run validate-architecture` — zero dependency-cruiser violations. Run it after any structural/component change. It also runs automatically on `git push` (`.githooks/pre-push`) and as a dedicated CI job; it is NOT part of the build anymore.
3. `npm run build` — success
4. Manual browser check for UI/content changes
