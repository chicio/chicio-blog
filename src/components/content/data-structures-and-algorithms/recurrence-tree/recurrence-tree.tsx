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
    <div className="glow-container h-[400px] w-full p-5">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <LineChart data={levels()}>
                <XAxis
                    dataKey="level"
                    height={50}
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Recursion Level",
                        position: "insideBottom",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <YAxis
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                    label={{
                        value: "Work",
                        angle: -90,
                        offset: 10,
                        position: "insideLeft",
                        style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                    }}
                />
                <Tooltip
                    content={<ChartTooltip labelPrefix="level: " />}
                    cursor={{ stroke: "#39FF1466", strokeWidth: 1 }}
                />
                <Legend />
                <Line type="monotone" dataKey="Work per Call" stroke="#00FF41" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="Total Work at Level" stroke="#ffd23f" strokeWidth={2.5} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
