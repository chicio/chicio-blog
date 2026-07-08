"use client";

import { FC } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { ViewsPoint } from "@/types/content/analytics-stats";

interface ViewsOverTimeChartProps {
    data: ViewsPoint[];
}

export const ViewsOverTimeChart: FC<ViewsOverTimeChartProps> = ({ data }) => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            initialDimension={{ width: 320, height: 300 }}
        >
            <LineChart data={data}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<ChartTooltip labelPrefix="Month: " />} />
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
                    name="Views (GA4)"
                    stroke="#00FF41"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
