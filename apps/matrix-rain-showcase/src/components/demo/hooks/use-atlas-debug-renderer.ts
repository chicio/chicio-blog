import { useEffect, useRef, type RefObject } from 'react';
import { useRoot } from '@typegpu/react';
import { d, type TgpuRoot, type TgpuUniform } from 'typegpu';

import { atlasBindings } from '@lib/gpu/atlas/bindings';
import { buildSdfAtlas, type SdfAtlas } from '@lib/gpu/atlas/build-sdf-atlas';
import {
  AtlasDebugUniforms,
  createAtlasDebugPipeline,
  type AtlasDebugPipeline,
} from '../atlas-debug-pipeline';

type Args = {
  ctxRef: RefObject<GPUCanvasContext | null>;
  atlasLayer: number;
};

type AtlasDebugState = {
  uniforms: TgpuUniform<typeof AtlasDebugUniforms>;
  pipeline: AtlasDebugPipeline;
  bindGroup: ReturnType<TgpuRoot['createBindGroup']>;
};

/**
 * Demo-only renderer for the atlas-debug view. Self-contained mini render-graph:
 * bakes the SDF atlas, uploads it, and draws the selected layer into the shared
 * canvas. Resources are created lazily on the first tick and disposed on unmount.
 */
export function useAtlasDebugRenderer({ ctxRef, atlasLayer }: Args): { tick: () => void } {
  const root = useRoot();
  const atlasRef = useRef<SdfAtlas | null>(null);
  const stateRef = useRef<AtlasDebugState | null>(null);
  const layerRef = useRef(atlasLayer);
  layerRef.current = atlasLayer;

  // Bake the SDF atlas once on mount; cancelable if the component unmounts mid-bake.
  useEffect(() => {
    let cancelled = false;
    buildSdfAtlas().then((result) => {
      if (!cancelled) {
        atlasRef.current = result;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Dispose GPU resources on unmount.
  useEffect(() => {
    return () => {
      stateRef.current?.uniforms.buffer.destroy();
      stateRef.current = null;
    };
  }, []);

  function tick() {
    const ctx = ctxRef.current;
    const atlas = atlasRef.current;
    if (!ctx || !atlas) {
      return;
    }

    if (!stateRef.current) {
      const uniforms = root.createUniform(AtlasDebugUniforms, {
        resolution: d.vec2f(0, 0),
        atlasLayer: 0,
      });

      // Mirrors render-graph's atlas upload: r8unorm 2D-array, written via the
      // unwrapped GPUTexture (texture.write() won't take a raw Uint8Array).
      const atlasTexture = root
        .createTexture({
          size: [atlas.layerSize, atlas.layerSize, atlas.layerCount],
          format: 'r8unorm',
        })
        .$usage('sampled');
      root.device.queue.writeTexture(
        { texture: root.unwrap(atlasTexture) },
        atlas.data,
        { bytesPerRow: atlas.layerSize, rowsPerImage: atlas.layerSize },
        [atlas.layerSize, atlas.layerSize, atlas.layerCount],
      );
      const sampler = root.createSampler({
        magFilter: 'linear',
        minFilter: 'linear',
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
      });
      const bindGroup = root.createBindGroup(atlasBindings, {
        atlas: atlasTexture.createView(d.texture2dArray(d.f32)),
        sampler,
      });
      const pipeline = createAtlasDebugPipeline(root, uniforms);
      stateRef.current = { uniforms, pipeline, bindGroup };
    }

    const { uniforms, pipeline, bindGroup } = stateRef.current;
    uniforms.patch({
      resolution: d.vec2f(ctx.canvas.width, ctx.canvas.height),
      atlasLayer: layerRef.current,
    });
    pipeline.with(bindGroup).withColorAttachment({ view: ctx }).draw(3);
  }

  return { tick };
}
