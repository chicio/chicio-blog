---
name: feature-testing-pyramid
description: Full testing pyramid (Vitest+RTL unit/component, Playwright e2e, agent-browser QA) introduced in PR #395
metadata:
  type: project
---

Introduced the full three-layer testing pyramid in PR #395 (feat/capabilities-testing-pyramid).

**Why:** Project had no automated test suite. Harness-first delivery: capability > coverage.

**Stack decisions:**
- Vitest v4 with two `projects` in `apps/website/vitest.config.ts`: `node` for `src/lib/**`, `src/app/**` and `src/*.test.ts`
  (browser-storage lib tests such as consents, local-storage, easter-eggs/spoon-activation are excluded there and run in
  `jsdom`), `jsdom` for components. The design system now has its own `packages/matrix-design-system/vitest.config.ts`
- `@vitejs/plugin-react` v6 — `babel` and `presets` options were REMOVED in v6. Use plain `react()` — no `reactCompilerPreset`. React Compiler is a Next.js build-time optimization only; it is not replicated in the test transform.
- `react` and `react-dom` BOTH pinned to the same exact version (19.3.0 as of 2026-09-27, in root and
  `apps/website/package.json`, with root `overrides` `"$react"`/`"$react-dom"`) — RTL needs them on the same version.
  They were once mismatched (react 19.2.5 / react-dom 19.2.6) on main; align UP to the higher patch, NEVER downgrade (Fabrizio's review rule on PR #395)
- `@testing-library/dom` needed as a separate devDependency (not pulled automatically by @testing-library/react v16)
- `vi.hoisted()` required for any mock that references a variable declared BEFORE `vi.mock()` — the hoisting issue bites with `const mockFn = vi.fn(); vi.mock("module", () => ({ fn: mockFn }))` — must use `vi.hoisted()` instead
- `mockResolvedValue` (default) + `mockResolvedValueOnce` (queue) conflict: if `beforeEach` sets `mockResolvedValue(x)` and the test adds `mockResolvedValueOnce` values, the behavior is unreliable. Set each test's mocks fully within the test body instead.
- Consents lib test: uses `localStorage` → must run in `jsdom` project, not `node`
- (superseded by the single-tsconfig consolidation below: config files are now INCLUDED)
- `playwright-report/` and `test-results/` added to `.gitignore`
- `@testing-library/jest-dom` — use `/vitest` entrypoint in `vitest.setup.ts`: `import "@testing-library/jest-dom/vitest"`. The plain `/jest-dom` entrypoint does NOT augment Vitest's `Assertion<T>` type.

**SINGLE tsconfig.json (CONSOLIDATED 2026-06-28 — superseded the old two-config split):**
There is now ONE `tsconfig.json` used by editor + `next build` + `npm run typecheck` (`tsc --noEmit`). `tsconfig.typecheck.json` was DELETED — do NOT recreate it. Key: `types` includes `vitest/globals` (test globals + jest-dom matcher augmentation via `vitest.setup.ts`, which is in the program) and `next/image-types/global` (so `.png`/`.jpg` imports resolve in clean CI without a generated `next-env.d.ts`). `exclude` is `node_modules`, `agent` and `src/app/sw.ts` — test/e2e/config files are INCLUDED. The two-config split caused editor-vs-CI drift (357 false jest-dom matcher errors in VS Code); the single config keeps editor == CI green. Trade-off accepted: vitest globals are type-visible in app source.

**Playwright locator rules:**
- Strict mode: `getByText(regex)` fails if it resolves to 2+ elements. Use exact text strings (e.g., `getByText("Form incomplete")`) or add `.first()`.
- The Menu organism (`packages/matrix-design-system/src/organism/menu/menu.tsx`) uses `MotionDiv` (a `div`), not a semantic `<nav>` element. `getByRole("navigation")` returns nothing. Test menu presence via known link text: `getByRole("link", { name: /home/i }).first()`.

**CI shape:** lint+format+knip+validate-arch+typecheck+**test**+verify-packages all gate build (see [[project_ci_pipeline]]); **e2e** runs after build. E2E needs no third-party secrets (externals mocked via page.route()). In CI, e2e passes UPSTASH/RESEND secrets to the webServer build.

**Pre-push hook:** `.husky/pre-push` runs `validate-architecture`, `typecheck`, then `test:run`. E2E NOT in pre-push.

**Tooling exemptions:** ESLint ignores `*.test.*`, `*.spec.*`, `apps/website/e2e/**`, config files. knip uses `apps/website/e2e/**` as entry, `vitest.config.ts/setup.ts/playwright.config.ts` auto-detected. depcruiser excludes `\.(test|spec)\.(ts|tsx)$`.

**How to apply:** When adding new tests, follow the node/jsdom split. Use `vi.hoisted()` for mocks. Set mocks per-test, not in beforeEach when using mockResolvedValueOnce. Always verify `npm run typecheck` from a clean state (`rm -f next-env.d.ts && rm -rf .next`).
