import { memo } from 'react';

type ToggleProps = {
  label: string;
  checked?: boolean | undefined;
  onChange?: ((value: boolean) => void) | undefined;
};

export const Toggle = memo(function Toggle({ label, checked, onChange }: ToggleProps) {
  const disabled = !onChange;
  return (
    <label className="rail-row">
      <input
        type="checkbox"
        checked={checked ?? false}
        disabled={disabled}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      />
      <span>{label}</span>
    </label>
  );
});
