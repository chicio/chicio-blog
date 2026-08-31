import { d } from 'typegpu';

// Per-frame parameter block — backs a UNIFORM buffer: CPU-patched each frame
// (`uniforms.patch(...)`) and read-only on the GPU, broadcast to every invocation.
export const Uniforms = d.struct({
  time: d.f32,
  stepProgress: d.f32,
  resolution: d.vec2f,
  cellSize: d.f32,
  density: d.f32,
  depthDim: d.f32,
  bloomThreshold: d.f32,
  bloomIntensity: d.f32,
  headEmission: d.f32,
  scanlineStrength: d.f32,
  aberration: d.f32,
});
