"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

const data = [
    { char: "a", count: 3 },
    { char: "b", count: 1 },
    { char: "c", count: 2 },
];

export const FrequencyMapChart: React.FC = () => {
    return (
        <div className="glow-container h-64 w-full p-5">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="char"
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                    />
                    <Tooltip content={<ChartTooltip labelPrefix="char: " />} cursor={{ fill: "#39FF141a" }} />
                    <Bar dataKey="count" name="Count" fill="#00FF41" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
