import { d, type TgpuMutable, type TgpuRoot, type TgpuUniform } from 'typegpu';
import type { SdfAtlas } from './atlas/build-sdf-atlas';
import type { BloomConfig, CrtConfig, ParallaxConfig } from '../types';
import { Column } from './schemas/column';
import { Uniforms } from './schemas/uniforms';
import {
  COMPUTE_STEP_WORKGROUP_SIZE,
  createComputeStepPipeline,
  type ComputeStepPipeline,
} from './pipelines/compute-step';
import { createRenderGlyphsPipeline, type RenderGlyphsPipeline } from './pipelines/render-glyphs';
import { atlasBindings } from './atlas/bindings';
import { blitBindings, createBlitPipeline, type BlitPipeline } from './pipelines/blit';
import { createCrtPipeline, type CrtPipeline } from './pipelines/crt';
import {
  combineBindings,
  createBlurPipeline,
  createCombinePipeline,
  createExtractPipeline,
  type BlurPipeline,
  type CombinePipeline,
  type ExtractPipeline,
} from './pipelines/bloom';

const HDR_FORMAT: GPUTextureFormat = 'rgba16float';

export type CreateRenderGraphArgs = {
  root: TgpuRoot;
  ctx: GPUCanvasContext;
  atlas: SdfAtlas;
  cellSize: number;
  density: number;
  stepRate: number;
  tailRange: [number, number];
  bloom: BloomConfig;
  crt: CrtConfig;
  parallax: ParallaxConfig;
};

export type RenderGraph = {
  resize: (width: number, height: number) => void;
  step: (deltaSeconds: number, elapsedSeconds: number) => void;
  settle: () => void;
  render: () => void;
  setDensity: (density: number) => void;
  setStepRate: (stepRate: number) => void;
  setTailRange: (range: [number, number]) => void;
  setBloom: (config: BloomConfig) => void;
  setCrt: (config: CrtConfig) => void;
  setParallax: (config: ParallaxConfig) => void;
  regenerate: () => void;
  getColumnCount: () => number;
  dispose: () => void;
};

type ColumnsBuffer = TgpuMutable<d.WgslArray<typeof Column>>;

function initialColumns(
  count: number,
  viewportHeight: number,
  cellSize: number,
  speedRange: [number, number],
  tailRange: [number, number],
) {
  const rowCount = Math.max(1, Math.floor(viewportHeight / cellSize));
  const [minSpeed, maxSpeed] = speedRange;
  const [tailStart, tailEnd] = tailRange;

  return Array.from({ length: count }, () => {
    const speedSpan = maxSpeed - minSpeed;
    const speed = speedSpan > 0 ? minSpeed + speedSpan * Math.random() : minSpeed;
    const depth = speedSpan > 0 ? (speed - minSpeed) / speedSpan : 1;
    const tailLength = tailStart + (tailEnd - tailStart) * Math.random();

    return {
      headY: Math.random() * 2 * rowCount - rowCount, // uniform in [-rowCount, +rowCount]
      speed,
      depth,
      tailLength,
      seed: Math.floor(Math.random() * 0xffffffff),
    };
  });
}

export function createRenderGraph(args: CreateRenderGraphArgs): RenderGraph {
  const { root, ctx, atlas, cellSize } = args;
  let density = args.density;
  let stepRate = args.stepRate;
  let tailRange = args.tailRange;
  let bloom = args.bloom;
  let crt = args.crt;
  let parallax = args.parallax;

  const uniforms: TgpuUniform<typeof Uniforms> = root.createUniform(Uniforms, {
    time: 0,
    stepProgress: 0,
    resolution: d.vec2f(0, 0),
    cellSize,
    density,
    depthDim: parallax.depthDim,
    bloomThreshold: bloom.threshold,
    bloomIntensity: bloom.intensity,
    headEmission: bloom.enabled ? bloom.emission : 1,
    scanlineStrength: crt.scanlineStrength,
    aberration: crt.aberration,
  });

  const atlasTexture = root
    .createTexture({
      size: [atlas.layerSize, atlas.layerSize, atlas.layerCount],
      format: 'r8unorm',
    })
    .$usage('sampled');

  const atlasSampler = root.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
  });
  const blitSampler = root.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
  });

  // root.unwrap() forces GPU materialization so writeTexture has a real GPUTexture target.
  root.device.queue.writeTexture(
    { texture: root.unwrap(atlasTexture) },
    atlas.data,
    { bytesPerRow: atlas.layerSize, rowsPerImage: atlas.layerSize },
    [atlas.layerSize, atlas.layerSize, atlas.layerCount],
  );

  const atlasBindGroup = root.createBindGroup(atlasBindings, {
    atlas: atlasTexture.createView(d.texture2dArray(d.f32)),
    sampler: atlasSampler,
  });

  const blitPipeline: BlitPipeline = createBlitPipeline(root);
  const extractPipeline: ExtractPipeline = createExtractPipeline(root, uniforms, HDR_FORMAT);
  const blurHPipeline: BlurPipeline = createBlurPipeline(root, uniforms, HDR_FORMAT, [1, 0]);
  const blurVPipeline: BlurPipeline = createBlurPipeline(root, uniforms, HDR_FORMAT, [0, 1]);
  const combinePipeline: CombinePipeline = createCombinePipeline(root, uniforms, HDR_FORMAT);
  const crtPipeline: CrtPipeline = createCrtPipeline(root, uniforms);

  let columns: ColumnsBuffer | null = null;
  let computePipeline: ComputeStepPipeline | null = null;
  let renderPipeline: RenderGlyphsPipeline | null = null;
  let columnCount = 0;
  let viewportHeight = 0;
  let stepAccumulator = 0;

  function createRenderTarget(width: number, height: number) {
    const texture = root
      .createTexture({ size: [width, height], format: HDR_FORMAT })
      .$usage('sampled', 'render');
    const bindGroup = root.createBindGroup(blitBindings, {
      source: texture.createView(d.texture2d(d.f32)),
      sampler: blitSampler,
    });
    return { texture, bindGroup };
  }

  // Combine samples two targets at once (full-bright scene + blurred bloom),
  // so it gets its own bind group, rebuilt whenever those targets are.
  function createCombineBindGroup(
    scene: ReturnType<typeof createRenderTarget>,
    bloomTarget: ReturnType<typeof createRenderTarget>,
  ) {
    return root.createBindGroup(combineBindings, {
      scene: scene.texture.createView(d.texture2d(d.f32)),
      bloom: bloomTarget.texture.createView(d.texture2d(d.f32)),
      sampler: blitSampler,
    });
  }

  let hdrTarget: ReturnType<typeof createRenderTarget> | null = null;
  let extractTarget: ReturnType<typeof createRenderTarget> | null = null;
  let blurTargetA: ReturnType<typeof createRenderTarget> | null = null;
  let blurTargetB: ReturnType<typeof createRenderTarget> | null = null;
  // combine writes the composited (scene + bloom) result here so the final CRT
  // (or plain blit) pass can sample it. Full-res HDR — CRT tone-maps it itself.
  let combineTarget: ReturnType<typeof createRenderTarget> | null = null;
  let combineBindGroup: ReturnType<typeof createCombineBindGroup> | null = null;
  let lastWidth = 0;
  let lastHeight = 0;

  function resize(w: number, h: number) {
    viewportHeight = h;
    const newCount = Math.max(1, Math.floor(w / cellSize));
    if (newCount !== columnCount) {
      columns?.buffer.destroy();
      columnCount = newCount;
      columns = root.createMutable(d.arrayOf(Column, columnCount));
      columns.write(initialColumns(columnCount, h, cellSize, parallax.speedRange, tailRange));
      computePipeline = createComputeStepPipeline(root, columns, uniforms);
      renderPipeline = createRenderGlyphsPipeline(root, columns, uniforms, HDR_FORMAT);
    }
    if (w !== lastWidth || h !== lastHeight) {
      lastWidth = w;
      lastHeight = h;
      const halfW = Math.max(1, Math.floor(w / 2));
      const halfH = Math.max(1, Math.floor(h / 2));
      hdrTarget?.texture.destroy();
      hdrTarget = createRenderTarget(w, h);
      extractTarget?.texture.destroy();
      extractTarget = createRenderTarget(halfW, halfH);
      blurTargetA?.texture.destroy();
      blurTargetA = createRenderTarget(halfW, halfH);
      blurTargetB?.texture.destroy();
      blurTargetB = createRenderTarget(halfW, halfH);
      combineTarget?.texture.destroy();
      combineTarget = createRenderTarget(w, h);
      combineBindGroup = createCombineBindGroup(hdrTarget, blurTargetB);
    }
    uniforms.patch({ resolution: d.vec2f(w, h) });
  }

  function regenerate() {
    if (!columns) {
      return;
    }
    columns.write(
      initialColumns(columnCount, viewportHeight, cellSize, parallax.speedRange, tailRange),
    );
  }

  function step(deltaSeconds: number, elapsedSeconds: number) {
    stepAccumulator += deltaSeconds;
    const stepInterval = 1 / stepRate;
    uniforms.patch({
      time: elapsedSeconds,
      density,
      depthDim: parallax.depthDim,
      bloomThreshold: bloom.threshold,
      bloomIntensity: bloom.intensity,
      headEmission: bloom.enabled ? bloom.emission : 1,
      scanlineStrength: crt.scanlineStrength,
      aberration: crt.aberration,
    });
    const workgroupCount = Math.ceil(columnCount / COMPUTE_STEP_WORKGROUP_SIZE);
    while (stepAccumulator >= stepInterval) {
      stepAccumulator -= stepInterval;
      if (computePipeline && workgroupCount > 0) {
        computePipeline.dispatchWorkgroups(workgroupCount);
      }
    }
    uniforms.patch({ stepProgress: stepAccumulator / stepInterval });
  }

  // Advance the simulation to a settled-looking frame in one shot — used when
  // `paused` turns on (especially a from-cold paused mount, where columns start
  // mostly offscreen). ceil(rows / averageSpeed) steps guarantees every column
  // has fallen past its start at least once. stepProgress is zeroed so the
  // static render samples the discrete head, not a mid-step interpolation.
  function settle() {
    const workgroupCount = Math.ceil(columnCount / COMPUTE_STEP_WORKGROUP_SIZE);
    if (!computePipeline || workgroupCount <= 0 || viewportHeight <= 0) {
      return;
    }
    const rows = viewportHeight / cellSize;
    const averageSpeed = Math.max((parallax.speedRange[0] + parallax.speedRange[1]) / 2, 0.0001);
    const iterations = Math.max(1, Math.ceil(rows / averageSpeed));
    const stepInterval = 1 / stepRate;
    for (let i = 0; i < iterations; i++) {
      // Advance time each iteration: the respawn roll is seeded on time, so a
      // frozen time makes every column's roll identical — they all march off the
      // bottom without the stochastic respawns that refill the top, draining the
      // screen to black. Stepping time reaches the same steady-state spread as
      // the live loop.
      uniforms.patch({ time: (i + 1) * stepInterval });
      computePipeline.dispatchWorkgroups(workgroupCount);
    }
    uniforms.patch({ stepProgress: 0 });
  }

  function render() {
    if (!renderPipeline || !hdrTarget) {
      return;
    }
    // 1: glyphs → HDR target.
    renderPipeline.with(atlasBindGroup).withColorAttachment({ view: hdrTarget.texture }).draw(3);

    // The "composite" is whatever holds the finished scene before the final
    // pass: the bloom-combined target if bloom ran, otherwise the raw glyphs.
    let composite = hdrTarget;
    if (
      bloom.enabled &&
      extractTarget &&
      blurTargetA &&
      blurTargetB &&
      combineBindGroup &&
      combineTarget
    ) {
      // 2: bright-pass → extract (half-res).
      extractPipeline
        .with(hdrTarget.bindGroup)
        .withColorAttachment({ view: extractTarget.texture })
        .draw(3);
      // 3: blur horizontally → A.
      blurHPipeline
        .with(extractTarget.bindGroup)
        .withColorAttachment({ view: blurTargetA.texture })
        .draw(3);
      // 4: blur vertically → B (final bloom).
      blurVPipeline
        .with(blurTargetA.bindGroup)
        .withColorAttachment({ view: blurTargetB.texture })
        .draw(3);
      // 5: composite scene + intensity * bloom → HDR combine target.
      combinePipeline
        .with(combineBindGroup)
        .withColorAttachment({ view: combineTarget.texture })
        .draw(3);
      composite = combineTarget;
    }

    // Final pass → swap chain. CRT stamps scanlines + aberration + tone-map;
    // when off, a plain passthrough blit (same as pre-M7).
    const finalPipeline = crt.enabled ? crtPipeline : blitPipeline;
    finalPipeline.with(composite.bindGroup).withColorAttachment({ view: ctx }).draw(3);
  }

  function setDensity(value: number) {
    density = value;
  }

  function setStepRate(value: number) {
    stepRate = value;
  }

  function setTailRange(range: [number, number]) {
    tailRange = range;
  }

  // bloom / crt are read every frame (render-path gate + uniform patch), so a
  // plain reassignment lands on the next tick. parallax.depthDim is likewise
  // per-frame, but parallax.speedRange is init-time — it only takes effect on
  // the next regenerate()/resize() (the hook drives that on a speed change).
  function setBloom(config: BloomConfig) {
    bloom = config;
  }

  function setCrt(config: CrtConfig) {
    crt = config;
  }

  function setParallax(config: ParallaxConfig) {
    parallax = config;
  }

  function dispose() {
    uniforms.buffer.destroy();
    columns?.buffer.destroy();
    columns = null;
    computePipeline = null;
    renderPipeline = null;
    hdrTarget?.texture.destroy();
    hdrTarget = null;
    extractTarget?.texture.destroy();
    extractTarget = null;
    blurTargetA?.texture.destroy();
    blurTargetA = null;
    blurTargetB?.texture.destroy();
    blurTargetB = null;
    combineTarget?.texture.destroy();
    combineTarget = null;
  }

  function getColumnCount() {
    return columnCount;
  }

  return {
    resize,
    step,
    settle,
    render,
    setDensity,
    setStepRate,
    setTailRange,
    setBloom,
    setCrt,
    setParallax,
    regenerate,
    getColumnCount,
    dispose,
  };
}
