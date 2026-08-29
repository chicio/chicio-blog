"use client";

import { FC } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

type Node = {
    level: number;
    nodes: number;
};

const generateData = (levels: number): Node[] => {
    const data: Node[] = [];
    for (let i = 0; i < levels; i++) {
        data.push({
            level: i,
            nodes: Math.pow(2, i),
        });
    }
    return data;
};

export const DivideAndConquerTreeVisualizer: FC = () => {
    const data = generateData(6);

    return (
        <ChartPanel>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="level"
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Recursion depth",
                                position: "insideBottom",
                                style: { fill: chartTheme.axis.tickColor },
                            }}
                        />
                        <YAxis
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Number of subproblems",
                                angle: -90,
                                position: "insideLeft",
                                style: { fill: chartTheme.axis.tickColor },
                            }}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 1 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="nodes"
                            stroke={chartTheme.series[0]}
                            dot={false}
                            name="Subproblems"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ChartPanel>
    );
};
