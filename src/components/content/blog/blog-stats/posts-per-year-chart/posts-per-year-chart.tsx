"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { PostsPerYear } from "@/types/content/blog-stats";

interface PostsPerYearChartProps {
    data: PostsPerYear[];
}

export const PostsPerYearChart: FC<PostsPerYearChartProps> = ({ data }) => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
            <BarChart data={data}>
                <XAxis dataKey="year" />
                <YAxis allowDecimals={false} />
                <Tooltip content={ChartTooltip} />
                <Bar dataKey="count" name="Posts" fill="#00FF41" />
            </BarChart>
        </ResponsiveContainer>
    </div>
);
