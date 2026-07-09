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
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

const data = [
    { n: 10, bubble: 0.01, merge: 0.002, quick: 0.0015 },
    { n: 100, bubble: 0.3, merge: 0.05, quick: 0.04 },
    { n: 1000, bubble: 25, merge: 0.8, quick: 0.6 },
    { n: 5000, bubble: 600, merge: 4, quick: 3 },
];

export const PerformanceComparisonChart: FC = () => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <LineChart data={data}>
                <XAxis
                    dataKey="n"
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Input size (n)",
                        position: "insideBottom",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <YAxis
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Execution time (ms)",
                        angle: -90,
                        offset: 0,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <Tooltip content={<ChartTooltip labelPrefix="n: " />} cursor={{ stroke: "#39FF1466", strokeWidth: 1 }} />
                <Line type="monotone" dataKey="bubble" strokeWidth={2.5} stroke="#ff6b57" name="Bubble Sort" />
                <Line type="monotone" dataKey="merge" strokeWidth={2.5} stroke="#ffd23f" name="Merge Sort" />
                <Line type="monotone" dataKey="quick" strokeWidth={2.5} stroke="#00FF41" name="Quick Sort" />
                <Legend verticalAlign="top" height={40} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
