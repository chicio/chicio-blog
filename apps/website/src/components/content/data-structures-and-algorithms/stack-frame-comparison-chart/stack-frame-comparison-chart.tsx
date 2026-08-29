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

type StackFrameData = {
    step: number;
    normal: number;
    tail: number;
};

const generateData = (maxDepth = 10): StackFrameData[] => {
    const data: StackFrameData[] = [];
    for (let step = 1; step <= maxDepth; step++) {
        data.push({
            step,
            normal: step,
            tail: 1,
        });
    }
    return data;
};

export const StackFrameComparisonChart: FC = () => {
    const data = generateData(10);

    return (
        <ChartPanel>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="step"
                            height={50}
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Recursion Depth (n)",
                                position: "insideBottom",
                                style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                            }}
                        />
                        <YAxis
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Stack Frames Used",
                                angle: -90,
                                offset: 10,
                                position: "insideLeft",
                                style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                            }}
                            domain={[0, "dataMax + 1"]}
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
                            dataKey="normal"
                            stroke={chartTheme.series[0]}
                            dot={false}
                            strokeWidth={2}
                            name="Normal Recursion"
                        />
                        <Line
                            type="monotone"
                            dataKey="tail"
                            stroke={chartTheme.series[1]}
                            dot={false}
                            strokeWidth={2}
                            name="Tail Recursion"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ChartPanel>
    );
};
