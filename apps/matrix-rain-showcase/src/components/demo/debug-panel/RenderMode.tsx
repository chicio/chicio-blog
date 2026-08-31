import { memo } from 'react';

// The rain itself is one mode, customized entirely through the debug panel
// (parallax, and later bloom/CRT/etc. as panel layers). atlas-debug is the
// only alternate view: it shows the raw SDF glyph atlas.
export const RENDER_MODES = ['matrix-rain', 'atlas-debug'] as const;

export type RenderMode = (typeof RENDER_MODES)[number];

// Static — hoisted so the option list isn't rebuilt on every render.
const RENDER_MODE_OPTIONS = RENDER_MODES.map((mode) => (
  <option key={mode} value={mode}>
    {mode}
  </option>
));

type Props = {
  value: RenderMode;
  onChange: (mode: RenderMode) => void;
};

export const RenderModeSelector = memo(function RenderModeSelector({ value, onChange }: Props) {
  return (
    <label className="rail-select">
      <span className="rail-label">Render mode</span>
      <select
        value={value}
        onChange={(e) => {
          onChange(e.target.value as RenderMode);
        }}
      >
        {RENDER_MODE_OPTIONS}
      </select>
    </label>
  );
});
