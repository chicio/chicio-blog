# Testing Conventions

## Current Approach
- **No automated test suite** — this project relies on manual browser testing and build-time verification
- Verification is done via `npm run lint` (ESLint + Prettier) and `npm run build` (TypeScript strict mode + Next.js build)
- Visual correctness is checked manually in the browser

## What NOT to Do
- Do not add test frameworks (Jest, Vitest, Playwright, etc.) unless explicitly requested
- Do not create `*.test.ts`, `*.spec.ts`, or `__tests__/` directories
- Do not add testing-related dependencies to `package.json`
- Do not generate test boilerplate or scaffolding alongside new code

## Verification Checklist
When completing any change, run:
1. `npm run lint` — zero errors
2. `npm run build` — success
3. Manual browser check for UI/content changes
