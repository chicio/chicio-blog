"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { PostsPerYear } from "@/types/content/blog-stats";

interface PostsPerYearChartProps {
    data: PostsPerYear[];
}

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

export const PostsPerYearChart: FC<PostsPerYearChartProps> = ({ data }) => (
    <div className="h-100 w-full">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <BarChart data={data}>
                <XAxis
                    dataKey="year"
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
                <Tooltip content={<ChartTooltip labelPrefix="Year: " />} />
                <Bar dataKey="count" name="Posts" fill="#00FF41" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
