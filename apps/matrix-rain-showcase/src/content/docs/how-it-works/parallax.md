---
title: Parallax
sidebar:
  order: 4
---

**Source:** [`src/gpu/render-graph.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/render-graph.ts) (`initialColumns`), [`src/gpu/pipelines/render-glyphs.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/pipelines/render-glyphs.ts)

Parallax is the depth illusion: some columns read as *near* (fast, bright, crisp) and others as *far* (slow, dim, soft). It's driven entirely by one per-column value — `depth` — derived from the column's fall speed.

## Depth from speed

When columns are created, each gets a random speed in `speedRange = [min, max]`, and a `depth` is the column's normalized position within that range:

$$
\text{speed} = \operatorname{lerp}(\text{min},\,\text{max},\,\xi), \qquad
\text{depth} = \frac{\text{speed} - \text{min}}{\text{max} - \text{min}} \in [0, 1]
$$

(with $\xi$ a uniform random, and a guard so that when `min = max` the span is zero and `depth = 1`). So **fast = near (depth → 1), slow = far (depth → 0)** — exactly how real parallax reads: distant things drift slowly.

The speed spread is the whole effect. Collapse `speedRange` to a single value and every column shares one depth — a flat field. That's literally what `parallax={false}` does: it sets `speedRange = [1, 1]` and `depthDim = 0`.

## Three depth-correlated cues

`depth` then feeds three cues in the glyph shader, all keyed on the same value so they reinforce each other:

1. **Speed** (already above) — far columns fall slower.
2. **Brightness dimming** — far columns are dimmed toward `1 - depthDim`:
   $$ \text{depthDimming} = \operatorname{mix}(1 - \text{depthDim},\; 1,\; \text{depth}) $$
   `depthDim` (default `0.3`) is how dark the farthest columns get; near columns (`depth → 1`) stay full brightness.
3. **Edge softness** — far columns get a wider anti-aliasing band, faking depth-of-field blur:
   $$ \text{softness} = \operatorname{mix}(2.5,\; 1,\; \text{depth}) $$
   Near columns get a crisp ~1px edge; far columns get a 2.5×-wider, blurrier edge. (See [Glyph rendering](/matrix-rain-webgpu/how-it-works/glyph-rendering/) for how softness widens the `smoothstep` band.)

## A note on `depthDim` vs `enabled`

There's no `enabled` flag on parallax (unlike bloom/crt). It doesn't need one: "disabled" is fully expressed by the *values* (`speedRange = [1,1]`, `depthDim = 0`), so nothing downstream has to branch. `depthDim` is patched into the uniform every frame (live), while `speedRange` only takes effect on the next column (re)spawn, since it's baked into `depth` at creation.

## `tailLength` is independent

Trail length is rolled separately per column (`tailRange`) and is **not** correlated with depth — a deliberate choice for variety. A near, fast column can still have a short trail and vice-versa.
