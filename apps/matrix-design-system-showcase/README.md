# matrix-design-system-showcase

Storybook for `matrix-design-system`, deployed to GitHub Pages.

```bash
npm run dev --workspace=matrix-design-system-showcase     # http://localhost:6006
npm run build --workspace=matrix-design-system-showcase   # static build into dist/
```

## Where the stories live

Not here. They sit beside the components they document, inside
`packages/matrix-design-system/src/**/*.stories.tsx`, and this app globs across the workspace to
collect them. Colocation is what keeps a story honest when its component changes, and it is the
single source of truth the Claude Design sync reads from too.

This app owns only the Storybook toolchain and the deployment. That keeps the split the monorepo
uses everywhere else: `packages/` publishes to npm, `apps/` deploys to a URL.

## Styling

`src/styles.css` is exactly what the package's README tells a consumer to write:

```css
@import "tailwindcss";
@import "matrix-design-system/styles.css";
```

A showcase that styles components in a way real consumers cannot reproduce is worth nothing, so
resist adding anything else here.

## Base path

`STORYBOOK_BASE_PATH` is baked in at build time because Storybook emits absolute asset paths. It is
`/` locally and `/chicio-blog/design-system/` on Pages, where this sits beside the matrix-rain
showcase under one landing page.
