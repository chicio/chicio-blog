import { memo, useEffect, useState } from 'react';
import type { RefObject } from 'react';

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fpsRef: RefObject<HTMLElement | null>;
  columnCount: number | null;
};

type LogEntry = {
  id: number;
  kind: 'error' | 'rejection';
  message: string;
};

const MAX_LOG_ENTRIES = 50;

// memo: props are stable refs + a rarely-changing columnCount, so this bails out
// of the panel's per-slider-drag re-render churn (its own state drives updates).
export const Observability = memo(function Observability({ canvasRef, fpsRef, columnCount }: Props) {
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [dpr, setDpr] = useState(1);
  const [errors, setErrors] = useState<LogEntry[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // dpr is read here (not via a lazy useState init) so it tracks
    // cross-monitor drag and browser zoom: both change devicePixelRatio,
    // typegpu's autoResize then resizes the canvas, which re-fires this RO.
    const read = () => {
      setSize({ w: canvas.width, h: canvas.height });
      setDpr(window.devicePixelRatio);
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(canvas);
    return () => {
      ro.disconnect();
    };
  }, [canvasRef]);

  useEffect(() => {
    let nextId = 0;
    const push = (kind: LogEntry['kind'], message: string) => {
      setErrors((prev) => [{ id: nextId++, kind, message }, ...prev].slice(0, MAX_LOG_ENTRIES));
    };

    const onError = (event: ErrorEvent) => {
      push('error', event.message || String(event.error));
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as unknown;
      push('rejection', reason instanceof Error ? reason.message : String(reason));
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return (
    <div className="rail-section">
      <h3 className="rail-heading">Observability</h3>
      <dl className="rail-stats">
        <dt>FPS</dt>
        <dd ref={fpsRef}>—</dd>
        <dt>size</dt>
        <dd>
          {size.w}×{size.h}
          <span className="rail-stat-aux"> @ {dpr.toFixed(2)}x</span>
        </dd>
        <dt>columns</dt>
        <dd>{columnCount == null ? '—' : columnCount}</dd>
      </dl>
      <div className="rail-console">
        {errors.length === 0 ? (
          <p className="rail-console-empty">No errors.</p>
        ) : (
          errors.map((entry) => (
            <p key={entry.id} className={`rail-console-line rail-console-${entry.kind}`}>
              <span className="rail-console-kind">{entry.kind}</span>
              <span className="rail-console-msg">{entry.message}</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
});
