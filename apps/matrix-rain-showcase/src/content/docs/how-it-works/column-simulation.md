---
title: Column simulation
sidebar:
  order: 1
---

**Source:** [`src/gpu/pipelines/compute-step.ts`](https://github.com/chicio/matrix-rain-webgpu/blob/main/src/gpu/pipelines/compute-step.ts)

The simulation is a compute pass: one GPU thread per column, advancing the `Column[]` storage buffer. It's the only pass that *writes* simulation state.

## One thread per column

The compute shader runs with a workgroup size of 64; each invocation handles one column, guarded against overrun:

```ts
const columnCount = floor(resolution.x / cellSize);
if (gid.x >= columnCount) return;
const column = columns.$[gid.x];
```

## Advancing the head

Each step moves the head down by the column's speed (in cells):

$$ \text{headY}' = \text{headY} + \text{speed} $$

`stepRate` (Hz) controls how often this runs, decoupled from the render frame rate — the renderer interpolates between steps via `stepProgress`.

## Respawn

A column respawns when its head has fallen off the bottom **and** a per-step random roll passes:

```ts
const offscreen = nextHeadY * cellSize > resolution.y;
if (offscreen && randf.sample() > density) {
  nextHeadY = 0;
  nextSeed = randf.sample() * U32_MAX;
}
```

Two things worth noting:

- **The `density` semantic is inverted from intuition.** `density` is the probability a column does **not** respawn this step. Higher `density` → respawn rarely → the screen empties out (sparser). At `density = 1`, `randf.sample() > 1` is never true, so columns never respawn and the field drains. This matches the original 2D reference's behavior.
- **Respawn rerolls the seed.** A new `seed` means a new set of glyphs and a new brightness-jitter pattern for that column's next descent (see [Glyph rendering](/matrix-rain-webgpu/how-it-works/glyph-rendering/)).

## Per-thread randomness

The RNG is seeded **per thread, per frame** from the column's stored seed and the current time:

```ts
randf.seed2(vec2f(column.seed / U32_MAX, uniforms.$.time));
```

Seeding on `time` is deliberate — it's why the respawn roll differs frame to frame. (It's also why the [paused settle](/matrix-rain-webgpu/usage/public-api/) loop advances `time` per iteration: a frozen time makes every roll identical and the field drains to black.) `randf` comes from `@typegpu/noise`; its functions are GPU-marked, so they compose into our `'use gpu'` compute shader.

## What it does *not* touch

`speed`, `depth`, and `tailLength` are set once at column creation (on the CPU) and never change during simulation — only `headY` and `seed` mutate here. The per-column constants are what give each column its place in the [parallax](/matrix-rain-webgpu/how-it-works/parallax/) depth field.
