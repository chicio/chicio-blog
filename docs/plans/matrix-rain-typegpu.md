# Matrix Rain: TypeGPU + WebGPU Rewrite Plan

## Goal and Non-Goals

**Goal**: Replace the Canvas2D internals of `MatrixRain` with a TypeGPU compute + render pipeline that updates all column drop states in parallel on the GPU each frame and draws glyphs from a prebuilt texture atlas. The public component API (`fontSize`, `frameRate`, `density` props) stays identical. Browsers without WebGPU (Firefox stable, older Safari) fall back automatically to the existing Canvas2D path.

**Non-Goals**:
- Changing any consumer component (`MatrixBackground`, `MatrixHeaderBackground`, `not-found.tsx`, `offline/page.tsx`, etc.)
- Changing the visual appearance — same colors, same katakana glyph set, same density behavior
- Implementing audio-reactive or interactive variants (listed under future ideas)

---

## Learning Objectives

This rewrite is a structured course in GPU programming. Each phase explicitly teaches one layer of the GPU mental model:

| Phase | Core concept taught |
|-------|---------------------|
| 1 | WebGPU device initialization, canvas context, capability detection, TypeGPU root lifecycle |
| 2 | Storage buffers, struct definition, memory layout, `d.struct` alignment, reading GPU data from JS |
| 3 | Compute shaders, `workgroupSize`, `globalInvocationId`, parallel dispatch, `createGuardedComputePipeline` |
| 4 | Texture creation, texture atlas construction via Canvas2D, `texture.write()`, sampler configuration |
| 5 | Render pipeline, vertex/fragment shaders with `fullScreenTriangle`, uniform buffers, bind groups, per-frame draw loop |
| 6 | Performance tuning, DPR handling, resize lifecycle, `reduced-motion` guard, final cleanup |

---

## Current State

### Files

| File | Lines | Role |
|------|-------|------|
| `src/components/design-system/atoms/effects/matrix-rain.tsx` | 220 | The single component: canvas lifecycle, RAF loop, Canvas2D draw calls, IntersectionObserver, resize debounce |
| `src/types/effects/matrix-rain.ts` | 8 | `MatrixRainDrawContext` interface — holds drop positions, dimensions, timing, RAF id |

### How It Works Today

1. `MatrixRain` (exported as `memo(MatrixRainRenderer)`) mounts a `<canvas>` that fills its container via absolute positioning.
2. On mount: `setCanvasSize` applies DPR scaling; `initializeDrops` fills a JS array with one `y` position per column.
3. `drawFrame` runs each tick: a semi-transparent black `fillRect` fades the trail, then one `fillText` call per column at a random katakana character with a probability-weighted color from a 6-tier threshold table.
4. A column resets to `y=0` when it passes the canvas height with probability `(1 - density)`.
5. Frame pacing: the RAF callback measures elapsed time against `1000 / frameRate` and skips rendering if the interval has not passed.
6. `IntersectionObserver` pauses the loop when the canvas leaves the viewport.
7. On resize: a debounced handler reinitializes only when `innerWidth` changes (avoids mobile scroll-bar jitter).

**Bottleneck**: `drops` is a JS array updated sequentially in the main thread. With a 14px font on a 1920px canvas, that is ~137 columns — trivial today, but it blocks the main thread and cannot scale to higher density or particle-style effects.

### Consumers

- `MatrixBackground` (molecule) — fullscreen hero, `fontSize=16, density=0.95`
- `MatrixHeaderBackground` (molecule) — page header band, `fontSize=14, density=0.95`
- `src/app/not-found.tsx` — direct use, `fontSize=14, density=0.975`
- `src/app/offline/page.tsx` — direct use, `fontSize=14, density=0.975`
- `brand-header.tsx` (organism) — via `MatrixHeaderBackground`
- `chat.tsx` — via `MatrixHeaderBackground` when no messages
- `clowns-page-template.tsx` — via `MatrixHeaderBackground`
- `homepage.tsx` — via `MatrixBackground`
- `neo-room-easter-egg.tsx` — via `MatrixBackground` in easter egg overlay
- `dejavu.tsx` — via `MatrixBackground` in dejavu easter egg overlay

---

## Target Architecture

```
MatrixRain (React component — same public props)
  |
  +-- detectWebGPU() ──> false ──> MatrixRainCanvas2D (current code, unchanged)
  |
  +-- true
       |
       v
  MatrixRainGPU (new)
       |
       +-- tgpu.init()  -->  TgpuRoot
       |
       +-- root.configureContext({ canvas })  -->  GPUCanvasContext
       |
       +-- BUFFERS
       |    DropState buffer   d.arrayOf(DropState, MAX_COLUMNS)   storage mutable
       |    Uniforms buffer    d.struct({ columns, height, density, time })   uniform
       |
       +-- COMPUTE PASS  (Phase 3)
       |    tgpu.computeFn({ workgroupSize: [64] })
       |    input: globalInvocationId.x = column index
       |    reads: DropState[x].y, Uniforms.height, Uniforms.density
       |    writes: DropState[x].y++, resets when y > height && rand > density
       |    DropState also carries: glyphIndex (u32), colorTier (u32)
       |
       +-- TEXTURE ATLAS  (Phase 4)
       |    48 glyphs × 16px grid rendered once to an offscreen Canvas2D
       |    Uploaded to root.createTexture({ format: 'rgba8unorm' })
       |    sampler: nearest filter (pixel-perfect at integer glyph sizes)
       |
       +-- RENDER PASS  (Phase 5)
            tgpu.vertexFn = fullScreenTriangle (typegpu/common)
            tgpu.fragmentFn:
              - reads DropState storage buffer (readonly)
              - reads Uniforms
              - for each fragment: compute column = floor(uv.x * columns)
                                           row    = floor(uv.y * rows)
              - look up active glyph in DropState[column]
              - sample atlas texture at glyph UV region
              - apply color from colorTier threshold table (vec4f constants)
              - alpha-blend trail based on distance from drop head
            draw(3)  -- full-screen triangle, 3 vertices
```

The GPU path replaces the canvas context from `2d` to `webgpu` on the same `<canvas>` element. The React component shell, sizing logic, IntersectionObserver, and resize debounce remain unchanged — they operate on the DOM element, not on rendering internals.

---

## Phased Implementation Plan

### Phase 1 — WebGPU Initialization and Fallback Selection

**GPU concept taught**: Device initialization, adapter/device model, canvas context configuration, runtime capability detection.

**What you will learn**: WebGPU requires an explicit `navigator.gpu.requestAdapter()` → `adapter.requestDevice()` negotiation. TypeGPU wraps this as `tgpu.init()`. A canvas used by WebGPU must call `canvas.getContext('webgpu')` not `'2d'` — the two contexts are mutually exclusive on the same element. The `navigator.gpu` object is absent in Firefox and older Safari, which is the natural feature-detection gate.

#### Files to create

- `src/lib/webgpu/webgpu-detection.ts`
  - Export `async function isWebGPUSupported(): Promise<boolean>` — checks `navigator.gpu` exists, calls `requestAdapter()`, returns false on null or any thrown error.
  - Export `async function createTgpuRoot(): Promise<TgpuRoot | null>` — thin wrapper around `tgpu.init()`, returns null on failure.

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts` (stub — exports the `MatrixRainWebGPURenderer` class with constructor and `destroy()`, no real GPU work yet)

#### Files to modify

- move `src/components/design-system/atoms/effects/matrix-rain.tsx` to `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-canvas2d.tsx`, rename the component from `MatrixRainRenderer` to `MatrixRainCanvas2DRenderer`
- create a new `src/components/design-system/atoms/effects/matrix-rain/matrix-rain.tsx`
  - Add a `useEffect` that runs once on mount to call `isWebGPUSupported()`, stores result in a `useRef<boolean | null>` (null = pending). Render the Canvas2D component `MatrixRainCanvas2DRenderer` path unconditionally until the check resolves, then switch if WebGPU is available.
  - The Canvas2D render path must not change at all — the only addition is the capability check and the conditional branch.
- `src/types/effects/matrix-rain.ts`
  - Add `MatrixRainMode = 'canvas2d' | 'webgpu' | 'pending'` union type.

#### Dependencies to install

```bash
npm install typegpu
npm install --save-dev @webgpu/types
```

Update `tsconfig.json`: add `"@webgpu/types"` to the `types` array.

**Note on `unplugin-typegpu`**: This Vite/Webpack plugin is required for writing shader logic as TypeScript with `'use gpu'` directives compiled at build time. Next.js uses Webpack, so the plugin must be added to `next.config.ts`. Add `import typegpuPlugin from 'unplugin-typegpu/webpack'` and register it in `webpack(config)`. Without this, TypeGPU shaders must be written as tagged template literals (`/* wgsl */\`...\``) instead of inline TypeScript functions with `'use gpu'`.

Decision to make before coding: tagged-template WGSL vs `'use gpu'` TypeScript. Recommendation: use `'use gpu'` from the start to get full type safety. This requires `unplugin-typegpu`.

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed; the stub should not break anything
- Browser: open any page with a matrix rain effect. It should still render via Canvas2D (the GPU path returns null because the stub does nothing). Open DevTools > Console: no errors.
- Open Firefox: same Canvas2D rendering, no WebGPU code executed.

#### Learning checkpoint

After this phase you should understand:
- Why WebGPU capability detection requires an async probe (not just a property check)
- That a canvas element can serve either the `2d` API or the `webgpu` API, never both
- How `tgpu.init()` abstracts adapter and device negotiation
- The cost of fallback: zero — the Canvas2D path is untouched

---

### Phase 2 — GPU Data Model: Struct Definitions and Storage Buffers

**GPU concept taught**: GPU memory layout, struct alignment (WGSL `std140`/`std430` rules), storage buffers vs uniform buffers, reading GPU data back to JS for debugging.

**What you will learn**: GPUs impose strict alignment rules on struct fields. A struct containing a `vec2f` followed by a `u32` is not 12 bytes — the `u32` must be padded to 16 bytes to meet `vec4f` alignment. TypeGPU's `d.struct` handles this automatically, but you need to understand *why* it pads. Storage buffers (`read_write` access) are uncapped in size and allow per-element random access. Uniform buffers are capped at 64KB and optimized for values that are identical for all shader invocations (like canvas width, density). You will create both and read them back in JS to verify the values are what you wrote.

#### Files to create

- rename `src/types/effects/matrix-rain-canvas2d-state.ts` and the object inside in the same way
- `src/types/effects/matrix-rain-webgpu-state.ts`
  - Define and export the TypeGPU data schemas:
    ```typescript
    import { d } from 'typegpu';

    export const DropState = d.struct({
        y:          d.f32,    // current y position in rows (float for smooth reset)
        glyphIndex: d.u32,    // index into the 48-glyph atlas
        colorTier:  d.u32,    // 0–5, maps to the 6-color threshold table
    });

    export const RainUniforms = d.struct({
        columns:    d.u32,
        rows:       d.u32,
        density:    d.f32,
        frameTime:  d.f32,    // seconds since epoch, for seeding random in shader
    });
    ```
  - Export `MAX_COLUMNS = 512` — upper bound for buffer pre-allocation (a 1px font on a 4K display has ~3840 columns; 512 is sufficient for the 14–16px sizes used here; document this limit clearly).
  - Export `GLYPH_COUNT = 48` (36 katakana + 10 digits + colon, period, equals, asterisk, plus, hyphen, less, greater — count the `matrix` string in `matrix-rain.tsx`).
  - Export `COLOR_TABLE: d.vec4f[]` — the 6-tier Matrix colors as WGSL-ready `vec4f` values (R, G, B, 1.0).

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts` (expand the stub)
  - Add buffer creation inside the constructor:
    ```typescript
    this.dropStateBuffer = root
        .createBuffer(d.arrayOf(DropState, MAX_COLUMNS))
        .$usage('storage');

    this.uniformsBuffer = root
        .createBuffer(RainUniforms)
        .$usage('uniform');
    ```
  - Add `async debugRead()` method that calls `await this.dropStateBuffer.read()` and logs the first 5 entries. This is for Phase 2 verification only — remove it in Phase 6.

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Add a temporary `console.log` call to `debugRead()` and invoke it once from a `useEffect` in `matrix-rain.tsx` when `mode === 'webgpu'`. Open Chrome (WebGPU required). Confirm the console shows 5 `DropState` objects with their zero-initialized values.
- Verify `d.struct` alignment by running `console.log(d.sizeOf(DropState))` — should be 12 bytes (3 × 4 bytes, all naturally aligned). Then try a struct with a `vec3f` + `u32` and compare `d.sizeOf` to your hand-calculation to internalize alignment padding.

#### Learning checkpoint

After this phase you should understand:
- Why `d.struct` exists: raw WebGPU buffers are untyped byte arrays; TypeGPU embeds type information so reads and writes are validated at compile time
- The difference between `.$usage('storage')` (large, random-access, read-write) and `.$usage('uniform')` (small, broadcast, read-only from shader)
- Why `MAX_COLUMNS` must be a compile-time constant: GPU buffers are fixed-size allocations; dynamic arrays on the GPU require separate mechanisms (indirect dispatch)
- How `buffer.read()` triggers a GPU → CPU copy via a staging buffer internally

---

### Phase 3 — Compute Shader: Parallel Column Update

**GPU concept taught**: Compute shader structure, `workgroupSize` selection, `globalInvocationId`, parallel vs sequential execution, pseudo-random number generation in WGSL (no `Math.random()` on GPU).

**What you will learn**: A compute shader executes one invocation per data element — here, one invocation per column. `globalInvocationId.x` identifies which column this invocation owns. All invocations run simultaneously, so there is no loop — the `for (let i = 0; i < drops.length; i++)` in `drawFrame` is replaced by the dispatch. WGSL has no built-in random number generator; you will implement a hash-based pseudo-random function using the invocation ID and `frameTime` as a seed.

**Workgroup size decision**: Use `[64, 1, 1]`. This is the most common general-purpose workgroup size on desktop GPUs (matches the warp/wavefront size of most hardware). For 512 columns, dispatch `Math.ceil(columns / 64)` workgroups.

#### Files to modify

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts`
  - Add the bind group layout for the compute pass:
    ```typescript
    const computeLayout = tgpu.bindGroupLayout({
        dropState: { storage: d.arrayOf(DropState, MAX_COLUMNS), access: 'mutable' },
        uniforms:  { uniform: RainUniforms },
    });
    ```
  - Add the compute function:
    ```typescript
    const updateDrops = tgpu.computeFn({
        in: { gid: d.builtin.globalInvocationId },
        workgroupSize: [64, 1, 1],
    })((input) => {
        'use gpu';
        const col = input.gid.x;
        if (col >= computeLayout.$.uniforms.columns) { return; }

        // PCG hash for GPU pseudo-random — seeded by column + frameTime
        // hash(col * 747796405 + frameTime_as_u32) CAN WE EXTRACT THIS IN A RAND FUNCTION?
        let state = col * 747796405u + bitcast<u32>(computeLayout.$.uniforms.frameTime);
        state = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
        state = (state >> 22u) ^ state;
        const rand = f32(state) / f32(0xFFFFFFFFu);

        const drop = computeLayout.$.dropState[col];
        const rows = computeLayout.$.uniforms.rows;

        // pick a new random glyph and color tier each tick
        let newGlyphIndex = u32(rand * f32(GLYPH_COUNT));
        let newColorTier  = u32(rand * 6.0);

        let newY = drop.y + 1.0;
        if (newY > f32(rows) && rand > computeLayout.$.uniforms.density) {
            newY = 0.0;
        }

        computeLayout.$.dropState[col] = DropState(newY, newGlyphIndex, newColorTier);
    });
    ```
  - Create the compute pipeline and bind group:
    ```typescript
    this.computePipeline = root.createComputePipeline({ compute: updateDrops });
    this.computeBindGroup = root.createBindGroup(computeLayout, {
        dropState: this.dropStateBuffer,
        uniforms:  this.uniformsBuffer,
    });
    ```
  - Add `stepCompute(columns: number, rows: number, density: number)` method: writes uniforms, dispatches `Math.ceil(columns / 64)` workgroups.
  - Initialize the `dropStateBuffer` with random y positions scattered across the canvas height (matching the current `initializeDrops` behavior) so the effect starts populated, not empty.

- `src/components/design-system/atoms/effects/matrix-rain.tsx`
  - Call `gpuRenderer.stepCompute(...)` inside the RAF loop when `mode === 'webgpu'`. The Canvas2D draw calls are still used as a placeholder visual (the GPU compute runs, but we are not rendering with GPU yet). This is intentional — it proves the compute path runs independently of the render path.

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser (Chrome with WebGPU): add a `console.log(await gpu.dropStateBuffer.read())` after 10 frames. Confirm column `y` values are incrementing and resetting. Values should be non-zero and scattered.
- Confirm no GPU validation errors in the WebGPU DevTools panel (Chrome has a WebGPU inspector).

#### Learning checkpoint

After this phase you should understand:
- Why there is no `for` loop in a compute shader — the dispatch *is* the loop
- How `workgroupSize` relates to hardware warp/wavefront size and why 64 is a safe default
- Why `Math.random()` cannot be called in a shader — GPU threads have no access to the JS runtime; you must bring your own entropy via the PCG hash trick
- How `bounds-checking` (the `if col >= columns` guard) prevents out-of-bounds writes when `MAX_COLUMNS` is not perfectly divisible by `workgroupSize`

---

### Phase 4 — Texture Atlas: Glyphs on the GPU

**GPU concept taught**: GPU textures, format selection (`rgba8unorm`), texture coordinates (UV space 0→1), nearest vs linear sampling, using Canvas2D as a CPU-side tool to populate GPU texture data.

**What you will learn**: The GPU cannot call `context.fillText()`. Glyph rendering must be baked into a texture at initialization time. The atlas is a grid of N×1 tiles (one per glyph), rendered once to an `OffscreenCanvas` using Canvas2D, then uploaded to the GPU as raw pixel data. The fragment shader samples from the correct tile based on `glyphIndex`. Nearest-neighbor sampling (`magFilter: 'nearest'`) is correct here — we do not want bilinear blur on pixel-font characters.

#### Files to create

- `src/lib/effects/glyph-atlas.ts`
  - Export `ATLAS_GLYPH_W = 16` and `ATLAS_GLYPH_H = 16` (pixel size per glyph cell).
  - Export `buildGlyphAtlas(glyphs: string[], font: string): ImageBitmap`:
    ```typescript
    const canvas = new OffscreenCanvas(glyphs.length * ATLAS_GLYPH_W, ATLAS_GLYPH_H);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    glyphs.forEach((glyph, i) => {
        ctx.fillText(glyph, i * ATLAS_GLYPH_W + ATLAS_GLYPH_W / 2, ATLAS_GLYPH_H / 2);
    });
    return canvas.transferToImageBitmap();
    ```
  - The atlas is white-on-black. The fragment shader multiplies atlas sample by the Matrix green color — this keeps the atlas reusable across different color themes.

#### Files to modify

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts`
  - Add atlas texture and sampler creation in the constructor:
    ```typescript
    const atlasBitmap = buildGlyphAtlas(MATRIX_GLYPHS, `${fontSize}px 'Courier Prime', monospace`);

    this.atlasTexture = root.createTexture({
        size: [GLYPH_COUNT * ATLAS_GLYPH_W, ATLAS_GLYPH_H],
        format: 'rgba8unorm',
    }).$usage('sampled', 'render');

    this.atlasTexture.write(atlasBitmap);

    this.atlasSampler = root.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest',
    });
    ```
  - The `atlasTexture` and `atlasSampler` are stored as instance fields for use in Phase 5.

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Debug step: create a temporary `<img>` element and set its `src` to a `canvas.toDataURL()` of the OffscreenCanvas *before* calling `transferToImageBitmap()`. Visually confirm all 48 glyphs are rendered correctly in a horizontal strip. Remove the debug img before the next phase.
- Confirm `atlasTexture` creation throws no WebGPU validation errors.

#### Learning checkpoint

After this phase you should understand:
- Why glyph rendering must be precomputed: the GPU rasterizer has no font engine; Canvas2D is the best CPU-side tool for this
- Why `rgba8unorm` is the correct format: 8 bits per channel, normalized to `[0, 1]` in shaders, universally supported
- The difference between `nearest` and `linear` sampling and why pixelated text requires nearest
- That `transferToImageBitmap()` zero-copies the canvas pixels — calling `write(bitmap)` uploads them to the GPU

---

### Phase 5 — Render Pipeline: Drawing Glyphs with the Fragment Shader

**GPU concept taught**: Full render pipeline, full-screen triangle technique, fragment shader logic for non-trivial effects, texture sampling in WGSL, bind group layout for mixed resource types (storage buffer + texture + sampler + uniform).

**What you will learn**: The full-screen triangle technique (from `typegpu/common: fullScreenTriangle`) renders exactly 3 vertices that cover the entire canvas in clip space, with `uv` coordinates `[0,0]` to `[1,1]` interpolated across every fragment. Each fragment's position in UV space maps directly to a canvas pixel. The fragment shader performs the entire Matrix Rain visual computation: which column does this pixel belong to, what is that column's current glyph and color tier, what is the vertical distance from the drop head (for the fade trail), and what UV region in the atlas selects the correct character. This is the phase where Canvas2D is fully replaced.

#### Files to modify

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts`
  - Define the render bind group layout:
    ```typescript
    const renderLayout = tgpu.bindGroupLayout({
        dropState:   { storage: d.arrayOf(DropState, MAX_COLUMNS), access: 'readonly' },
        uniforms:    { uniform: RainUniforms },
        atlasTexture: { texture: d.texture2d(d.f32) },
        atlasSampler: { sampler: 'filtering' },
    });
    ```
  - Define the fragment shader:
    ```typescript
    const fragment = tgpu.fragmentFn({
        in:  { uv: d.vec2f },
        out: d.vec4f,
    })((input) => {
        'use gpu';
        const cols = renderLayout.$.uniforms.columns;
        const rows = renderLayout.$.uniforms.rows;

        const col = u32(input.uv.x * f32(cols));
        const row = u32(input.uv.y * f32(rows));

        const drop = renderLayout.$.dropState[col];

        // Vertical distance from the active drop head (in rows)
        const dist = drop.y - f32(row);

        // Fade the trail based on distance: head is brightest (dist==0), fades over ~10 rows
        let alpha = clamp(1.0 - dist / 10.0, 0.0, 1.0);
        if (dist < 0.0 || dist > 12.0) { alpha = 0.0; }

        if (alpha == 0.0) {
            return d.vec4f(0.0, 0.0, 0.0, 0.0);
        }

        // Sample glyph from atlas
        const glyphU = (f32(drop.glyphIndex) + (input.uv.x * f32(cols) - f32(col))) / f32(GLYPH_COUNT);
        const glyphV = input.uv.y * f32(rows) - f32(row);
        const glyphColor = std.textureSample(
            renderLayout.$.atlasTexture,
            renderLayout.$.atlasSampler,
            d.vec2f(glyphU, glyphV)
        );

        // Apply Matrix green tier color
        const tierColors = [
            d.vec3f(0.0,  1.0,   0.255), // #00FF41
            d.vec3f(0.224, 1.0, 0.078),  // #39FF14
            d.vec3f(0.0,  0.8,  0.2),    // #00CC33
            d.vec3f(0.0,  0.239, 0.063), // #003D10
            d.vec3f(0.0,  0.239, 0.063), // #003D10 (repeat tier 4)
            d.vec3f(0.0,  0.133, 0.0),   // #002200
        ];
        const tint = tierColors[clamp(i32(drop.colorTier), 0, 5)];

        return d.vec4f(tint * glyphColor.r * alpha, alpha);
    });
    ```
  - Create the render pipeline:
    ```typescript
    this.renderPipeline = root.createRenderPipeline({
        vertex:   fullScreenTriangle,
        fragment: fragment,
        targets:  { format: navigator.gpu.getPreferredCanvasFormat() },
        primitive: { topology: 'triangle-list' },
    });
    ```
  - Create the render bind group:
    ```typescript
    this.renderBindGroup = root.createBindGroup(renderLayout, {
        dropState:    this.dropStateBuffer,
        uniforms:     this.uniformsBuffer,
        atlasTexture: this.atlasTexture,
        atlasSampler: this.atlasSampler,
    });
    ```
  - Add `drawFrame()` method:
    ```typescript
    drawFrame() {
        this.renderPipeline
            .with(this.renderBindGroup)
            .withColorAttachment({
                view:       this.gpuContext,
                clearValue: [0, 0, 0, 0],
                loadOp:     'clear',
                storeOp:    'store',
            })
            .draw(3);
    }
    ```

- `src/components/design-system/atoms/effects/matrix-rain.tsx`
  - Replace the Canvas2D `drawFrame` call with `gpuRenderer.stepCompute(...); gpuRenderer.drawFrame()` when `mode === 'webgpu'`.
  - The Canvas2D `getContext('2d')` call must be guarded: only run when `mode !== 'webgpu'`.
  - Canvas configuration: when WebGPU is used, `root.configureContext({ canvas, alphaMode: 'premultiplied' })` instead of `canvas.getContext('2d')`.

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser (Chrome): the Matrix Rain should render visually via GPU. Compare side-by-side with Firefox (Canvas2D fallback) — the aesthetics should be nearly identical. Check that columns advance downward and reset.
- Confirm the `reduced-motion` guard still works: with `prefers-reduced-motion: reduce` set in OS, no animation should run (neither Canvas2D nor GPU path).
- Confirm visibility gating still works: scroll a page header out of view and confirm the RAF loop is paused.

#### Learning checkpoint

After this phase you should understand:
- Why the full-screen triangle is 3 vertices, not 4 (a quad is 2 triangles = 6 vertices; a single triangle that extends beyond clip space is cheaper and avoids the diagonal seam)
- How a fragment shader can compute a complete visual effect without explicit geometry — the UV coordinate *is* the canvas position
- The relationship between bind group layout and shader resource declarations — they must be structurally identical
- Why `alphaMode: 'premultiplied'` matters for compositing the GPU canvas over the page background

---

### Phase 6 — Polish, Resize, DPR, and Cleanup

**GPU concept taught**: Resource lifecycle management, buffer resizing strategies, GPU context loss handling, integration with React's effect cleanup.

**What you will learn**: WebGPU resources (buffers, textures, pipelines) are not garbage-collected — they must be explicitly destroyed. `root.destroy()` tears down all resources associated with a `TgpuRoot`. A canvas resize in WebGPU requires reconfiguring the canvas context and potentially reallocating buffers if the column count changes. Context loss (GPU driver crash, sleep) emits a `'webgpucontextlost'` event — handle it by falling back to Canvas2D rather than crashing.

#### Files to modify

- `src/design-system/atoms/effects/matrix-rain/matrix-rain-webgpu.ts`
  - Add `resize(width: number, height: number, fontSize: number)`: recalculates `columns` and `rows`, reinitializes the `dropStateBuffer` with new random positions, writes updated uniforms.
  - Add `destroy()`: calls `root.destroy()` (disposes all TypeGPU resources) and sets all instance fields to null.
  - Ensure the atlas texture is not recreated on resize — it is font-size dependent, not canvas-size dependent. Only recreate if `fontSize` changes.

- `src/components/design-system/atoms/effects/matrix-rain.tsx`
  - Wire the resize debounce to `gpuRenderer.resize(...)` when in WebGPU mode.
  - In the `useEffect` cleanup return, call `gpuRenderer.destroy()`.
  - Add a `canvas.addEventListener('webgpucontextlost', handleContextLost)` listener that sets `mode` back to `'canvas2d'` and re-mounts the Canvas2D path (this is the graceful degradation path for GPU crashes).
  - Remove the `debugRead()` calls added in Phase 2 and any other debug instrumentation.

- `src/types/effects/matrix-rain.ts`
  - Remove `MatrixRainDrawContext.font` field — it was only needed for Canvas2D's `context.font` assignment; GPU path does not use it.
  - Add `MatrixRainGPUContext` interface (mirrors `MatrixRainDrawContext` but holds GPU resource handles).

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser: rapidly resize the window. Confirm the GPU rain reinitializes cleanly with no WebGPU validation errors.
- Simulate context loss: in Chrome DevTools > Application > WebGPU, trigger context loss. Confirm the component falls back to Canvas2D without a white screen or error.
- Firefox: confirm Canvas2D fallback is pixel-identical to the pre-rewrite behavior.
- Check all consumer pages: homepage, 404, offline, chat header, about/clowns header, easter eggs.
- Verify `prefers-reduced-motion` still completely halts animation on both paths.

#### Learning checkpoint

After this phase you should understand:
- Why GPU resources must be explicitly destroyed — GPU memory is not managed by the JS garbage collector
- The mental model of "context loss" — a GPU can be lost at any time; robust apps listen for this event
- Why buffer reallocation on resize requires reinitializing data — a new buffer is zeroed; the old positions must be copied or regenerated
- How React's `useEffect` cleanup function maps to GPU resource lifecycle

---

## Fallback Strategy

### Detection

```typescript
export async function isWebGPUSupported(): Promise<boolean> {
    if (!('gpu' in navigator)) { return false; }
    try {
        const adapter = await navigator.gpu.requestAdapter();
        return adapter !== null;
    } catch {
        return false;
    }
}
```

`navigator.gpu` is absent in Firefox stable (all platforms) and Safari < 18.2. Chrome, Chrome-based browsers (Edge, Arc, Brave), and Safari 18.2+ support WebGPU. The async check handles edge cases like Chromium with `--disable-webgpu` flag and hardware without a compatible GPU.

### Swap Mechanism

The React component holds `mode: 'pending' | 'canvas2d' | 'webgpu'` in a `useRef`. On mount, it runs the async detection in a `useEffect`. While pending, it renders the Canvas2D path (same as today). Once resolved, it either keeps Canvas2D or upgrades to GPU. The component never re-checks after the initial mount — mode is stable for the lifetime of the component.

The same `<canvas>` element is used for both paths. The distinction is which context is acquired: `canvas.getContext('2d')` vs `root.configureContext({ canvas })`. These calls happen inside their respective `useEffect` branches, so only one context is ever active at a time.

### Why This Is Safe

- Consumers (`MatrixBackground`, `MatrixHeaderBackground`, etc.) import `MatrixRain` with no knowledge of GPU internals. The prop API is unchanged.
- Server-side rendering: both `navigator.gpu` and `canvas.getContext` are browser APIs. The `useEffect` guard ensures they are never called during SSR (Next.js App Router). The `<canvas>` element renders to a static DOM node server-side.
- The Canvas2D path is the default — if detection fails for any reason, the experience is identical to today.

---

## Open Questions — Resolve Before Coding

**1. `unplugin-typegpu` with Next.js Webpack**

TypeGPU's `'use gpu'` syntax requires the `unplugin-typegpu/webpack` transform at build time. This plugin must be registered in `next.config.ts` via a `webpack(config)` callback. This is the highest-risk integration step — validate it on a minimal Next.js project before Phase 1 commit. If the plugin causes issues with the React Compiler (also Webpack-based, enabled via `reactCompiler: true`), the fallback is to write all shaders as tagged WGSL template literals (`/* wgsl */\`...\``), which requires no build plugin but loses TypeScript type safety in shader code. Decide this before writing any shader code.

**2. Glyph atlas resolution and font matching**

The current Canvas2D implementation uses `${fontSize}px 'Courier Prime', monospace` and renders at the exact `fontSize` passed in (14 or 16). The atlas bakes glyphs at a fixed pixel size (`ATLAS_GLYPH_W = 16`). If `fontSize = 14`, glyphs will be scaled by 14/16 = 0.875 on the GPU. This is either acceptable (monospace fonts at similar sizes look identical) or requires the atlas to be rebuilt per `fontSize`. Decision: build atlas at `ATLAS_GLYPH_W = fontSize` — one atlas per `fontSize` value, cached in a `Map<number, ImageBitmap>`. Since only two sizes are used in the codebase (14 and 16), the cache is at most 2 entries.

**3. Alpha compositing and page background**

The Canvas2D version uses a semi-transparent `backgroundColor = '#00110010'` fill rect to fade trails. The GPU version uses distance-based alpha in the fragment shader. The canvas must use `alphaMode: 'premultiplied'` to composite correctly over the page's CSS background (`#001100`). Verify that the `glassmorphism` card overlays render correctly on top of the GPU canvas — they are positioned via CSS `z-index`, which works regardless of the canvas rendering mode.

**4. `MAX_COLUMNS` adequacy**

512 columns covers a 14px font on an 8192px-wide display. Verify this is sufficient for the target devices (4K monitors at DPR 2 produce effective widths up to 3840px / 14px ≈ 274 columns). 512 is safe. Document this constant and the calculation in a code comment.

**5. Frame-pacing in the GPU path**

The current Canvas2D implementation measures elapsed time with `performance.now()` and skips frames when `elapsed < timeDistanceBetweenFrames`. The GPU path must preserve this behavior — the compute dispatch and draw call should only execute when the frame interval has elapsed, not every RAF tick. The RAF loop overhead for a no-op GPU frame is negligible, but dispatching the compute shader every 16ms when the effect runs at 20fps (50ms frame interval) wastes GPU cycles.

---

## Recommended Reading Order

Read these before starting each phase. This is not optional — the plan references specific API names that will make no sense without the conceptual background.

### Before Phase 1
- TypeGPU: [Your First GPU Program](https://docs.swmansion.com/TypeGPU/fundamentals/your-first-gpu-program/) — `tgpu.init()`, `createMutable`, `createGuardedComputePipeline`
- WebGPU fundamentals: [WebGPU — All of the Cores, None of the Canvas](https://surma.dev/things/webgpu/) (Surma, Google) — adapter/device model, the mental model of GPU execution
- MDN: [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) — `navigator.gpu.requestAdapter`, `GPUDevice`, `GPUCommandEncoder`

### Before Phase 2
- TypeGPU: [Buffers](https://docs.swmansion.com/TypeGPU/apis/buffers/) — `createBuffer`, `.$usage()`, `read()`, `write()`
- WGSL spec: [Alignment and Size](https://www.w3.org/TR/WGSL/#alignment-and-size) — the table of alignment requirements for every WGSL type. Print this table.
- TypeGPU: [Data Types (`d.*`)](https://docs.swmansion.com/TypeGPU/apis/data/) — `d.struct`, `d.arrayOf`, `d.vec4f`, `d.u32`, `d.f32`

### Before Phase 3
- TypeGPU: [Compute Pipelines](https://docs.swmansion.com/TypeGPU/apis/pipelines/) — `createComputePipeline`, `createGuardedComputePipeline`, `dispatchWorkgroups`, `dispatchThreads`
- WebGPU fundamentals: [Compute Shaders](https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html) — workgroup model, invocation IDs, barriers
- PCG random: [PCG, A Family of Better Random Number Generators](https://www.pcg-random.org/) — understand the hash you are implementing

### Before Phase 4
- TypeGPU: [Textures](https://docs.swmansion.com/TypeGPU/apis/textures/) — `createTexture`, `texture.write()`, `createSampler`, texture views
- WebGPU fundamentals: [Textures](https://webgpufundamentals.org/webgpu/lessons/webgpu-textures.html) — texel formats, mip maps, address modes

### Before Phase 5
- TypeGPU: [Vertices and Fragments](https://docs.swmansion.com/TypeGPU/fundamentals/vertices-and-fragments/) — render pipeline, `vertexFn`, `fragmentFn`, `fullScreenTriangle`
- TypeGPU: [Bind Groups](https://docs.swmansion.com/TypeGPU/apis/bind-groups/) — `tgpu.bindGroupLayout`, `root.createBindGroup`, `.with()`
- WGSL: `textureSample` reference in [WebGPU Shading Language spec, §17](https://www.w3.org/TR/WGSL/#texture-sampling-builtin-functions)

### Before Phase 6
- MDN: [WebGPU context loss](https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext) — `webgpucontextlost` event
- TypeGPU: [Root and Destroy](https://docs.swmansion.com/TypeGPU/apis/root/) — `root.destroy()`, resource ownership model

---

## Out of Scope / Future Ideas

These are natural follow-ups once the GPU mental model is solid. Do not implement them during this rewrite.

**Particle easter egg** — On the Neo room easter egg, switch the Matrix Rain to a GPU particle system where each drop is an actual particle with velocity, mass, and collision response. The `dropStateBuffer` struct already supports this — extend `DropState` with `velocityY: d.f32` and `mass: d.f32`. The compute shader becomes a physics integrator. This requires understanding indirect dispatch (the column count changes dynamically as particles spawn and die).

**GPU complexity heatmap** — During blog post reading, use a second compute pass to accumulate a "heat" buffer (a `d.arrayOf(d.f32, columns * rows)` that increments at the cursor position). The fragment shader blends the heatmap over the Matrix Rain, showing where the reader's attention has been. This requires a second bind group and the concept of multi-pass rendering.

**Chat noise field** — In the AI chat section (`/chat`), replace the static `MatrixHeaderBackground` with a GPU-driven animated noise field (Simplex or Worley noise in WGSL) that responds to the AI streaming output: words appearing increase local noise frequency. This requires uniform buffers updated from React state and the concept of per-frame uniform writes.

**PWA offline visual** — The `offline/page.tsx` uses `MatrixRain` directly. Once the GPU path is stable, add a visual degradation to the GPU rain on the offline page: color shifts from green to red as a signal that the network is unavailable. This is a trivial uniform change — pass `isOffline: d.u32` in `RainUniforms` and branch the color table in the fragment shader.
