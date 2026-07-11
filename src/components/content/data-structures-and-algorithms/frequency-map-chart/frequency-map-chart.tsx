"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

const data = [
    { char: "a", count: 3 },
    { char: "b", count: 1 },
    { char: "c", count: 2 },
];

export const FrequencyMapChart: React.FC = () => {
    return (
        <ChartPanel>
            <div className="h-64 w-full">
                <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="char"
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                        />
                        <YAxis
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                        />
                        <Tooltip
                            content={<ChartTooltip labelPrefix="Char: " />}
                            cursor={{ fill: chartTheme.cursorFill }}
                        />
                        <Bar
                            dataKey="count"
                            name="Count"
                            fill={chartTheme.series[0]}
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </ChartPanel>
    );
};
