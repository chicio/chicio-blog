# Code Style

- **Indentation**: 4 spaces (not tabs)
- **Line length**: 120 characters max
- **Braces**: Always use curly braces on `if` statements, never one-liners (e.g., `if (cond) { doSomething(); }`, not `if (cond) doSomething();`)
- **Import alias**: Use `@/` for imports (maps to `src/` via `tsconfig.json`)
- **Prettier**: Configured in `.prettierrc` with Tailwind plugin
- **ESLint**: Extends Next.js core-web-vitals and TypeScript configs
- **TypeScript**: Strict mode enabled. All shared types in `src/types/`
- **Commits**: Conventional commits with Gitmoji convention. Scopes: `performance`, `ux`, `capabilities`, `content`, `ai`, `deps`
