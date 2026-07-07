"use client";

import { FC } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { ViewsPerMonth } from "@/types/content/analytics-stats";

interface ViewsOverTimeChartProps {
    data: ViewsPerMonth[];
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
                <Line
                    type="monotone"
                    dataKey="views"
                    name="Page views"
                    stroke="#00FF41"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
