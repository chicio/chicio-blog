---
always: true
---

# Code Style

- **Indentation**: 4 spaces (not tabs)
- **Line length**: 120 characters max
- **Braces**: Always use curly braces on `if` statements, never one-liners (e.g., `if (cond) { doSomething(); }`, not `if (cond) doSomething();`)
- **Import alias**: Use `@/` for imports (maps to `src/` via `tsconfig.json`)
- **Export style**: Use named exports for all modules, avoid default exports if possible/not strictly needed
- **Prettier**: Configured in `.prettierrc` with Tailwind plugin
- **ESLint**: Extends Next.js core-web-vitals and TypeScript configs
- **TypeScript**: Strict mode enabled. All shared types in `src/types/`
- **Commits**: Conventional commits with Gitmoji convention. Scopes: `performance`, `ux`, `capabilities`, `content`, `ai`, `deps`
- **Comments**: No decorative or structural comments. Never use section dividers like `{/* ── Title ── */}`, `// ─── section ───`, `// ---`, or any comment whose only purpose is visual separation. Code structure must be self-evident from component and variable names alone.

## Component-Store Model

All UI components follow the component-store model. See `.claude/rules/component-architecture.md` for the full specification.

Key rules that affect everyday coding:

- **One hook per component file**: a `.tsx` component file may call exactly one hook — its own `use<Name>Store()`. Exception: `useGlassmorphism` is permanently allowed.
- **No functions in JSX**: `react/jsx-no-bind` is enforced at error. Curry parameterized handlers in the store; destructure `effects` before the `return`.
- **Store return typing**: use named types from `@/types/component-store` — `StateStore<S>`, `EffectsStore<E>`, or `ComponentStore<S,E>`. Never pad an empty half with `Record<string,never>` or `{}`.
- **Store contract**: the component destructures only the half the store returns (`const { state } = useMyStore()` for a `StateStore`, `const { state, effects } = useMyStore()` for a `ComponentStore`).
