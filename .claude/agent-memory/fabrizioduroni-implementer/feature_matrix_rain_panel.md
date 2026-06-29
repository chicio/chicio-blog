---
name: feature-matrix-rain-panel
description: Matrix Rain live control panel — command-palette-triggered drawer for tweaking the WebGPU renderer in real time
metadata:
  type: project
---

## Feature: Matrix Rain Live Control Panel (PR #367, branch feat/matrix-rain-control-panel)

A command-palette-triggered control panel that lets the user tweak the `matrix-rain-webgpu` renderer live, with settings persisted to localStorage and applied globally.

### Entry Point
- Command palette entry: "> Customize Matrix Rain"
- Visibility gate: `webGpuSupported === true && !reducedMotion` (capability detection + motion enabled)
- The command is intentionally NOT gated on runtime WebGPU failure; `webGpuFailed` is LOCAL `useState` inside the `MatrixRain` atom (not a shared store — a shared `use-webgpu-failed` store was considered and removed as over-engineering in the final commit `f567a9ce`)

### Persistence & Global Application
- Settings key: `matrix-rain-settings` (single versioned localStorage key)
- Settings apply globally — the shared `MatrixRain` atom (used in both home hero and header strips) reads from the store, so one panel re-skins both surfaces

### Controls & Critical Constraint
- Controls exposed: Rain density, speed, fontSize; Bloom on/off + intensity/threshold/emission; CRT on/off + scanline/aberration
- Parallax is intentionally NOT exposed as a control
- **Critical package constraint**: In `matrix-rain-webgpu`, changing `cellSize` (fontSize) triggers full WebGPU pipeline teardown/rebuild → visible flash. All other props update smoothly live.
- Implementation: `fontSize` is a **stepped slider that commits ON RELEASE only** (`onPointerUp`/`onMouseUp`); all other controls update live on drag (`onChange`)
- fontSize step values: `{12, 16, 20, 28, 40}` (indices 0–4 into a fixed array)

### Presets
4 presets: **Classic** (= defaults / reset), **Cyberpunk**, **Ghost**, **Overload**
- Classic = package defaults; Cyberpunk = heavy bloom (2.8) + high aberration (2.5); Ghost = sparse (0.97), slow (5Hz), large font (28), no CRT; Overload = dense (0.82), fast (28Hz), tiny font (12), max bloom+scanlines
- Clamp ranges + preset values are marked `// TUNE TO TASTE` in `src/lib/matrix-settings/matrix-settings.ts`

### Clamp Ranges
- density: 0.80–0.99, stepRate: 4–30 Hz
- bloom.intensity: 0.5–3.0, threshold: 0.3–1.2, emission: 1.0–2.5
- crt.scanlineStrength: 0.0–0.8, aberration: 0.0–3.0

### Architecture
Mirrors the existing motion-settings pattern (see [[arch_design_system]]):

| File | Role |
|---|---|
| `src/lib/matrix-settings/matrix-settings.ts` | Defaults, types, presets, read/write/event helpers, `settingsToProps` mapper. Internal-only types must NOT be exported (knip CI failure) |
| `src/lib/matrix-settings/use-matrix-settings-store.ts` | `useSyncExternalStore` hook over the localStorage-backed store |
| `src/components/features/matrix-rain-panel/matrix-rain-control-panel.tsx` | Responsive docked drawer: right side on desktop, bottom sheet on mobile |
| `src/components/design-system/templates/layout-additional-content.tsx` | Mounts panel via `next/dynamic` (ssr: false) |
| `src/components/design-system/organism/command-palette/customize-matrix-rain-item.tsx` | Gated cmdk item |
| `src/lib/command-palette/command-palette-events.ts` | `matrixRainPanelOpenEvent` + `openMatrixRainPanel()` |
| `src/types/configuration/tracking.ts` | `command_palette_open_matrix_rain_panel` + `command_palette_matrix_rain_preset_selected` |

- Panel is **persistent** (Esc or close button; outside clicks pass through — it does not auto-dismiss on outside click)
- Tracking: panel open + preset selection only; no per-tick events

### CI Gotcha
knip failed because internal-only interfaces in `matrix-settings.ts` were exported. Internal-only types/interfaces must NOT be `export`ed — knip treats unused exports as errors.

**Why:** Knip enforces no dead exports; exporting types only consumed by the same file creates a false-positive unused-export error in CI.

**How to apply:** When adding helper types/interfaces to any lib file that are only used within the same file, keep them unexported. Only export what is consumed by other modules.
