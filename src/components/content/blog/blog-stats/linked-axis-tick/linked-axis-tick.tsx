"use client";

import { FC } from "react";

interface AxisTickPayload {
    value: string;
}

interface LinkedAxisTickProps {
    x?: number;
    y?: number;
    payload?: AxisTickPayload;
    hrefByValue: Map<string, string>;
}

export const LinkedAxisTick: FC<LinkedAxisTickProps> = ({ x = 0, y = 0, payload, hrefByValue }) => {
    const value = payload?.value ?? "";
    const href = hrefByValue.get(value);
    const label = (
        <text
            x={0}
            y={0}
            dy={4}
            textAnchor="end"
            fontSize={12}
            fill={href ? "#39FF14" : "#9fbf9f"}
        >
            {value}
        </text>
    );

    return (
        <g transform={`translate(${x},${y})`}>
            {href ? (
                <a
                    href={href}
                    style={{ cursor: "pointer" }}
                >
                    {label}
                </a>
            ) : (
                label
            )}
        </g>
    );
};
