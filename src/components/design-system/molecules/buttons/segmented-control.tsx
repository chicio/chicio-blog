"use client";

import { FC } from "react";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";

export type SegmentOption = {
    label: string;
    value: string;
};

type SegmentedControlProps = {
    options: SegmentOption[];
    value: string;
    onChange: (value: string) => void;
};

export const SegmentedControl: FC<SegmentedControlProps> = ({
    options,
    value,
    onChange,
}: SegmentedControlProps) => (
    <GlassmorphismBackground className="rounded-full p-1! gap-1">
        {options.map((option) => {
            const isActive = option.value === value;
            return (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 border-none ${
                        isActive
                            ? "bg-accent text-text-above-primary"
                            : "hover:bg-white/10"
                    }`}
                >
                    {option.label}
                </button>
            );
        })}
    </GlassmorphismBackground>
);
