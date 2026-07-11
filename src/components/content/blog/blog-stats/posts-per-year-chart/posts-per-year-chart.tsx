"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";
import type { PostsPerYear } from "@/types/content/blog-stats";

interface PostsPerYearChartProps {
    data: PostsPerYear[];
}

export const PostsPerYearChart: FC<PostsPerYearChartProps> = ({ data }) => (
    <div className="h-100 w-full">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <BarChart data={data}>
                <XAxis
                    dataKey="year"
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                    tickLine={false}
                    axisLine={{ stroke: chartTheme.axis.lineColor }}
                />
                <YAxis
                    allowDecimals={false}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                    tickLine={false}
                    axisLine={{ stroke: chartTheme.axis.lineColor }}
                />
                <Tooltip
                    content={<ChartTooltip labelPrefix="Year: " />}
                    cursor={{ fill: chartTheme.cursorFill }}
                />
                <Bar dataKey="count" name="Posts" fill="#00FF41" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
