"use client";

import { FC, ReactNode } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { formatShortAnalyticsMonth } from "@/lib/blog-stats/format-month";
import type { ViewsPoint } from "@/types/content/analytics-stats";

interface ViewsOverTimeChartProps {
    data: ViewsPoint[];
}

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

const formatTooltipMonth = (label: ReactNode): string =>
    typeof label === "string" ? formatShortAnalyticsMonth(label) : String(label ?? "");

export const ViewsOverTimeChart: FC<ViewsOverTimeChartProps> = ({ data }) => (
    <div className="h-100 w-full">
        <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            initialDimension={{ width: 320, height: 300 }}
        >
            <LineChart data={data}>
                <XAxis
                    dataKey="month"
                    tickFormatter={formatShortAnalyticsMonth}
                    minTickGap={28}
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                />
                <YAxis
                    allowDecimals={false}
                    tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: AXIS_LINE_COLOR }}
                />
                <Tooltip
                    content={<ChartTooltip labelPrefix="" />}
                    labelFormatter={formatTooltipMonth}
                />
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
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
