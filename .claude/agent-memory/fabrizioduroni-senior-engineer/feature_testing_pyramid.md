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
- `@vitejs/plugin-react` v6 — `babel` and `presets` options were REMOVED in v6. Use plain `react()` — no `reactCompilerPreset`. React Compiler is a Next.js build-time optimization only; it is not replicated in the test transform.
- `react` and `react-dom` BOTH pinned to `19.2.6` in package.json — RTL needs them on the same version. They were mismatched (react 19.2.5 / react-dom 19.2.6) on main; align UP to the higher patch, NEVER downgrade (Fabrizio's review rule on PR #395)
- `@testing-library/dom` needed as a separate devDependency (not pulled automatically by @testing-library/react v16)
- `vi.hoisted()` required for any mock that references a variable declared BEFORE `vi.mock()` — the hoisting issue bites with `const mockFn = vi.fn(); vi.mock("module", () => ({ fn: mockFn }))` — must use `vi.hoisted()` instead
- `mockResolvedValue` (default) + `mockResolvedValueOnce` (queue) conflict: if `beforeEach` sets `mockResolvedValue(x)` and the test adds `mockResolvedValueOnce` values, the behavior is unreliable. Set each test's mocks fully within the test body instead.
- Consents lib test: uses `localStorage` → must run in `jsdom` project, not `node`
- `vitest.config.ts` and `playwright.config.ts` excluded from `tsconfig.json` (Next.js TypeScript checker picks them up otherwise)
- `playwright-report/` and `test-results/` added to `.gitignore`
- `@testing-library/jest-dom` — use `/vitest` entrypoint in `vitest.setup.ts`: `import "@testing-library/jest-dom/vitest"`. The plain `/jest-dom` entrypoint does NOT augment Vitest's `Assertion<T>` type.

**tsconfig.typecheck.json — scope to test surface only (CRITICAL):**
Do NOT use blanket `**/*.ts` or `**/*.tsx` includes. Those pull in `src/content/home/technology.ts` and `timeline.ts` which import `.png`/`.jpg` files whose types come from `next-env.d.ts` — a file generated only by `next build`, absent in clean CI. The include must enumerate test files explicitly: `src/**/*.test.ts`, `src/**/*.test.tsx`, `src/**/*.spec.ts`, `src/**/*.spec.tsx`, `e2e/**/*.ts`, plus the three config files. Never add `next-env.d.ts` to the typecheck project's include.

**Playwright locator rules:**
- Strict mode: `getByText(regex)` fails if it resolves to 2+ elements. Use exact text strings (e.g., `getByText("Form incomplete")`) or add `.first()`.
- The Menu organism (`src/components/design-system/organism/menu/menu.tsx`) uses `MotionDiv` (a `div`), not a semantic `<nav>` element. `getByRole("navigation")` returns nothing. Test menu presence via known link text: `getByRole("link", { name: /home/i }).first()`.

**CI shape:** lint+knip+validate-arch+typecheck+**test** all gate build; **e2e** runs after build. E2E needs no third-party secrets (externals mocked via page.route()). In CI, e2e passes UPSTASH/RESEND secrets to the webServer build.

**Pre-push hook:** `.husky/pre-push` runs `validate-architecture`, `typecheck`, then `test:run`. E2E NOT in pre-push.

**Tooling exemptions:** ESLint ignores `*.test.*`, `*.spec.*`, `e2e/**`, config files. knip uses `e2e/**` as entry, `vitest.config.ts/setup.ts/playwright.config.ts` auto-detected. depcruiser excludes `\.(test|spec)\.(ts|tsx)$`.

**How to apply:** When adding new tests, follow the node/jsdom split. Use `vi.hoisted()` for mocks. Set mocks per-test, not in beforeEach when using mockResolvedValueOnce. Always verify `npm run typecheck` from a clean state (`rm -f next-env.d.ts && rm -rf .next`).
