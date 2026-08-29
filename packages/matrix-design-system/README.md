# matrix-design-system

A Matrix-inspired React design system: green on near-black, Open Sans for prose, Courier Prime for
anything terminal-flavoured. Every component here is a real component from
[fabrizioduroni.it](https://www.fabrizioduroni.it).

## Install

```bash
npm install matrix-design-system
```

`react` and `react-dom` are peer dependencies. A few components need an optional peer as well —
`recharts` for the charts, `cmdk` for the command palette, `matrix-rain-webgpu` for the rain effect,
and the `react-markdown` + remark/rehype stack for `Markdown`. Install only what you use.

## Use

```tsx
import { Accordion, Chip, SectionHeading, StatCard } from "matrix-design-system";
import "matrix-design-system/styles.css";
```

The stylesheet must be imported after Tailwind:

```css
@import "tailwindcss";
@import "matrix-design-system/styles.css";
```

**The page surface must be dark.** The stylesheet sets `html body` to `#001100` on `#E8FFE8`; most
components are near-invisible on white.

## Styling

Style your own layout with Tailwind utilities — they resolve against this theme, so use its names
rather than stock Tailwind colours:

| Family | Names |
|---|---|
| Brand | `primary` (#00FF41), `primary-dark`, `secondary`, `accent` (#39FF14) |
| Surfaces | `general-background` (#001100), `general-background-light`, `black`, `white` |
| Text | `primary-text` (#E8FFE8), `secondary-text`, `text-above-primary` |
| Fonts | `font-sans` → Open Sans · `font-mono` → Courier Prime |

**The breakpoint scale is overridden**: `xs` 576 · `sm` 768 · `md` 992 · `lg` 1200 · `xl` 1600 ·
`2xl` 2000 (px). So `md:` starts at 992px, not 768px — the most common way a layout built with this
theme behaves differently from expected.

Composed classes worth reaching for: `.glassmorphism` (and `-lite`, `-no-scale`), `.glow-border`,
`.glow-container`, `.pill`, `.call-to-action`, `.container-fixed`.

Fonts are not bundled: load Open Sans and Courier Prime yourself.

## Framework-agnostic by design

The package imports nothing from any framework. Where a component needs framework behaviour it takes
it as a prop, with a working default:

```tsx
import NextLink from "next/link";
import NextImage from "next/image";

<InternalLink to="/blog" linkComponent={NextLink}>Blog</InternalLink>
<ImageGlow src={photo} alt="" imageComponent={NextImage} />
<Menu currentPath={usePathname()} navHrefs={...} linkComponent={NextLink} />
```

Without them you get a real `<a>` and a real `<img>` — `PlainImage` reproduces `next/image`'s
`fill`, placeholder and lazy-loading behaviour — so the components work anywhere, just without
client-side routing or image optimisation.

## No provider required

There is no theme or context provider to wrap anything in. Components read their styling from CSS
custom properties, and the two global preferences (motion, glassmorphism variant) come from
`localStorage` with sensible defaults.

## License

MIT © Fabrizio Duroni
