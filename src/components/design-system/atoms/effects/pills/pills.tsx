"use client";

import { FC, PropsWithChildren } from "react";
import { usePillsStore } from "./use-pills-store";

type PillVariant = "red" | "red-no-reflection" | "blue";

interface PillProps extends PropsWithChildren {
    variant: PillVariant;
    pillBodyClassName?: string;
    pillLabelClassName?: string;
}

const PillsRoot: FC<PillProps> = ({ variant, children, pillBodyClassName, pillLabelClassName }) => {
    const { state } = usePillsStore();
    const { shouldReduceMotion } = state;

    if (variant === "red-no-reflection") {
        return (
            <div
                className={`pill pill-red ${shouldReduceMotion ? "pill-red-glass-lite" : "pill-red-glass"} pill-no-reflection ${pillBodyClassName}`}
            >
                <span className={`pill-label ${pillLabelClassName}`}>{children}</span>
            </div>
        );
    }

    if (variant === "red") {
        return (
            <div className={`pill pill-red ${shouldReduceMotion ? "pill-red-glass-lite" : "pill-red-glass"}`}>
                <span className="pill-label">{children}</span>
            </div>
        );
    }

    return (
        <div className={`pill pill-blue ${shouldReduceMotion ? "pill-blue-glass-lite" : "pill-blue-glass"}`}>
            <span className="pill-label">{children}</span>
        </div>
    );
};

export const RedPillNoReflection: FC<PropsWithChildren<{ pillBodyClassName?: string; pillLabelClassName?: string }>> = (
    props,
) => <PillsRoot variant="red-no-reflection" {...props} />;

export const RedPill: FC<PropsWithChildren> = (props) => <PillsRoot variant="red" {...props} />;

export const BluePill: FC<PropsWithChildren> = (props) => <PillsRoot variant="blue" {...props} />;
