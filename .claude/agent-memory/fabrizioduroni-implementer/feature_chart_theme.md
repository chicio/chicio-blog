---
name: feature_chart_theme
description: Shared chart-theme module unifying blog-stats and DSA recharts/SVG visualizer styling
type: project
---

`src/types/configuration/chart-theme.ts` (added 2026-07) is the single source of truth for chart styling shared
by `content/blog/blog-stats/**` and `content/data-structures-and-algorithms/**` — the only legal placement, since
content-page-isolation forbids the two page folders importing each other, and design-system may only type-import
from `types/`. Shape (flat, `as const`, constants only, no functions):

```ts
export const chartTheme = {
    axis: { tickColor: "#9fbf9f", tickFontSize: 12, lineColor: "#1f5a2e" },
    cursorFill: "#39FF141a",     // bar-chart Tooltip cursor
    cursorStroke: "#39FF1466",   // line/scatter-chart Tooltip cursor (pair with strokeWidth: 1 inline)
    gridStroke: "#1f5a2e",       // CartesianGrid stroke (time-space-tradeoff scatter only; no other chart has a grid)
    legendTextColor: "#9fbf9f",
    series: ["#00FF41", "#36c5f0", "#ffb703", "#ff6ec7", "#b18cff", "#ff8c42", "#ff5c5c"],
} as const;
```

Palette is fixed-order (never re-sorted); series map to `chartTheme.series[i]` in JSX **declaration order** of the
`<Line>`/`<Bar>`/`<Scatter>` elements, not by any "hot=worse" semantic remapping — the plan's slot-order rule wins
even when it inverts a chart's original color intuition (e.g. performance-comparison-chart's Bubble Sort — the
worst performer — now gets green slot 1 because it's declared first).

**recharts Legend text color gotcha**: `<Legend wrapperStyle={{ color }}>` does NOT reliably theme item text —
`DefaultLegendContent` always sets an explicit inline `color` on each `<span>` (`labelStyle.color || entry.color`,
i.e. falls back to the series color when `labelStyle` has no `.color`), which overrides any CSS inherited from the
wrapper. The only prop that reliably wins is `labelStyle={{ color: chartTheme.legendTextColor }}` passed directly —
it's a plain object literal (not a function), so it's fully compatible with `react/jsx-no-bind`. Use `labelStyle`,
not `wrapperStyle`, whenever DSA/blog-stats work needs to theme Legend text independent of series color.

Every one of the 9 DSA recharts components and the 2 SVG visualizers (graph-properties-visualizer,
tree-types-visualizer) got wrapped in `ChartPanel` (design-system molecule, no title) with axis/tooltip/legend
themed via `chartTheme`. Existing co-located tests only asserted `.recharts-responsive-container` presence and
stayed green unchanged; added one extra assertion per file: `container.querySelector("section.glow-container")`
to lock in the new wrap.

See [[arch_design_system_purity]] for why `chart-theme.ts` had to live in `types/configuration/` rather than a
design-system barrel constant.
