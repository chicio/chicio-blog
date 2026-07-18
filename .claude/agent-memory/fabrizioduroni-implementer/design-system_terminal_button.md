---
name: design-system_terminal_button
description: TerminalButton polymorphic molecule (link mode vs action mode) replaced TerminalLink 2026-07-18
type: project
---

`src/components/design-system/molecules/buttons/terminal-button/` — presentational molecule (no store, like the
`TerminalLink` it replaced), produces the terminal-CTA look (`> label▮` inside the `Button` glow box) and works as
BOTH a navigation link and an action button, branching on whether `to` is passed:

```ts
interface TerminalButtonProps {
    label: string;
    to?: string;        // link mode when present: Button > InternalLink > span
    onClick?: () => void;
    className?: string;
    ariaExpanded?: boolean; // action mode only: maps to aria-expanded on the real <button>
}
```

- Link mode (`to` set): `Button` wraps `InternalLink` wraps the `> {label}<Cursor/>` span — identical markup to the
  old `TerminalLink`.
- Action mode (`to` omitted): `Button` renders a real `<button>` directly with `onClick`/`aria-expanded` — used by
  the Easter Egg Hunt `EggCard` reveal/hide toggle (previously hand-rolled with a bare `Button` + span, duplicating
  the terminal look).
- Callers: `post-card.tsx` ("Read more"), `console-card.tsx` ("See more") — both link mode; `egg-card.tsx`
  (reveal/hide) — action mode.
- The old `terminal-link/` folder was deleted outright (not deprecated) since it had exactly the 2 link-mode callers,
  both trivially portable to `to=`.

If a future presentational terminal-styled CTA needs the same look, reach for `TerminalButton` first — do not
hand-roll `Button` + `<span className="font-mono text-lg text-shadow-sm">{">"} {label}<Cursor/></span>` again.
