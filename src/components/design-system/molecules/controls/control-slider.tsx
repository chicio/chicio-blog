"use client";

import { FC } from "react";

interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    onCommit?: (v: number) => void;
    displayValue?: string;
}

export const ControlSlider: FC<ControlSliderProps> = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    onCommit,
    displayValue,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
    };

    const handleRelease = (v: number) => {
        onCommit?.(v);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        handleRelease(parseFloat((e.target as HTMLInputElement).value));
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
        handleRelease(parseFloat((e.target as HTMLInputElement).value));
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        handleRelease(parseFloat((e.target as HTMLInputElement).value));
    };

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-accent/70">{label}</span>
                <span className="font-mono text-xs text-accent">{displayValue ?? value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                onMouseUp={handleMouseUp}
                onTouchEnd={handleTouchEnd}
                onKeyUp={handleKeyUp}
                className="w-full accent-accent cursor-pointer h-1"
            />
        </div>
    );
};
