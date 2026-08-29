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

const levels = () => {
    const n = 64;
    const a = 2;
    const b = 2;
    const data = [];

    for (let level = 0; level <= Math.log2(n); level++) {
        const numCalls = Math.pow(a, level);
        const subproblemSize = n / Math.pow(b, level);
        const costPerCall = subproblemSize;
        const totalCost = numCalls * costPerCall;
        data.push({
            level,
            "Work per Call": costPerCall,
            "Total Work at Level": totalCost,
        });
    }

    return data;
};

export const RecurrenceTree: FC = () => (
    <ChartPanel>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={levels()}>
                    <XAxis
                        dataKey="level"
                        height={50}
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Recursion Level",
                            position: "insideBottom",
                            style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                        }}
                    />
                    <YAxis
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Work",
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
                    <Legend labelStyle={{ color: chartTheme.legendTextColor }} />
                    <Line
                        type="monotone"
                        dataKey="Work per Call"
                        stroke={chartTheme.series[0]}
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="Total Work at Level"
                        stroke={chartTheme.series[1]}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </ChartPanel>
);
