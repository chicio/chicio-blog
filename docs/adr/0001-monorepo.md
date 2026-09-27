# One monorepo, with packages consumed through their built output

The site, the Matrix Design System and Matrix Rain live in one npm-workspaces repository orchestrated by Turborepo,
rather than in a single app or in separate repositories. The intent is partly educational: building publishable
packages next to the product that uses them is the point, so the extra machinery is accepted as the cost of learning
it.

The website depends on each package by version (`"matrix-design-system": "^1.0.0"`), npm resolves that to the workspace
copy, and it reads the package's built `dist/`, not its source. So the site always runs against local changes, while
the packages stay installable exactly as an outside consumer would install them. The price is that every task that
runs or builds the site depends on the packages' `build` (`^build` in `turbo.json`), and `npm run dev` runs each
package's `tsdown --watch` alongside the dev server.

## Considered Options

- **A single app with the design system as a folder**: what the repository was before. Simplest, but nothing proved
  the design system could live outside the site, and it could not be published.
- **Separate repositories**: real isolation, but every design-system change would need a publish and a bump before the
  site could see it.
- **Workspace packages resolved from source**: faster feedback, but the site would no longer exercise what consumers
  actually install, which is how a missing `@source` directive once shipped every component unstyled.

## Consequences

- The Next Bindings stay in the website (`apps/website/src/components/features/design-system-next/`), not in a
  package: the goal is a framework-agnostic design system, not shared Next glue.
- A packaging smoke test (`npm pack`, publint, attw, install into a throwaway app) guards what workspace linking
  cannot see.
