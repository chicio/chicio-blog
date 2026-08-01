## Working with this design system

A Matrix-inspired system: green on near-black, Open Sans for prose, Courier Prime for anything
terminal-flavoured. Every component here is a real React component from the site at
fabrizioduroni.it — compose them, don't reimplement them.

### No provider required

There is no theme/context provider to wrap anything in. Components read their styling from CSS custom
properties on the page, so a component works as soon as `styles.css` is loaded. Two globals exist but
neither needs setup: motion preference and glassmorphism variant are read from `localStorage` with
sensible defaults.

**The one thing that must be right: the page surface is dark.** `styles.css` sets
`html body { background-color: var(--color-general-background); color: var(--color-primary-text); }`
(#001100 / #E8FFE8). Do not put these components on a white background — most of them are near-invisible
on one.

### The styling idiom: Tailwind v4 utilities over a custom theme

Style your own layout with Tailwind utility classes. They resolve against this theme, so use these
names rather than stock Tailwind colours:

| Family | Real names |
|---|---|
| Brand colour | `primary` (#00FF41), `primary-dark`, `secondary`, `accent` (#39FF14) |
| Surfaces | `general-background` (#001100), `general-background-light` (#002200), `black`, `white` |
| Text | `primary-text` (#E8FFE8), `secondary-text`, `text-above-primary` |
| Semantic | `confirm`, `undo`, `amber-500`, `red-400`, `red-500`, `green-500`, `yellow-400` |
| Alpha variants | `accent-alpha-{10,15,25,40,50,70}`, `confirm-alpha-{20,25,60}`, `undo-alpha-{20,25,60}`, `black-alpha-75`, `general-background-alpha-60`, `primary-alpha-0` |
| Fonts | `font-sans` → Open Sans · `font-mono` → Courier Prime |

Used as `bg-general-background`, `text-accent`, `border-accent-alpha-25`, `font-mono`, and so on.

**The breakpoint scale is overridden — do not assume Tailwind defaults:**

`xs` 576 · `sm` 768 · `md` 992 · `lg` 1200 · `xl` 1600 · `2xl` 2000 (px)

So `md:` starts at 992px, not 768px, and `xl:` at 1600px, not 1280px. Getting this wrong is the most
common way a layout built here behaves differently from the real site.

### Composed classes worth reaching for

- `.glassmorphism` — blurred translucent panel with an accent border; hover-scales.
  `.glassmorphism-lite` is the solid, motion-safe variant, `.glassmorphism-no-scale` /
  `.glassmorphism-lite-no-scale` drop the hover scale.
- `.glow-border`, `.glow-container` — accent border with the signature green glow.
- `.pill`, `.pill-red`, `.pill-blue`, `.pill-label`, `.pill-no-reflection` — the Matrix pill motif.
- `.call-to-action` — prominent action button.
- `.container-fixed` (page column, caps at 960px), `.container-section`, `.container-fluid`,
  `.container-fullscreen`.

### Where the truth lives

Read the real files before styling — they beat any summary. `styles.css` and its `@import` closure
carry every token and composed class above. Each component has a `<Name>.d.ts` (its exact props) and a
`<Name>.prompt.md` (usage) beside it; read those before guessing at an API. Where a `.d.ts` shows only
an index signature, the component takes children and little else.

### An idiomatic composition

```jsx
<section className="container-fixed flex flex-col gap-6 py-8">
  <SectionHeading title="Latest posts" description="Long-form writing on iOS, web and graphics." />

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <StatCard value={96} label="Articles" />
    <StatCard value={287} label="DSA lessons" />
    <StatCard value="12k" label="Monthly readers" />
  </div>

  <Accordion title="What is this?" defaultOpen>
    <p className="text-primary-text">
      Composed from the design system: <Chip>real components</Chip> for the parts,
      theme utilities for the layout around them.
    </p>
  </Accordion>
</section>
```

Note the split: library components carry the look, and your own layout glue uses the theme's utility
names (`container-fixed`, `gap-6`, `md:grid-cols-3`, `text-primary-text`) — never hardcoded hex values.
