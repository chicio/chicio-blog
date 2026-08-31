import { common, d, std, tgpu, type TgpuRoot, type TgpuUniform } from 'typegpu';
import { blitBindings } from './blit';
import { Uniforms } from '../schemas/uniforms';

// Spacing between scanline bands, in device pixels (one full bright→bright
// sine period). Build-time constant — the slider controls band depth, not
// spacing. See docs/crt-pass.md for the frequency derivation.
const SCANLINE_PERIOD_PX = 4.0;

// Final full-screen pass: samples the composited scene (reusing blitBindings —
// a single texture + sampler) and stamps the CRT character onto it before it
// reaches the swap chain. Three steps: chromatic aberration → tone-map → scanlines.
export function createCrtPipeline(root: TgpuRoot, uniforms: TgpuUniform<typeof Uniforms>) {
  const fragMain = tgpu.fragmentFn({
    in: { uv: d.vec2f },
    out: d.vec4f,
  })(({ uv }) => {
    'use gpu';

    // Chromatic aberration: pull the R and B channels apart along x by `aberration`
    // pixels (converted to uv space); G stays centered. aberration = 0 → no fringing.
    const offset = d.vec2f(uniforms.$.aberration / uniforms.$.resolution.x, 0);
    const r = std.textureSample(blitBindings.$.source, blitBindings.$.sampler, uv + offset).x;
    const g = std.textureSample(blitBindings.$.source, blitBindings.$.sampler, uv).y;
    const b = std.textureSample(blitBindings.$.source, blitBindings.$.sampler, uv - offset).z;
    // Clamp, don't tone-map. Our signal is mostly in [0,1] (heads clamp at 1.0,
    // bloom adds a modest overshoot), so a global operator like Reinhard would
    // crush midtones (a 1.0 head → 0.5). Clamping lets bloom's >1.0 highlights
    // blow out to white — the desirable glow look, and identical to the pre-M7
    // implicit swap-chain clamp. Revisit a real tone-map if heads emit true HDR.
    let color = std.saturate(d.vec3f(r, g, b));

    // Scanlines: a horizontal brightness ripple. scanFreq is the total angle (in
    // radians) swept top→bottom; tying it to resolution.y keeps band spacing
    // constant in device pixels at any canvas size. 2π = one full sine period.
    const scanFreq = uniforms.$.resolution.y * ((2 * Math.PI) / SCANLINE_PERIOD_PX);
    const scan = 1 - uniforms.$.scanlineStrength * (0.5 + 0.5 * std.sin(uv.y * scanFreq));
    color = color * scan;

    return d.vec4f(color, 1);
  });

  return root.createRenderPipeline({
    vertex: common.fullScreenTriangle,
    fragment: fragMain,
  });
}

export type CrtPipeline = ReturnType<typeof createCrtPipeline>;
