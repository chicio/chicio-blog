# [fabrizioduroni.it](https://www.fabrizioduroni.it)

[![CI](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/chicio/chicio-blog/blob/main/LICENSE.md)
[![Status](https://img.shields.io/badge/Status-Ok-green.svg)](https://stats.uptimerobot.com/H8Am1Ay0Vd)

[![Typecheck](https://img.shields.io/badge/Typecheck-tsc%20--noEmit-3178C6?logo=typescript&logoColor=white)](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml)
[![Unit & Component](https://img.shields.io/badge/Unit%20%26%20Component-Vitest%20%2B%20RTL-6E9F18?logo=vitest&logoColor=white)](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml)
[![E2E](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)](https://github.com/chicio/chicio-blog/actions/workflows/ci.yml)

My personal website, and the Matrix-inspired design system it is built from.

![Fabrizio duroni blog](https://github.com/chicio/chicio-blog/blob/main/apps/website/public/chicio-coding-feature-graphic.png?raw=true)

***

## Repository structure

An npm-workspaces monorepo orchestrated by [Turborepo](https://turborepo.com).

| Workspace | What it is |
|---|---|
| [`apps/website`](apps/website) | The site: Next.js 16 App Router, MDX content, an AI chat, an in-page terminal and a few easter eggs |
| [`packages/matrix-design-system`](packages/matrix-design-system) | The design system, published to npm. Framework-agnostic React components plus their stylesheet |
| [`packages/matrix-component-store`](packages/matrix-component-store) | The `ComponentStore` / `StateStore` / `EffectsStore` contract every component's store hook returns |
| [`packages/eslint-plugin-chicio`](packages/eslint-plugin-chicio) | The lint rules enforcing that contract, shared by both workspaces |

The website depends on the design system by version, and npm resolves that to the workspace copy —
so the site always builds against local source, while the package stays publishable for anyone else.

### Why the design system is a package

It imports nothing from Next, or from any framework. Where a component needs framework behaviour it
takes it as a prop with a working default: `linkComponent` falls back to a real `<a>`,
`imageComponent` to a real `<img>` that reproduces `next/image`'s `fill`, placeholder and lazy
loading. The site injects the Next versions through `apps/website/src/components/features/design-system-next/`.
A dependency-cruiser rule fails the build on any `next` import inside the package.

## Development

Every command runs from the repository root and fans out across the workspaces through Turborepo.

```bash
npm install              # install every workspace
npm run dev              # dev server (also generates the search index and copies content images)
npm run build && npm start  # production build
npm run release          # release with conventional changelog
```

Quality gates, all of which run in CI:

```bash
npm run lint                   # ESLint (--max-warnings 0 in CI)
npm run knip                   # unused exports and dependencies
npm run typecheck              # tsc --noEmit across src, tests, e2e and config
npm run validate-architecture  # dependency-cruiser: layering, isolation, framework boundaries
npm run test:run               # Vitest: unit + component
npm run test:e2e               # Playwright, against a production build
npm run format                 # Prettier (4 spaces, 120 columns)
```

To run something in a single workspace:

```bash
npm run test:run --workspace=website
npm run build --workspace=matrix-design-system
```

## License

MIT © Fabrizio Duroni
