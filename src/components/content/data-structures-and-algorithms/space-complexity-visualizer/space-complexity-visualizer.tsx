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
    <div className="glow-container h-[400px] w-full p-5">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <LineChart data={data()}>
                <XAxis
                    dataKey="n"
                    height={50}
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
                        value: "Relative Memory Usage",
                        angle: -90,
                        offset: 10,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <Tooltip content={<ChartTooltip labelPrefix="n: " />} cursor={{ stroke: "#39FF1466", strokeWidth: 1 }} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="constant" stroke="#00FF41" strokeWidth={2.5} dot={false} name="O(1)" />
                <Line type="monotone" dataKey="logn" stroke="#ffd23f" strokeWidth={2.5} dot={false} name="O(log n)" />
                <Line type="monotone" dataKey="linear" stroke="#ff9f40" strokeWidth={2.5} dot={false} name="O(n)" />
                <Line
                    type="monotone"
                    dataKey="nlogn"
                    stroke="#ff6b57"
                    strokeWidth={2.5}
                    dot={false}
                    name="O(n log n)"
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
