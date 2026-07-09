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
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

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
        <div className="glow-container h-[350px] w-full p-5">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="level"
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Recursion depth",
                            position: "insideBottom",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                    />
                    <YAxis
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Number of subproblems",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                    />
                    <Tooltip
                        content={<ChartTooltip labelPrefix="depth: " />}
                        cursor={{ stroke: "#39FF1466", strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="nodes"
                        stroke="#00FF41"
                        strokeWidth={2.5}
                        dot={false}
                        name="Subproblems"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
