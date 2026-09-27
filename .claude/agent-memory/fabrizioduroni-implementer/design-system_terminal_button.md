---
name: design-system_terminal_button
description: TerminalButton polymorphic molecule (link mode vs action mode) replaced TerminalLink 2026-07-18
type: project
---

`packages/matrix-design-system/src/molecules/buttons/terminal-button/` — Presentational Component molecule (no store, like the
`TerminalLink` it replaced), produces the terminal-CTA look (`> label▮` inside the `Button` glow box) and works as
BOTH a navigation link and an action button, branching on whether `to` is passed:

```ts
interface TerminalButtonProps {
    label: string;
    to?: string;        // link mode when present: Button > link > span
    onClick?: () => void;
    className?: string;
    ariaExpanded?: boolean; // action mode only: maps to aria-expanded on the real <button>
    linkComponent?: LinkComponent; // injected by the Website's Binding
}
```

The Website never imports it from `matrix-design-system` directly: it uses the Binding
`apps/website/src/components/features/design-system-next/terminal-button/`, which injects `linkComponent={NextLink}`.

- Link mode (`to` set): `Button` wraps the injected link component wrapping the `> {label}<Cursor/>` span — identical markup to the
  old `TerminalLink`.
- Action mode (`to` omitted): `Button` renders a real `<button>` directly with `onClick`/`aria-expanded` — used by
  the Easter Egg Hunt `EggCard` reveal/hide toggle (previously hand-rolled with a bare `Button` + span, duplicating
  the terminal look).
- Callers (verified 2026-09-27): `post-card.tsx` ("Read more"), `console-card.tsx` ("See more") — both link mode;
  `easter-eggs/egg-solution/egg-solution.tsx` (Reveal/Hide toggle and "Replay" on a Found egg) — action mode. The
  reveal toggle originally lived in `egg-card.tsx`.
- The old `terminal-link/` folder was deleted outright (not deprecated) since it had exactly the 2 link-mode callers,
  both trivially portable to `to=`.

If a future presentational terminal-styled CTA needs the same look, reach for `TerminalButton` first — do not
hand-roll `Button` + `<span className="font-mono text-lg text-shadow-sm">{">"} {label}<Cursor/></span>` again.

**Color bug fixed 2026-07-18**: the `Button` atom applies `text-primary-text` (white), and neither label span
overrode it — so both modes rendered white instead of Matrix green. Both spans now also carry `text-accent`
(link mode: `"text-shadow-sm text-accent"`; action mode: `"font-mono text-lg text-shadow-sm text-accent"`). This
fixed the reveal/hide CTA and, since they share this component, `post-card`'s "Read more" and `console-card`'s
"See more" too. If a future consumer needs a different color, override via the label span, not `className` (which
targets the outer `Button`/`w-fit` container, not the text span).
