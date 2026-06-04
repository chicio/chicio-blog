# Matrix Rain: TypeGPU + WebGPU Rewrite Plan

## Goal and Non-Goals

**Goal**: Replace the Canvas2D internals of `MatrixRain` with a TypeGPU compute + render pipeline that updates all column drop states in parallel on the GPU each frame and draws glyphs from a prebuilt texture atlas. The public component API (`fontSize`, `frameRate`, `density` props) stays identical. Browsers without WebGPU (Firefox stable, older Safari) fall back automatically to the existing Canvas2D path.

**Non-Goals**:
- Changing any consumer component (`MatrixBackground`, `MatrixHeaderBackground`, `not-found.tsx`, `offline/page.tsx`, etc.)
- Changing the visual appearance — same colors, same katakana glyph set, same density behavior
- Implementing audio-reactive or interactive variants (listed under future ideas)

---

## Library Decisions — Ruled In / Ruled Out

### Ruled IN

- **`typegpu`** — core TypeGPU runtime: typed buffers, shader compilation, root lifecycle
- **`@typegpu/react`** — React integration layer: `<Root>`, `useRoot`, `useFrame`, `useUniform`, `useMutable`, `useReadonly`, `useMirroredUniform`, `useBindGroup`, `useConfigureContext`. We lean into this from Phase 1 — no imperative useEffect wrangling.
- **`unplugin-typegpu/babel`** — Babel variant of the build plugin. Enables the `'use gpu'` TGSL pragma so shader logic is written as TypeScript functions, not WGSL string literals. Babel is the battle-tested variant (used by React Native / Expo); we use the Babel path because of the Turbopack constraint below.

### Ruled OUT

- **`@typegpu/three`** — for authoring Three.js material shaders via TypeGPU (TSL replacement). Overkill for a 2D fullscreen-quad effect; would force `three` as a dependency.
- **Raw WGSL string literals** — defeats the core TypeGPU value proposition (compile-time type safety in shader code). The Babel plugin is the enabler; we use it.

---

## Bundler Reality

Next.js 16.2.6 uses **Turbopack by default** for both `next dev` and `next build` (the default changed in Next.js 16.0.0 — no `--turbopack` flag needed or accepted).

`unplugin-typegpu` does not have a Turbopack plugin — Turbopack does not support webpack plugins (only loaders). However, **Next.js 16's Turbopack auto-detects `babel.config.js`** and runs Babel as an additional pass alongside SWC. SWC still handles TS/JSX/React Compiler/ECMAScript transforms; Babel only adds the TypeGPU plugin pass on top.

**Path**: add `babel.config.js` at project root with `plugins: ['unplugin-typegpu/babel']`. Keep `next dev` / `next build` as-is.

```js
// babel.config.js
module.exports = { plugins: ['unplugin-typegpu/babel'] };
```

**Risk to validate in Phase 0**:
- React Compiler interaction (`reactCompiler: true` is enabled in `next.config.ts`) — confirm Babel pass does not conflict
- `@typegpu/react@0.11.1` is a young package (13 published versions, no declared React peer dep, no documented App Router / RSC / Suspense behavior)

**Fallback if Phase 0 fails**: switch scripts to `next dev --webpack` / `next build --webpack` and use `unplugin-typegpu/webpack` instead. Loses Turbopack perf but gives certainty.

---

## Learning Objectives

This rewrite is a structured course in GPU programming. Each phase explicitly teaches one layer of the GPU mental model:

| Phase | Core concept taught |
|-------|---------------------|
| 0 | Toolchain smoke test: Turbopack + Babel + TypeGPU + `@typegpu/react` in App Router |
| 1 | WebGPU feature detection, `<Root>` + Suspense boundary, `useConfigureContext`, Canvas2D fallback wiring |
| 2 | WGSL struct memory layout, `d.struct` alignment, `useMutable` typed storage buffers |
| 3 | Compute shaders, workgroup sizing, parallel dispatch, `'use gpu'` pragma via `useFrame` |
| 4 | Texture creation, glyph atlas via OffscreenCanvas, samplers |
| 5 | Render pipeline, full-screen triangle, fragment shader compositing, `useBindGroup` |
| 6 | Resource lifecycle, resize, context loss, `useMirroredUniform` for prop → uniform sync |

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
  <Suspense fallback={null}>
    <Root>
      <MatrixRainGPU> (new)
           |
           +-- useConfigureContext({ canvas })  -->  GPUCanvasContext
           |
           +-- BUFFERS (via useMutable / useReadonly)
           |    DropState buffer   d.arrayOf(DropState, MAX_COLUMNS)   storage mutable
           |    Uniforms buffer    d.struct({ columns, rows, density, frameTime })   uniform
           |
           +-- COMPUTE PASS  (Phase 3)
           |    tgpu.computeFn({ workgroupSize: [64] }) via useFrame
           |    input: globalInvocationId.x = column index
           |    reads: DropState[x].y, uniforms.rows, uniforms.density
           |    writes: DropState[x].y++, resets when y > rows && rand > density
           |    DropState also carries: glyphIndex (u32), colorTier (u32)
           |
           +-- TEXTURE ATLAS  (Phase 4)
           |    48 glyphs × 16px grid rendered once to an offscreen Canvas2D
           |    Uploaded to GPU texture (format: 'rgba8unorm')
           |    sampler: nearest filter (pixel-perfect at integer glyph sizes)
           |
           +-- RENDER PASS  (Phase 5)
                vertexFn = fullScreenTriangle (typegpu/common)
                fragmentFn via useBindGroup:
                  - reads DropState storage buffer (readonly)
                  - reads uniforms
                  - for each fragment: compute column = floor(uv.x * columns)
                                               row    = floor(uv.y * rows)
                  - look up active glyph in DropState[column]
                  - sample atlas texture at glyph UV region
                  - apply color from colorTier threshold table (vec4f constants)
                  - alpha-blend trail based on distance from drop head
                draw(3)  -- full-screen triangle, 3 vertices
    </Root>
  </Suspense>
```

---

## Fallback Strategy

### WebGPU detection → Suspense decision

WebGPU feature detection happens **before** any Suspense or Root mounting:

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

`navigator.gpu` is absent in Firefox stable (all platforms) and Safari < 18.2. Chrome, Chrome-based browsers (Edge, Arc, Brave), and Safari 18.2+ support WebGPU. The async check handles edge cases like Chromium with `--disable-webgpu` and hardware without a compatible GPU.

### Rendering paths

- **No WebGPU** → render the existing Canvas2D `MatrixRain` directly. No Suspense involved. This is the degradation path, not a loading state.
- **WebGPU present** → `<Suspense fallback={null}><Root>…</Root></Suspense>`. The wrapper div carries `bg-[#001100]` (deep Matrix green) so there is zero perceived flash during the ~10–50ms device-init window.

### Why `fallback={null}` (not Canvas2D as Suspense fallback)

The user explicitly chose this. Canvas2D is the no-WebGPU degradation path; it is NOT a loading placeholder. Mixing it in as a Suspense fallback would cause a visual swap when GPU becomes ready and makes the component tree more complex for no gain.

### Phase 6 enhancement (optional)

Eager singleton `tgpu.init()` at module-load time so the home page never sees suspension after the first navigation in a session.

### Safety guarantees

- Consumers (`MatrixBackground`, `MatrixHeaderBackground`, etc.) import `MatrixRain` with no knowledge of GPU internals — prop API unchanged.
- SSR: `navigator.gpu` and canvas APIs are browser-only; the detection hook runs in `useEffect`, never during server render.
- The Canvas2D path is the default — if detection fails for any reason, the experience is identical to today.

---

## Phased Implementation Plan

### Phase 0 — Full-Stack Toolchain Smoke Test

**Learning objective**: Validate the entire Turbopack + Babel + TypeGPU + `@typegpu/react` stack on the actual chicio-blog codebase before writing any Matrix Rain code. Catch incompatibilities in 30 minutes, not mid-Phase-3.

#### Steps

1. Install dependencies:
   ```bash
   npm install typegpu @typegpu/react
   npm install --save-dev unplugin-typegpu @webgpu/types
   ```

2. Create `babel.config.js` at project root:
   ```js
   module.exports = { plugins: ['unplugin-typegpu/babel'] };
   ```

3. Update `tsconfig.json`: add `"@webgpu/types"` to the `compilerOptions.types` array.

4. Create a hidden smoke-test route at `src/app/playground/page.tsx` (check existing `app/` conventions first). Mark it `'use client'`. Structure:
   ```tsx
   <Suspense fallback={null}>
     <Root>
       <PulseCanvas />
     </Root>
   </Suspense>
   ```
   `PulseCanvas` uses:
   - `useConfigureContext` — wires a canvas ref to the WebGPU context
   - `useMirroredUniform` — syncs a React `useState` value (e.g. `time`) to a GPU uniform
   - `useFrame` — RAF loop that increments time and dispatches a minimal compute fn (clears canvas to a color that pulses based on the uniform)
   - The shader's only job: clear to `vec4(0, sin(uniforms.time) * 0.5 + 0.5, 0, 1)` — a pulsing green

5. Pass/fail gate — ALL of these must pass:
   - `npm run dev` boots without errors
   - The canvas pulses green in the browser at `/playground`
   - `npm run build` succeeds
   - No React Compiler bail-outs in the console
   - No hydration warnings
   - Hot reload survives editing the shader function body

6. If any gate fails → engage the webpack fallback: add `--webpack` to the `dev` and `build` scripts in `package.json`, replace `babel.config.js` with `unplugin-typegpu/webpack` registration in `next.config.ts`, re-run the gate.

7. Learning checkpoint: understand how Babel-in-Turbopack works, how `<Root>` + Suspense behave inside App Router client components, and whether the React Compiler and TypeGPU Babel plugin coexist cleanly.

#### Recommended reading
- TypeGPU getting started: https://docs.swmansion.com/TypeGPU/fundamentals/your-first-gpu-program/
- `@typegpu/react` hooks reference: https://docs.swmansion.com/TypeGPU/
- `unplugin-typegpu/babel` docs (README of the unplugin-typegpu package)
- Next.js 16 Turbopack + Babel docs
- React 19 Suspense docs

---

### Phase 1 — Component Shell, WebGPU Detection, Canvas2D Fallback Wiring

**Learning objective**: WebGPU feature detection (async, not just a property check), App Router Suspense boundaries, `useConfigureContext`, zero-flash wrapper pattern.

#### What you will learn

`navigator.gpu` is absent in Firefox stable and older Safari — that is the natural feature-detection gate. But the check must be async: even when `navigator.gpu` exists, `requestAdapter()` can return null (software rasterizer disabled, hardware incompatible). TypeGPU's `<Root>` suspends while the device initializes — wrapping it in `<Suspense fallback={null}>` with a CSS background on the outer div gives zero visual flash during the ~10–50ms init window.

#### Files to create

- `src/lib/webgpu/webgpu-detection.ts`
  - Export `async function isWebGPUSupported(): Promise<boolean>` — checks `navigator.gpu`, calls `requestAdapter()`, returns false on null or thrown error.

- `src/components/design-system/atoms/effects/matrix-rain/` (new directory)
  - `matrix-rain-canvas2d.tsx` — the current `matrix-rain.tsx` moved here, component renamed `MatrixRainCanvas2DRenderer`
  - `matrix-rain-gpu.tsx` — stub client component: `<Root><canvas ref={canvasRef} /></Root>` with `useConfigureContext`. No rendering yet.
  - `matrix-rain.tsx` — new wrapper:
    - `useEffect` on mount: calls `isWebGPUSupported()`, stores result in `useRef<boolean | null>` (null = pending)
    - While pending: renders `<MatrixRainCanvas2DRenderer>` (same as today)
    - On resolve: either keeps Canvas2D or renders `<Suspense fallback={null}><Root><MatrixRainGPURenderer /></Root></Suspense>`
    - Wrapper div gets `className="bg-[#001100]"` for the zero-flash guarantee

#### Files to modify

- `src/types/effects/matrix-rain.ts`
  - Add `MatrixRainMode = 'canvas2d' | 'webgpu' | 'pending'` union type

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed; stub should not break anything
- Browser: any matrix rain page still renders via Canvas2D (GPU stub does nothing). No errors.
- Firefox: Canvas2D renders, no WebGPU code executed.

#### Recommended reading
- MDN `navigator.gpu` detection
- WebGPU canvas context configuration
- TypeGPU `useConfigureContext` docs

---

### Phase 2 — Column State via TypeGPU Structs and `useMutable`

**Learning objective**: WGSL struct memory layout and alignment (std140/std430), TypeGPU's typed buffer API, the real "type-safe WebGPU" win.

#### What you will learn

GPUs impose strict alignment rules on struct fields. A `vec3f` followed by a `u32` is not 16 bytes — the `u32` must be padded to a 16-byte boundary. TypeGPU's `d.struct` handles this automatically, but understanding *why* it pads is the lesson. Storage buffers (`useMutable`) are large, per-element random-access. Uniform buffers are capped at 64KB and broadcast to all shader invocations (canvas width, density). You will create both and read them back from JS to confirm the values.

#### Files to create

- `src/types/effects/matrix-rain-webgpu-state.ts`
  ```typescript
  import { d } from 'typegpu';

  export const DropState = d.struct({
      y:          d.f32,    // current y position in rows (float for smooth reset)
      glyphIndex: d.u32,    // index into the 48-glyph atlas
      colorTier:  d.u32,    // 0–5, maps to the 6-color threshold table
  });

  export const RainUniforms = d.struct({
      columns:   d.u32,
      rows:      d.u32,
      density:   d.f32,
      frameTime: d.f32,    // seconds, for seeding GPU pseudo-random
  });

  export const MAX_COLUMNS = 512;   // 14px font on 4K DPR2 → ~274 cols; 512 is safe
  export const GLYPH_COUNT = 48;    // 36 katakana + 12 punctuation/digits
  ```

- Rename `src/types/effects/matrix-rain.ts` fields as needed; keep `MatrixRainDrawContext` for Canvas2D path only.

#### Files to modify

- `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-gpu.tsx`
  - Add `useMutable(d.arrayOf(DropState, MAX_COLUMNS))` — typed storage buffer
  - Add `useUniform(RainUniforms)` — uniform buffer
  - Add a temporary `debugRead` call: log first 5 `DropState` entries to confirm zero-initialization

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser (Chrome): console shows 5 `DropState` objects with zero values
- Run `console.log(d.sizeOf(DropState))` — should be 12 bytes (3 × 4, all naturally aligned). Try a struct with `vec3f + u32` and compare `d.sizeOf` against hand-calculation to internalize padding.

#### Recommended reading
- TypeGPU Buffers: https://docs.swmansion.com/TypeGPU/apis/buffers/
- WGSL Alignment and Size spec: https://www.w3.org/TR/WGSL/#alignment-and-size
- TypeGPU Data Types (`d.*`): https://docs.swmansion.com/TypeGPU/apis/data/

---

### Phase 3 — Compute Pipeline via `'use gpu'` Functions and `useFrame`

**Learning objective**: Compute shaders, workgroup sizing, parallel dispatch, the TGSL pragma, pseudo-random numbers on the GPU.

#### What you will learn

A compute shader executes one invocation per data element — here, one per column. `globalInvocationId.x` identifies which column this invocation owns. All invocations run simultaneously; the `for` loop in `drawFrame` is replaced by the dispatch. WGSL has no `Math.random()` — you implement a PCG hash using invocation ID and `frameTime` as seed. `useFrame` provides the RAF integration; the compute dispatch goes inside it.

**Workgroup size**: `[64, 1, 1]`. Matches warp/wavefront size on most desktop GPUs. For 512 columns: dispatch `Math.ceil(columns / 64)` workgroups.

#### Files to modify

- `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-gpu.tsx`
  - Define compute function with `'use gpu'` pragma:
    ```typescript
    const updateDrops = tgpu.computeFn({
        in: { gid: d.builtin.globalInvocationId },
        workgroupSize: [64, 1, 1],
    })((input) => {
        'use gpu';
        const col = input.gid.x;
        if (col >= uniforms.value.columns) { return; }

        // PCG hash for GPU pseudo-random
        let state = col * 747796405u + bitcast<u32>(uniforms.value.frameTime);
        state = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
        state = (state >> 22u) ^ state;
        const rand = f32(state) / f32(0xFFFFFFFFu);

        const drop = dropState.value[col];
        const rows = uniforms.value.rows;

        let newY = drop.y + 1.0;
        if (newY > f32(rows) && rand > uniforms.value.density) {
            newY = 0.0;
        }

        dropState.value[col] = DropState(newY, u32(rand * f32(GLYPH_COUNT)), u32(rand * 6.0));
    });
    ```
  - Wire into `useFrame`: write updated uniforms each frame, dispatch `Math.ceil(columns / 64)` workgroups
  - Initialize `dropStateBuffer` with scattered y positions (matches current `initializeDrops` behavior so effect starts populated)

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser (Chrome): log `dropState` values after 10 frames — `y` values incrementing and resetting, non-zero and scattered
- WebGPU DevTools panel: no validation errors
- Canvas2D placeholder still renders (compute runs independently)

#### Recommended reading
- TypeGPU Compute Pipelines: https://docs.swmansion.com/TypeGPU/apis/pipelines/
- WebGPU Fundamentals — Compute Shaders: https://webgpufundamentals.org/webgpu/lessons/webgpu-compute-shaders.html
- PCG random: https://www.pcg-random.org/

---

### Phase 4 — Glyph Atlas via OffscreenCanvas → GPU Texture

**Learning objective**: GPU textures, format selection (`rgba8unorm`), texture coordinates (UV space 0→1), nearest vs linear sampling, using Canvas2D as a CPU-side tool to populate GPU texture data.

#### What you will learn

The GPU cannot call `context.fillText()`. Glyph rendering must be baked into a texture at initialization time. The atlas is an N×1 tile grid (one per glyph), rendered once to an `OffscreenCanvas` using Canvas2D, then uploaded to GPU as raw pixel data. The fragment shader samples the correct tile based on `glyphIndex`. Nearest-neighbor sampling (`magFilter: 'nearest'`) prevents bilinear blur on pixel-font characters.

#### Files to create

- `src/lib/effects/glyph-atlas.ts`
  - Export `ATLAS_GLYPH_W = 16`, `ATLAS_GLYPH_H = 16`
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
  - White-on-black atlas; fragment shader multiplies by Matrix green — keeps atlas theme-agnostic.
  - Cache built atlases in `Map<number, ImageBitmap>` keyed by `fontSize` — only two sizes used in the codebase (14, 16).

#### Files to modify

- `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-gpu.tsx`
  - Build atlas on mount via `useMemo` (keyed by `fontSize`)
  - Upload to GPU texture (`format: 'rgba8unorm'`, `usage: 'sampled'`)
  - Create sampler: `magFilter: 'nearest'`, `minFilter: 'nearest'`

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Debug: temporarily render `canvas.toDataURL()` as an `<img>` before `transferToImageBitmap()` — confirm all 48 glyphs visible in a horizontal strip. Remove before next phase.
- No WebGPU validation errors on texture creation.

#### Recommended reading
- TypeGPU Textures: https://docs.swmansion.com/TypeGPU/apis/textures/
- WebGPU Fundamentals — Textures: https://webgpufundamentals.org/webgpu/lessons/webgpu-textures.html

---

### Phase 5 — Render Pipeline, Fragment Shader, `useBindGroup`

**Learning objective**: Full render pipeline, full-screen triangle technique, fragment shader logic for non-trivial effects, texture sampling in WGSL, `useBindGroup` for mixed resource types.

#### What you will learn

The full-screen triangle technique (`fullScreenTriangle` from `typegpu/common`) renders 3 vertices that cover the entire canvas in clip space, with UV coordinates `[0,0]→[1,1]` interpolated across every fragment. Each fragment's UV maps directly to a canvas pixel. The fragment shader performs the entire Matrix Rain computation: which column, what glyph, what color tier, how far from the drop head (for trail fade). This is the phase where Canvas2D is fully replaced. `useBindGroup` wires the storage buffer, texture, sampler, and uniform into the shader.

#### Files to modify

- `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-gpu.tsx`
  - Define render bind group layout and fragment shader:
    ```typescript
    const fragment = tgpu.fragmentFn({
        in:  { uv: d.vec2f },
        out: d.vec4f,
    })((input) => {
        'use gpu';
        const cols = uniforms.value.columns;
        const rows = uniforms.value.rows;
        const col = u32(input.uv.x * f32(cols));
        const row = u32(input.uv.y * f32(rows));
        const drop = dropState.value[col];

        const dist = drop.y - f32(row);
        let alpha = clamp(1.0 - dist / 10.0, 0.0, 1.0);
        if (dist < 0.0 || dist > 12.0) { alpha = 0.0; }
        if (alpha == 0.0) { return d.vec4f(0.0, 0.0, 0.0, 0.0); }

        const glyphU = (f32(drop.glyphIndex) + (input.uv.x * f32(cols) - f32(col))) / f32(GLYPH_COUNT);
        const glyphV = input.uv.y * f32(rows) - f32(row);
        const glyphSample = std.textureSample(atlasTexture, atlasSampler, d.vec2f(glyphU, glyphV));

        const tierColors = [
            d.vec3f(0.0,  1.0,   0.255),  // #00FF41
            d.vec3f(0.224, 1.0,  0.078),  // #39FF14
            d.vec3f(0.0,  0.8,   0.2),    // #00CC33
            d.vec3f(0.0,  0.239, 0.063),  // #003D10
            d.vec3f(0.0,  0.239, 0.063),  // #003D10
            d.vec3f(0.0,  0.133, 0.0),    // #002200
        ];
        const tint = tierColors[clamp(i32(drop.colorTier), 0, 5)];
        return d.vec4f(tint * glyphSample.r * alpha, alpha);
    });
    ```
  - Wire `useBindGroup` with dropState (readonly), uniforms, atlasTexture, atlasSampler
  - In `useFrame`: dispatch compute → draw render pass (3 vertices, full-screen triangle)
  - Canvas context: `alphaMode: 'premultiplied'` for correct compositing over the page CSS background `#001100`
  - Remove Canvas2D placeholder draw calls

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Browser (Chrome): Matrix Rain renders via GPU. Compare with Firefox (Canvas2D fallback) — aesthetics nearly identical.
- `prefers-reduced-motion`: no animation on either path.
- IntersectionObserver visibility gating still pauses RAF when canvas is off-screen.

#### Recommended reading
- TypeGPU Vertices and Fragments: https://docs.swmansion.com/TypeGPU/fundamentals/vertices-and-fragments/
- TypeGPU Bind Groups: https://docs.swmansion.com/TypeGPU/apis/bind-groups/
- WGSL `textureSample`: https://www.w3.org/TR/WGSL/#texture-sampling-builtin-functions

---

### Phase 6 — Polish: Resize, Context Loss, `useMirroredUniform`, Cleanup

**Learning objective**: WebGPU resource lifecycle in a React app, resize strategies, context loss handling, `useMirroredUniform` for React prop → GPU uniform sync.

#### What you will learn

WebGPU resources are not garbage-collected — `<Root>` teardown (or `useRoot().destroy()`) disposes them. A canvas resize in WebGPU requires reconfiguring the canvas context and potentially reallocating buffers if the column count changes. Context loss (GPU driver crash, sleep) emits a `'webgpucontextlost'` event — handle it by falling back to Canvas2D. `useMirroredUniform` provides the idiomatic `@typegpu/react` pattern for syncing React props (`density`, `speed`, `color`) to GPU uniforms without manual `useEffect` writes.

#### Files to modify

- `src/components/design-system/atoms/effects/matrix-rain/matrix-rain-gpu.tsx`
  - Replace manual uniform writes with `useMirroredUniform` for `density` and any future props exposed as GPU-side values
  - Add resize handler: recalculate `columns` / `rows`, reinitialize drop positions, update uniforms. Atlas texture is font-size dependent — only rebuild if `fontSize` prop changes.
  - Add `canvas.addEventListener('webgpucontextlost', ...)` → set mode back to `'canvas2d'`
  - Remove `debugRead()` and all debug instrumentation from Phase 2
  - Optional: eager singleton `tgpu.init()` at module load so subsequent navigations never see the Suspense window

- `src/types/effects/matrix-rain.ts`
  - Remove `MatrixRainDrawContext.font` field (Canvas2D only)
  - Verify `MatrixRainMode` covers all states including context loss

#### Verification

- `npm run lint` — zero errors
- `npm run build` — must succeed
- Rapid window resize: GPU rain reinitializes cleanly, no WebGPU validation errors
- Chrome DevTools → simulate context loss: component falls back to Canvas2D without crash
- Firefox: Canvas2D fallback pixel-identical to pre-rewrite behavior
- All consumer pages: homepage, 404, offline, chat header, about/clowns header, easter eggs
- `prefers-reduced-motion` halts animation on both paths

#### Recommended reading
- MDN WebGPU context loss: https://developer.mozilla.org/en-US/docs/Web/API/GPUCanvasContext
- TypeGPU Root and Destroy: https://docs.swmansion.com/TypeGPU/apis/root/
- React 19 cleanup patterns (useEffect return value, ref callbacks)

---

## Open Questions — Resolve Before Coding

**1. Glyph atlas construction strategy**

Pre-rendered at build time and shipped as a static asset, or built at runtime via OffscreenCanvas on first mount? Current plan: runtime via OffscreenCanvas (simpler, no build pipeline change, cached in a `Map<number, ImageBitmap>` for the two font sizes used). Build-time is worth revisiting if atlas construction ever shows on the performance profile.

**2. `<Root>` placement**

Mount `<Root>` inside each `<MatrixRain>` instance (simpler, each instance has its own GPU device, no cross-component state) or hoist to the layout client wrapper (shared device, lower init cost on subsequent navigations within the same session)? Start per-instance for simplicity; hoist in Phase 6 or as a follow-up if profiling shows device init is a bottleneck.

**3. Alpha compositing and page background**

The Canvas2D version uses a semi-transparent `backgroundColor = '#00110010'` fill rect to fade trails. The GPU version uses distance-based alpha in the fragment shader. Verify the `glassmorphism` card overlays render correctly on top of the GPU canvas — they are positioned via CSS `z-index`, which works regardless of canvas rendering mode.

**4. `MAX_COLUMNS` adequacy**

512 columns covers a 14px font on an 8192px-wide display. A 4K monitor at DPR 2 produces effective width ~3840px / 14px ≈ 274 columns. 512 is safe. Document this constant and the calculation in a code comment.

**5. Frame-pacing in the GPU path**

Preserve the elapsed-time gate from Canvas2D (`elapsed < timeDistanceBetweenFrames` check in RAF). The compute dispatch should only execute when the frame interval has elapsed, not every RAF tick. `useFrame` may handle this — verify whether it provides a delta-time API or if the guard needs to be implemented manually.

---

## Out of Scope / Future Ideas

These are natural follow-ups once the GPU mental model is solid. Do not implement them during this rewrite.

**Particle easter egg** — On the Neo room easter egg, switch the Matrix Rain to a GPU particle system where each drop is an actual particle with velocity, mass, and collision response. Extend `DropState` with `velocityY: d.f32` and `mass: d.f32`. The compute shader becomes a physics integrator. Requires indirect dispatch.

**GPU complexity heatmap** — During blog post reading, use a second compute pass to accumulate a "heat" buffer that increments at the cursor position. Fragment shader blends heatmap over Matrix Rain. Requires multi-pass rendering.

**Chat noise field** — In `/chat`, replace the static `MatrixHeaderBackground` with a GPU-driven noise field (Simplex or Worley in WGSL) responding to AI streaming output. Requires per-frame uniform writes from React state.

**PWA offline visual** — On `offline/page.tsx`, shift GPU rain colors from green to red when network is unavailable. Trivial uniform change: pass `isOffline: d.u32` in `RainUniforms`, branch the color table in the fragment shader.
