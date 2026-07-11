"use client";

import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

type ComplexityData = {
    n: number;
    o1: number;
    ologn: number;
    on: number;
    onlogn: number;
    on2: number;
    o2n: number;
    onfact: number;
};

const factorial = (n: number): number => {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
};

const generateData = (maxN = 8): ComplexityData[] => {
    const data: ComplexityData[] = [];
    for (let n = 1; n <= maxN; n++) {
        data.push({
            n,
            o1: 1,
            ologn: Math.log2(n),
            on: n,
            onlogn: n * Math.log2(n),
            on2: n * n,
            o2n: Math.pow(2, n) / 5,
            onfact: factorial(n) / 500,
        });
    }
    return data;
};

export const ComplexityGrowthVisualizer: React.FC = () => (
    <ChartPanel>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={generateData(8)}>
                    <XAxis
                        dataKey="n"
                        height={50}
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
                            value: "Operations (arbitrary units)",
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
                        dataKey="o1"
                        stroke={chartTheme.series[0]}
                        dot={false}
                        name="O(1)"
                    />
                    <Line
                        type="monotone"
                        dataKey="ologn"
                        stroke={chartTheme.series[1]}
                        dot={false}
                        name="O(log n)"
                    />
                    <Line
                        type="monotone"
                        dataKey="on"
                        stroke={chartTheme.series[2]}
                        dot={false}
                        name="O(n)"
                    />
                    <Line
                        type="monotone"
                        dataKey="onlogn"
                        stroke={chartTheme.series[3]}
                        dot={false}
                        name="O(n log n)"
                    />
                    <Line
                        type="monotone"
                        dataKey="on2"
                        stroke={chartTheme.series[4]}
                        dot={false}
                        name="O(n²)"
                    />
                    <Line
                        type="monotone"
                        dataKey="o2n"
                        stroke={chartTheme.series[5]}
                        dot={false}
                        name="O(2ⁿ)"
                    />
                    <Line
                        type="monotone"
                        dataKey="onfact"
                        stroke={chartTheme.series[6]}
                        dot={false}
                        name="O(n!)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </ChartPanel>
);
