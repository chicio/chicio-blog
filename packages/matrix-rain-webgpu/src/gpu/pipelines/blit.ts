import { common, d, std, tgpu, type TgpuRoot } from 'typegpu';

// Source HDR texture sampled by the full-screen blit. Its own layout (a plain
// texture2d, vs the atlas's texture2dArray) so render-graph can build a bind
// group pointing at the offscreen target.
export const blitBindings = tgpu.bindGroupLayout({
  source: { texture: d.texture2d(d.f32) },
  sampler: { sampler: 'filtering' },
});

export function createBlitPipeline(root: TgpuRoot) {
  const fragMain = tgpu.fragmentFn({
    in: { uv: d.vec2f },
    out: d.vec4f,
  })(({ uv }) => {
    'use gpu';

    return std.textureSample(blitBindings.$.source, blitBindings.$.sampler, uv);
  });

  return root.createRenderPipeline({
    vertex: common.fullScreenTriangle,
    fragment: fragMain,
  });
}

export type BlitPipeline = ReturnType<typeof createBlitPipeline>;
