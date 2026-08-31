import { memo } from 'react';

export type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange?: ((value: number) => void) | undefined;
};

// memo: the panel renders ~15 sliders and re-renders on every drag of any one.
// With a stable `onChange` from the parent, each slider bails unless its own
// `value` changed — so a drag re-renders one slider, not all of them.
export const Slider = memo(function Slider({ label, min, max, step, value, onChange }: SliderProps) {
  const disabled = !onChange;
  return (
    <label className="rail-row">
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        readOnly={disabled}
        onChange={onChange ? (event) => onChange(Number(event.target.value)) : undefined}
      />
      <span className="rail-value">{value}</span>
    </label>
  );
});
