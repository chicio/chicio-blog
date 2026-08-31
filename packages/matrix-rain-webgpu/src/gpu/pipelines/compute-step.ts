import { d, std, tgpu, type TgpuMutable, type TgpuRoot, type TgpuUniform } from 'typegpu';
import { randf } from '@typegpu/noise';
import { Column } from '../schemas/column';
import { Uniforms } from '../schemas/uniforms';

export const COMPUTE_STEP_WORKGROUP_SIZE = 64;

const U32_MAX_F = 4294967295;

export function createComputeStepPipeline(
  root: TgpuRoot,
  columns: TgpuMutable<d.WgslArray<typeof Column>>,
  uniforms: TgpuUniform<typeof Uniforms>,
) {
  const computeMain = tgpu.computeFn({
    workgroupSize: [COMPUTE_STEP_WORKGROUP_SIZE],
    in: { gid: d.builtin.globalInvocationId },
  })(({ gid }) => {
    'use gpu';

    const columnCount = d.u32(std.floor(uniforms.$.resolution.x / uniforms.$.cellSize));
    if (gid.x >= columnCount) {
      return;
    }
    const column = columns.$[gid.x];

    randf.seed2(d.vec2f(d.f32(column.seed) / U32_MAX_F, uniforms.$.time));

    let nextHeadY = column.headY + column.speed;
    let nextSeed = column.seed;

    const offscreen = nextHeadY * uniforms.$.cellSize > uniforms.$.resolution.y;
    if (offscreen && randf.sample() > uniforms.$.density) {
      nextHeadY = d.f32(0);
      nextSeed = d.u32(randf.sample() * U32_MAX_F);
    }

    columns.$[gid.x] = Column({
      headY: nextHeadY,
      speed: column.speed,
      depth: column.depth,
      tailLength: column.tailLength,
      seed: nextSeed,
    });
  });

  return root.createComputePipeline({ compute: computeMain });
}

export type ComputeStepPipeline = ReturnType<typeof createComputeStepPipeline>;
