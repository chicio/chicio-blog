"use client";

import { FC } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CumulativePoint } from "@/types/content/analytics-stats";
import { CumulativeChartTooltip } from "./cumulative-chart-tooltip";

interface CumulativeChartProps {
    data: CumulativePoint[];
}

const formatYear = (time: number): string => new Date(time).getUTCFullYear().toString();
const formatCompact = (value: number): string => (value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`);

export const CumulativeChart: FC<CumulativeChartProps> = ({ data }) => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            initialDimension={{ width: 320, height: 300 }}
        >
            <LineChart data={data}>
                <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={formatYear}
                />
                <YAxis
                    tickFormatter={formatCompact}
                    width={48}
                />
                <Tooltip content={<CumulativeChartTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="estimated"
                    name="Estimated (pre-2022)"
                    stroke="#00CC33"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                    connectNulls
                />
                <Line
                    type="monotone"
                    dataKey="live"
                    name="Live (GA4)"
                    stroke="#00FF41"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
