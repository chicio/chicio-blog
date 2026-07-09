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
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

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
    <div className="glow-container h-[400px] w-full p-5">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <LineChart data={generateData(8)}>
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
                        value: "Operations (arbitrary units)",
                        angle: -90,
                        offset: 10,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <Tooltip content={<ChartTooltip labelPrefix="n: " />} cursor={{ stroke: "#39FF1466", strokeWidth: 1 }} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="o1" stroke="#00FF41" dot={false} name="O(1)" />
                <Line type="monotone" dataKey="ologn" stroke="#9bff3d" dot={false} name="O(log n)" />
                <Line type="monotone" dataKey="on" stroke="#e6ff33" dot={false} name="O(n)" />
                <Line type="monotone" dataKey="onlogn" stroke="#ffd23f" dot={false} name="O(n log n)" />
                <Line type="monotone" dataKey="on2" stroke="#ff9f40" dot={false} name="O(n²)" />
                <Line type="monotone" dataKey="o2n" stroke="#ff6b57" dot={false} name="O(2ⁿ)" />
                <Line type="monotone" dataKey="onfact" stroke="#ff3860" dot={false} name="O(n!)" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
