import { d, tgpu } from 'typegpu';

export const atlasBindings = tgpu.bindGroupLayout({
  atlas: { texture: d.texture2dArray(d.f32) },
  sampler: { sampler: 'filtering' },
});
