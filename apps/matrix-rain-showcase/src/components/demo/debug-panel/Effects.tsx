import { memo, useCallback } from 'react';

import { Group } from './Group';
import { Slider } from './Slider';
import { Toggle } from './Toggle';

type ButtonProps = {
  label: string;
  onClick?: () => void;
};

function Button({ label, onClick }: ButtonProps) {
  return (
    <button type="button" className="rail-button" disabled={!onClick} onClick={onClick}>
      {label}
    </button>
  );
}

export type EffectsProps = {
  density: number;
  stepRate: number;
  fontSize: number;
  atlasLayer: number;
  atlasLayerMax: number;
  atlasDebugActive: boolean;
  speedRange: [number, number];
  tailRange: [number, number];
  depthDim: number;
  bloomEnabled: boolean;
  bloomThreshold: number;
  bloomIntensity: number;
  bloomEmission: number;
  crtEnabled: boolean;
  scanlineStrength: number;
  aberration: number;
  paused: boolean;
  fitToWindow: boolean;
  canvasWidth: number;
  canvasHeight: number;
  onFitToWindowChange: (value: boolean) => void;
  onCanvasWidthChange: (value: number) => void;
  onCanvasHeightChange: (value: number) => void;
  onCanvasPreset: (width: number, height: number) => void;
  onDensityChange: (value: number) => void;
  onStepRateChange: (value: number) => void;
  onFontSizeChange: (value: number) => void;
  onAtlasLayerChange: (value: number) => void;
  onSpeedRangeChange: (value: [number, number]) => void;
  onTailRangeChange: (value: [number, number]) => void;
  onDepthDimChange: (value: number) => void;
  onBloomEnabledChange: (value: boolean) => void;
  onBloomThresholdChange: (value: number) => void;
  onBloomIntensityChange: (value: number) => void;
  onBloomEmissionChange: (value: number) => void;
  onCrtEnabledChange: (value: boolean) => void;
  onScanlineStrengthChange: (value: number) => void;
  onAberrationChange: (value: number) => void;
  onPausedChange: (value: boolean) => void;
  onRegenerate: () => void;
};

export const Effects = memo(function Effects({
  density,
  stepRate,
  fontSize,
  atlasLayer,
  atlasLayerMax,
  atlasDebugActive,
  speedRange,
  tailRange,
  depthDim,
  bloomEnabled,
  bloomThreshold,
  bloomIntensity,
  bloomEmission,
  crtEnabled,
  scanlineStrength,
  aberration,
  paused,
  fitToWindow,
  canvasWidth,
  canvasHeight,
  onFitToWindowChange,
  onCanvasWidthChange,
  onCanvasHeightChange,
  onCanvasPreset,
  onDensityChange,
  onStepRateChange,
  onFontSizeChange,
  onAtlasLayerChange,
  onSpeedRangeChange,
  onTailRangeChange,
  onDepthDimChange,
  onBloomEnabledChange,
  onBloomThresholdChange,
  onBloomIntensityChange,
  onBloomEmissionChange,
  onCrtEnabledChange,
  onScanlineStrengthChange,
  onAberrationChange,
  onPausedChange,
  onRegenerate,
}: EffectsProps) {
  // Stable handlers for the paired range sliders. The inline closures were
  // re-created every render, defeating the memoized Slider; these only change
  // when their own range does, so the other sliders bail out.
  const handleSpeedMin = useCallback(
    (value: number) => onSpeedRangeChange([value, speedRange[1]]),
    [onSpeedRangeChange, speedRange],
  );
  const handleSpeedMax = useCallback(
    (value: number) => onSpeedRangeChange([speedRange[0], value]),
    [onSpeedRangeChange, speedRange],
  );
  const handleTailMin = useCallback(
    (value: number) => onTailRangeChange([value, tailRange[1]]),
    [onTailRangeChange, tailRange],
  );
  const handleTailMax = useCallback(
    (value: number) => onTailRangeChange([tailRange[0], value]),
    [onTailRangeChange, tailRange],
  );

  return (
    <div className="rail-section">
      <h3 className="rail-heading">Effects</h3>

      <Group title="Simulation" disabled={false}>
        <Slider
          label="density"
          min={0}
          max={1}
          step={0.01}
          value={density}
          onChange={onDensityChange}
        />
        <Slider
          label="stepRate (Hz)"
          min={1}
          max={60}
          step={1}
          value={stepRate}
          onChange={onStepRateChange}
        />
        <Slider
          label="fontSize (px)"
          min={8}
          max={40}
          step={1}
          value={fontSize}
          onChange={onFontSizeChange}
        />
        <Button label="Regenerate seeds" onClick={onRegenerate} />
      </Group>

      <Group title="Canvas size" disabled={false}>
        <Toggle label="fit to window" checked={fitToWindow} onChange={onFitToWindowChange} />
        <div className="rail-presets">
          <Button label="HD 1280×720" onClick={() => onCanvasPreset(1280, 720)} />
          <Button label="4:3 800×600" onClick={() => onCanvasPreset(800, 600)} />
          <Button label="Phone 375×667" onClick={() => onCanvasPreset(375, 667)} />
          <Button label="Square 600" onClick={() => onCanvasPreset(600, 600)} />
        </div>
        <Slider
          label="width (px)"
          min={240}
          max={2560}
          step={10}
          value={canvasWidth}
          onChange={fitToWindow ? undefined : onCanvasWidthChange}
        />
        <Slider
          label="height (px)"
          min={160}
          max={1440}
          step={10}
          value={canvasHeight}
          onChange={fitToWindow ? undefined : onCanvasHeightChange}
        />
      </Group>

      <Group title="Atlas debug" milestone="diagnostic" disabled={!atlasDebugActive}>
        <Slider
          label="atlas layer"
          min={0}
          max={atlasLayerMax}
          step={1}
          value={atlasLayer}
          onChange={onAtlasLayerChange}
        />
      </Group>

      <Group title="Parallax" disabled={false}>
        <Slider
          label="speed min"
          min={0.1}
          max={2}
          step={0.1}
          value={speedRange[0]}
          onChange={handleSpeedMin}
        />
        <Slider
          label="speed max"
          min={0.1}
          max={2}
          step={0.1}
          value={speedRange[1]}
          onChange={handleSpeedMax}
        />
        <Slider
          label="tail min"
          min={2}
          max={40}
          step={1}
          value={tailRange[0]}
          onChange={handleTailMin}
        />
        <Slider
          label="tail max"
          min={2}
          max={40}
          step={1}
          value={tailRange[1]}
          onChange={handleTailMax}
        />
        <Slider
          label="depthDim"
          min={0}
          max={1}
          step={0.05}
          value={depthDim}
          onChange={onDepthDimChange}
        />
      </Group>

      <Group title="Bloom" disabled={false}>
        <Toggle label="bloom" checked={bloomEnabled} onChange={onBloomEnabledChange} />
        <Slider
          label="intensity"
          min={0}
          max={3}
          step={0.05}
          value={bloomIntensity}
          onChange={onBloomIntensityChange}
        />
        <Slider
          label="threshold"
          min={0}
          max={2}
          step={0.05}
          value={bloomThreshold}
          onChange={onBloomThresholdChange}
        />
        <Slider
          label="emission"
          min={1}
          max={4}
          step={0.1}
          value={bloomEmission}
          onChange={onBloomEmissionChange}
        />
      </Group>

      <Group title="CRT" disabled={false}>
        <Toggle label="crt" checked={crtEnabled} onChange={onCrtEnabledChange} />
        <Slider
          label="scanlineStrength"
          min={0}
          max={1}
          step={0.05}
          value={scanlineStrength}
          onChange={onScanlineStrengthChange}
        />
        <Slider
          label="aberration (px)"
          min={0}
          max={5}
          step={0.1}
          value={aberration}
          onChange={onAberrationChange}
        />
      </Group>

      <Group title="Lifecycle" disabled={false}>
        <Toggle label="paused" checked={paused} onChange={onPausedChange} />
      </Group>
    </div>
  );
});
