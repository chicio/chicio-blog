---
name: recharts-legend-text-color
description: recharts Legend text color must be set via labelStyle (or a per-item formatter), never wrapperStyle
metadata:
  type: feedback
---

When reviewing a chart that themes its recharts `<Legend>` text color, the correct prop is
`labelStyle={{ color }}` (or a per-item `formatter` returning a styled span) — NOT `wrapperStyle={{ color }}`.

**Why:** In recharts 3.x `DefaultLegendContent` renders each item text as
`<span className="recharts-legend-item-text" style={finalLabelStyle}>` where
`finalLabelStyle.color = labelStyle.color || entry.color`. So an explicit per-series `entry.color`
(the series stroke/fill) is applied inline to each label span and overrides any inherited color from
`wrapperStyle`'s outer div. `labelStyle.color`, when set, wins over `entry.color`. `<Legend>` forwards
`labelStyle` through `LegendContent` to `DefaultLegendContent`, so `<Legend labelStyle={{ color }} />`
does reach the text spans.

**How to apply:** If a diff themes legend text via `wrapperStyle`, the text will still render in the
series color, not the theme color — flag it. `labelStyle` is the correct approach and is verified working.
Related: chart-theme lives in `src/types/configuration/chart-theme.ts` and must never be value-imported by
`src/components/design-system/**` (design-system may only type-import from types/).
