import { d } from 'typegpu';

// Per-column simulation state — backs a STORAGE buffer (`arrayOf(Column, columnCount)`)
// that is read-write on the GPU: the compute pass advances `headY` and rerolls `seed`
// every step. In computer-graphics terms the columns are a 1D particle system and each
// Column is a particle (position `headY`, velocity `speed`, plus per-column look params).
export const Column = d.struct({
  headY: d.f32,
  speed: d.f32,
  depth: d.f32,
  tailLength: d.f32,
  seed: d.u32,
});
