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
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

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
        <div className="glow-container h-[400px] w-full p-5">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="step"
                        height={50}
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Recursion Depth (n)",
                            position: "insideBottom",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                    />
                    <YAxis
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Stack Frames Used",
                            angle: -90,
                            offset: 10,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                        domain={[0, "dataMax + 1"]}
                    />
                    <Tooltip
                        content={<ChartTooltip labelPrefix="depth: " />}
                        cursor={{ stroke: "#39FF1466", strokeWidth: 1 }}
                    />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="normal"
                        stroke="#ff6b57"
                        dot={false}
                        strokeWidth={2.5}
                        name="Normal Recursion"
                    />
                    <Line
                        type="monotone"
                        dataKey="tail"
                        stroke="#00FF41"
                        dot={false}
                        strokeWidth={2.5}
                        name="Tail Recursion"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
