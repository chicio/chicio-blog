import type { RefObject } from 'react';

import { Effects, type EffectsProps } from './Effects';
import { Observability } from './Observability';
import { RenderModeSelector, type RenderMode } from './RenderMode';

type Props = EffectsProps & {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renderMode: RenderMode;
  onRenderModeChange: (mode: RenderMode) => void;
  fpsRef: RefObject<HTMLElement | null>;
  columnCount: number | null;
};

export function DebugPanel({
  canvasRef,
  open,
  onOpenChange,
  renderMode,
  onRenderModeChange,
  fpsRef,
  columnCount,
  ...effectsProps
}: Props) {
  return (
    <>
      {/* Floating trigger — only shown on narrow screens (CSS). Toggles the drawer. */}
      <button
        type="button"
        id="panel-toggle"
        aria-label={open ? 'Close debug panel' : 'Open debug panel'}
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        {open ? '✕' : '☰'}
      </button>
      {/* Backdrop — tap to dismiss the drawer (mobile only). */}
      <div id="panel-backdrop" data-open={open || undefined} onClick={() => onOpenChange(false)} />
      <aside id="rail" data-open={open || undefined}>
        <Effects {...effectsProps} />
        <div className="rail-section">
          <h3 className="rail-heading">Render Mode</h3>
          <RenderModeSelector value={renderMode} onChange={onRenderModeChange} />
        </div>
        <Observability canvasRef={canvasRef} fpsRef={fpsRef} columnCount={columnCount} />
      </aside>
    </>
  );
}
