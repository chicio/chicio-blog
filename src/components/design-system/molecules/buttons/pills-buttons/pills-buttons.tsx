"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "@/components/design-system/atoms/effects/pills";

type PillProps = PropsWithChildren<{
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}>;

/**
 * `className` lands on the `button` itself rather than on a wrapper because Tailwind's preflight sets
 * `text-transform: none` on `button`, so anything inheritable applied to an ancestor never reaches the
 * label.
 */
const PILL_BUTTON_CLASS = "bg-transparent border-none cursor-pointer p-0";

export const RedPillButton: FC<PillProps> = ({ children, onClick, disabled, className }) => (
    <button
        className={`${PILL_BUTTON_CLASS}${className ? ` ${className}` : ""}`}
        onClick={onClick}
        disabled={disabled}
    >
        <RedPill>{children}</RedPill>
    </button>
);

export const BluePillButton: FC<PillProps> = ({ children, onClick, disabled, className }) => (
    <button
        className={`${PILL_BUTTON_CLASS}${className ? ` ${className}` : ""}`}
        onClick={onClick}
        disabled={disabled}
    >
        <BluePill>{children}</BluePill>
    </button>
);
