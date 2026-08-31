export interface RainOptions {
  /**
   * Glyph cell size in CSS pixels.
   * @default 20
   */
  fontSize?: number;
  /**
   * Probability (0..1) that a column does NOT respawn each step — higher = sparser.
   * @default 0.95
   */
  density?: number;
  /**
   * Logical simulation rate in Hz (rows advanced per second).
   * @default 10
   */
  stepRate?: number;
  /**
   * [min, max] trail length in cells, rolled per column.
   * @default [8, 35]
   */
  tailRange?: [number, number];
}

export interface ParallaxOptions {
  /**
   * [min, max] per-column fall speed; the spread is what creates the depth illusion.
   * @default [0.4, 1.5]
   */
  speedRange?: [number, number];
  /**
   * How strongly far (slow) columns are dimmed, 0 (flat) .. 1 (deep).
   * @default 0.3
   */
  depthDim?: number;
}

export interface BloomOptions {
  /**
   * Glow strength multiplier applied to the extracted bright pass.
   * @default 1.5
   */
  intensity?: number;
  /**
   * Brightness above which a pixel contributes to the glow (~0..2).
   * @default 0.8
   */
  threshold?: number;
  /**
   * How hot the heads burn into the HDR target (1 = none). Values >1 push heads
   * above the displayable range, giving the bloom real headroom to extract from.
   * @default 1.1
   */
  emission?: number;
}

export interface CrtOptions {
  /**
   * Scanline darkening depth, 0 (none) .. 1 (heavy).
   * @default 0.3
   */
  scanlineStrength?: number;
  /**
   * Chromatic-aberration offset in pixels (R/B split along x).
   * @default 1.0
   */
  aberration?: number;
}

export interface MatrixRainProps {
  /** Core rain look & cadence: glyph size, density, step rate, trail length. */
  rain?: RainOptions;
  /** Depth illusion via per-column speed spread + far-dimming. `false` disables it. */
  parallax?: ParallaxOptions | false;
  /** Bloom glow pass. `false` disables it. */
  bloom?: BloomOptions | false;
  /** CRT post-process (scanlines + aberration). `false` disables it. */
  crt?: CrtOptions | false;
  /**
   * Freeze on a settled static frame. The single off-state knob: the consumer
   * composes reduced-motion / offscreen / user-toggle into this one boolean.
   * @default false
   */
  paused?: boolean;
  /** Forwarded to the underlying `<canvas>` (which is positioned to fill its parent). */
  className?: string;
  /**
   * Called once if the renderer dies (init failure or a per-frame throw). The
   * effect then stays dead — no auto-retry. If omitted, the error is
   * `console.error`'d instead. Never throws into the host React tree.
   */
  onError?: (err: Error) => void;
}

// `enabled` gates the bloom/crt GPU passes (no parameter value can skip a pass).
// Parallax needs no flag — its disabled state is encoded in the values.
export type Resolved<T> = Required<T> & { enabled: boolean };
export type RainConfig = Required<RainOptions>;
export type BloomConfig = Resolved<BloomOptions>;
export type CrtConfig = Resolved<CrtOptions>;
export type ParallaxConfig = Required<ParallaxOptions>;
