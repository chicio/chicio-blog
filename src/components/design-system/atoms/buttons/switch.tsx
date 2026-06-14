"use client";

import { FC } from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
}

export const Switch: FC<SwitchProps> = ({ checked, onChange, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-150 cursor-pointer ${
            checked
                ? "border-accent bg-accent/20 shadow-[0_0_8px_var(--color-accent-alpha-50)]"
                : "border-accent/30 bg-transparent"
        }`}
    >
        <span
            className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full transition-transform duration-150 ${
                checked
                    ? "translate-x-[18px] bg-accent shadow-[0_0_6px_var(--color-accent)]"
                    : "translate-x-[3px] bg-accent/40"
            }`}
        />
    </button>
);
