---
name: feature-testing-pyramid
description: Full testing pyramid (Vitest+RTL unit/component, Playwright e2e, agent-browser QA) introduced in PR #395
metadata:
  type: project
---

Introduced the full three-layer testing pyramid in PR #395 (feat/capabilities-testing-pyramid).

**Why:** Project had no automated test suite. Harness-first delivery: capability > coverage.

**Stack decisions:**
- Vitest v4 with two `projects`: `node` for `src/lib/**`, `jsdom` for design-system components
- `@vitejs/plugin-react` v6 — `babel` option REMOVED in v6; use `reactCompilerPreset` from the package instead of `babel.plugins`
- React Compiler applied via `reactCompilerPreset({ target: "19" })` to match prod behaviour
- `react-dom` pinned to `19.2.5` (matching `react`) in package.json dependencies — they were mismatched (19.2.5 vs 19.2.6) causing RTL errors
- `@testing-library/dom` needed as a separate devDependency (not pulled automatically by @testing-library/react v16)
- `vi.hoisted()` required for any mock that references a variable declared BEFORE `vi.mock()` — the hoisting issue bites with `const mockFn = vi.fn(); vi.mock("module", () => ({ fn: mockFn }))` — must use `vi.hoisted()` instead
- `mockResolvedValue` (default) + `mockResolvedValueOnce` (queue) conflict: if `beforeEach` sets `mockResolvedValue(x)` and the test adds `mockResolvedValueOnce` values, the behavior is unreliable. Set each test's mocks fully within the test body instead.
- Consents lib test: uses `localStorage` → must run in `jsdom` project, not `node`
- `vitest.config.ts` and `playwright.config.ts` excluded from `tsconfig.json` (Next.js TypeScript checker picks them up otherwise)
- `playwright-report/` and `test-results/` added to `.gitignore`

**CI shape:** lint+knip+validate-arch+**test** all gate build; **e2e** runs after build. E2E needs no third-party secrets (externals mocked via page.route()). In CI, e2e passes UPSTASH/RESEND secrets to the webServer build.

**Pre-push hook:** `.husky/pre-push` runs `validate-architecture` then `test:run`. E2E NOT in pre-push.

**Tooling exemptions:** ESLint ignores `*.test.*`, `*.spec.*`, `e2e/**`, config files. knip uses `e2e/**` as entry, `vitest.config.ts/setup.ts/playwright.config.ts` auto-detected. depcruiser excludes `\.(test|spec)\.(ts|tsx)$`.

**How to apply:** When adding new tests, follow the node/jsdom split. Use `vi.hoisted()` for mocks. Set mocks per-test, not in beforeEach when using mockResolvedValueOnce.
