"use client";

import { FC } from "react";
import { Label } from "@/components/design-system/atoms/typography/label";
import { useControlSliderStore } from "./use-control-slider-store";

interface ControlSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    displayValue?: string;
}

export const ControlSlider: FC<ControlSliderProps> = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
    displayValue,
}) => {
    const { effects } = useControlSliderStore();
    const { handleChange } = effects;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <Label value={label} />
                <span className="font-mono font-medium">{displayValue ?? value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange(onChange)}
                className="w-full accent-accent cursor-pointer"
            />
        </div>
    );
};
