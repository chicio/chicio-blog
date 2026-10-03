---
name: feature-matrix-rain-panel
description: Matrix Rain live control panel — command-palette-triggered drawer for tweaking the WebGPU renderer in real time
metadata:
  type: project
---

## Feature: Matrix Rain Live Control Panel (PR #367, branch feat/matrix-rain-control-panel)

A command-palette-triggered control panel that lets the user tweak the `matrix-rain-webgpu` renderer live, with settings persisted to localStorage and applied everywhere the rain renders (a Shared Store; vocabulary in
packages/matrix-rain-webgpu/CONTEXT.md and packages/matrix-design-system/CONTEXT.md).

### Entry Point
- Command palette entry: "> Customize Matrix Rain"
- Visibility gate: `webGpuSupported === true && !reducedMotion` (capability detection + `useReducedMotions()` false)
- The command is intentionally NOT gated on runtime WebGPU failure; `webGpuFailed` is LOCAL `useState` inside the `MatrixRain` atom (not a Shared Store — a shared `use-webgpu-failed` store was considered and removed as over-engineering in the final commit `f567a9ce`)

### Persistence & Global Application
- Settings key: `matrix-rain-settings` (single versioned localStorage key)
- Settings apply everywhere — the shared `MatrixRain` atom (used in both home hero and header strips) reads from the store, so one panel re-skins both surfaces

### Controls & Critical Constraint
- Controls exposed: Rain density, speed, fontSize; Bloom on/off + intensity/threshold/emission; CRT on/off + scanline/aberration
- Parallax is intentionally NOT exposed as a control
- **Critical package constraint**: In `matrix-rain-webgpu`, changing `cellSize` (fontSize) triggers full WebGPU pipeline teardown/rebuild → visible flash. All other props update smoothly live.
- Implementation: `fontSize` is a **stepped slider that commits ON RELEASE only** (`onPointerUp`/`onMouseUp`); all other controls update live on drag (`onChange`)
- fontSize step values: `{12, 16, 20, 28, 40}` (indices 0–4 into a fixed array)

### Presets
Now 3 presets (verified 2026-09-27; `MATRIX_RAIN_PRESETS`): **Classic** (= defaults / reset), **Cyberpunk**, **Overload**.
The original **Ghost** preset has been removed.
- Classic = package defaults; Cyberpunk = heavy bloom (2.8) + high aberration (2.8); Overload = dense (0.82), fast (28Hz), tiny font (12), max bloom+scanlines
- Note: Density in the rain is the per-Step chance a Column keeps waiting, so a HIGHER density is SPARSER rain

### Clamp Ranges
- density: 0.80–0.99, stepRate: 4–30 Hz
- bloom.intensity: 0.5–3.0, threshold: 0.3–1.2, emission: 1.0–2.5
- crt.scanlineStrength: 0.0–0.8, aberration: 0.0–3.0

### Architecture
Mirrors the Motion Preference Shared Store pattern (see [[arch_design_system]]). Paths verified 2026-09-27:

| File | Role |
|---|---|
| `packages/matrix-design-system/src/state/matrix-rain/matrix-settings.ts` | Defaults, types, presets, read/write/event helpers, `settingsToProps` mapper. Internal-only types must NOT be exported (knip CI failure) |
| `packages/matrix-design-system/src/hooks/use-matrix-settings-store.ts` | `useSyncExternalStore` hook over the localStorage-backed Shared Store |
| `apps/website/src/components/features/matrix-rain-panel/matrix-rain-control-panel/matrix-rain-control-panel.tsx` | Responsive docked drawer: right side on desktop, bottom sheet on mobile |
| `apps/website/src/components/features/layout-additional-content/layout-additional-content.tsx` | Mounts panel via `next/dynamic` (ssr: false) |
| `apps/website/src/components/features/command-palette/site-command-palette/customize-matrix-rain-item/` | Gated cmdk item |
| `apps/website/src/lib/matrix-rain/matrix-rain-panel-events.ts` | `matrixRainPanelOpenEvent` + `openMatrixRainPanel()` |
| `apps/website/src/types/configuration/tracking.ts` | `command_palette_open_matrix_rain_panel` + `command_palette_matrix_rain_preset_selected` |

- Panel is **persistent** (Esc or close button; outside clicks pass through — it does not auto-dismiss on outside click)
- Tracking: panel open + preset selection only; no per-tick events

### CI Gotcha
knip failed because internal-only interfaces in `matrix-settings.ts` were exported. Internal-only types/interfaces must NOT be `export`ed — knip treats unused exports as errors.

**Why:** Knip enforces no dead exports; exporting types only consumed by the same file creates a false-positive unused-export error in CI.

**How to apply:** When adding helper types/interfaces to any lib file that are only used within the same file, keep them unexported. Only export what is consumed by other modules.
