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

All UI components follow the component-store model — the full contract is in `.claude/rules/component-architecture.md` (loads automatically on component work). The two rules that bite most often in everyday coding: a component `.tsx` file calls exactly one hook (its own `use<Name>Store()`; `useGlassmorphism` is the permanent exception), and no functions in JSX (`react/jsx-no-bind` at error — curry parameterized handlers in the store).
