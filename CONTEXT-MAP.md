# Context Map

## Contexts

- [Website](./apps/website/CONTEXT.md): Fabrizio Duroni's personal site, its content (posts, the DSA course, the videogame
  collection, art) and the interactive layer around it (chat, terminal, easter eggs)
- [Matrix Design System](./packages/matrix-design-system/CONTEXT.md): the published, framework-agnostic Matrix-themed UI
  library, together with the component-store contract (`packages/matrix-component-store`) and the rules that enforce it
  (`packages/eslint-plugin-chicio`); its showcase is `apps/matrix-design-system-showcase`
- [Matrix Rain](./packages/matrix-rain-webgpu/CONTEXT.md): the published WebGPU digital-rain background effect; its
  showcase is `apps/matrix-rain-showcase`

## Relationships

- **Website → Matrix Design System**: the Website renders the design system through its own Next bindings, injecting
  links, images, the current path and the site's branding; the design system knows nothing about the Website
- **Website → Matrix Rain**: the Website mounts the rain as its page background and exposes its settings to the visitor
- **Matrix Design System ↔ Matrix Rain**: independent; neither imports the other
