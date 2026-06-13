"use client";

import { FC } from "react";

interface ControlToggleProps {
    label: string;
    value: boolean;
    onChange: (v: boolean) => void;
}

export const ControlToggle: FC<ControlToggleProps> = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-accent/70">{label}</span>
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`font-mono text-xs px-2 py-0.5 border transition-colors duration-100 cursor-pointer ${
                value
                    ? "border-accent text-accent bg-accent/10"
                    : "border-accent/30 text-accent/40 bg-transparent"
            }`}
        >
            {value ? "ON" : "OFF"}
        </button>
    </div>
);
