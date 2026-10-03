# Website

The source of [fabrizioduroni.it](https://www.fabrizioduroni.it), one of the Lab Projects of
[Chicio Labs](../../README.md): a Next.js 16 App Router site with MDX content, an AI chat, an in-page terminal and a few
easter eggs. It deploys to Vercel from `main`.

Run every command from the repository root (see the root README); to target this workspace only, add
`--workspace=website`.

## Why the design system is a package

It imports nothing from Next, or from any framework. Where a component needs framework behaviour it
takes it as a prop with a working default: `linkComponent` falls back to a real `<a>`,
`imageComponent` to a real `<img>` that reproduces `next/image`'s `fill`, placeholder and lazy
loading. The site injects the Next versions through `apps/website/src/components/features/design-system-next/`.
A dependency-cruiser rule fails the build on any `next` import inside the package.
