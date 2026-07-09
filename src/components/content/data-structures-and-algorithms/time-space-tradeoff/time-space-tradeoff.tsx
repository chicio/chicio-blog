"use client";

import { FC } from "react";
import {
    CartesianGrid,
    LabelList,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
    type LabelProps,
} from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

const data = [
    { time: 1, space: 1, name: "O(1)" },
    { time: 2, space: 2, name: "O(log n)" },
    { time: 5, space: 4, name: "O(n)" },
    { time: 8, space: 6, name: "O(n log n)" },
    { time: 10, space: 10, name: "O(n²)" },
];

const renderLabel = ({ x, y, value }: LabelProps) => {
    if (typeof x !== "number" || typeof y !== "number" || value == null) { return null; }

    return (
        <text
            x={x}
            y={y - 10}
            textAnchor="middle"
            fill="#39FF14"
            fontSize={14}
            style={{ whiteSpace: "pre" }}
            dominantBaseline="central"
        >
            {value}
        </text>
    );
};

export const TimeVsSpaceTradeoffVisualizer: FC = () => (
    <div className="glow-container my-4 h-80 w-full p-5">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={AXIS_LINE_COLOR} />
                <XAxis
                    type="number"
                    dataKey="time"
                    name="Time Complexity"
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Time",
                        position: "insideBottomRight",
                        style: { fill: AXIS_TICK_COLOR },
                    }}
                    domain={[0, 11]}
                />
                <YAxis
                    type="number"
                    dataKey="space"
                    name="Space Complexity"
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Space",
                        position: "insideLeft",
                        angle: -90,
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                    domain={[0, 11]}
                />
                <ZAxis range={[80, 120]} />
                <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#39FF1466" }} content={ChartTooltip} />
                <Legend wrapperStyle={{ color: "var(--color-accent)" }} />
                <Scatter data={data} fill="#00FF41" name="Complexity Class">
                    <LabelList dataKey="name" content={renderLabel} />
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    </div>
);
