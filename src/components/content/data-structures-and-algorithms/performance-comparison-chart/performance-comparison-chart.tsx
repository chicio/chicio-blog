"use client";

import { FC } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

const data = [
    { n: 10, bubble: 0.01, merge: 0.002, quick: 0.0015 },
    { n: 100, bubble: 0.3, merge: 0.05, quick: 0.04 },
    { n: 1000, bubble: 25, merge: 0.8, quick: 0.6 },
    { n: 5000, bubble: 600, merge: 4, quick: 3 },
];

export const PerformanceComparisonChart: FC = () => (
    <ChartPanel>
        <div className="h-100 w-full">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="n"
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Input size (n)",
                            position: "insideBottom",
                            style: { fill: chartTheme.axis.tickColor },
                        }}
                    />
                    <YAxis
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Execution time (ms)",
                            angle: -90,
                            offset: 0,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                        }}
                    />
                    <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="bubble"
                        strokeWidth={3}
                        stroke={chartTheme.series[0]}
                        name="Bubble Sort"
                    />
                    <Line
                        type="monotone"
                        dataKey="merge"
                        strokeWidth={3}
                        stroke={chartTheme.series[1]}
                        name="Merge Sort"
                    />
                    <Line
                        type="monotone"
                        dataKey="quick"
                        strokeWidth={3}
                        stroke={chartTheme.series[2]}
                        name="Quick Sort"
                    />
                    <Legend
                        verticalAlign="top"
                        height={40}
                        style={{ marginTop: 40 }}
                        labelStyle={{ color: chartTheme.legendTextColor }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </ChartPanel>
);
