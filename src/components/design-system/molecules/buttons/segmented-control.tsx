"use client";

// Author: Fabrizio Duroni

import { FC } from "react";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";

export type SegmentOption<T extends string> = {
    label: string;
    value: T;
};

type SegmentedControlProps<T extends string> = {
    options: SegmentOption<T>[];
    value: T;
    onChange: (value: T) => void;
};

export const SegmentedControl = <T extends string>({
    options,
    value,
    onChange,
}: SegmentedControlProps<T>) => (
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
