"use client";

import { FC } from "react";
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

const data = () => {
    const points = [];
    for (let n = 1; n <= 100; n += 5) {
        points.push({
            n,
            constant: 1,
            linear: n / 20,
            logn: Math.log2(n) / 5,
            nlogn: (n * Math.log2(n)) / 200,
        });
    }
    return points;
};

export const SpaceComplexityVisualizer: FC = () => (
    <ChartPanel>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={data()}>
                    <XAxis
                        dataKey="n"
                        height={50}
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Input size (n)",
                            position: "insideBottom",
                            style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                        }}
                    />
                    <YAxis
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Relative Memory Usage",
                            angle: -90,
                            offset: 10,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                        }}
                    />
                    <Tooltip
                        content={<ChartTooltip />}
                        cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 1 }}
                    />
                    <Legend
                        verticalAlign="top"
                        labelStyle={{ color: chartTheme.legendTextColor }}
                    />
                    <Line
                        type="monotone"
                        dataKey="constant"
                        stroke={chartTheme.series[0]}
                        strokeWidth={2.5}
                        dot={false}
                        name="O(1)"
                    />
                    <Line
                        type="monotone"
                        dataKey="logn"
                        stroke={chartTheme.series[1]}
                        strokeWidth={2.5}
                        dot={false}
                        name="O(log n)"
                    />
                    <Line
                        type="monotone"
                        dataKey="linear"
                        stroke={chartTheme.series[2]}
                        strokeWidth={2.5}
                        dot={false}
                        name="O(n)"
                    />
                    <Line
                        type="monotone"
                        dataKey="nlogn"
                        stroke={chartTheme.series[3]}
                        strokeWidth={2.5}
                        dot={false}
                        name="O(n log n)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </ChartPanel>
);
