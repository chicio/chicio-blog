"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { TopPost } from "@/types/content/analytics-stats";

interface TopPostsChartProps {
    data: TopPost[];
}

const MIN_CHART_HEIGHT = 300;
const ROW_HEIGHT = 40;
const CATEGORY_AXIS_WIDTH = 260;

export const TopPostsChart: FC<TopPostsChartProps> = ({ data }) => {
    const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * ROW_HEIGHT);

    return (
        <div
            className="glow-container w-full p-5 mb-6"
            style={{ height: chartHeight }}
        >
            <ResponsiveContainer
                width={"100%"}
                height={"100%"}
                initialDimension={{ width: 320, height: chartHeight }}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                >
                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />
                    <YAxis
                        dataKey="title"
                        type="category"
                        width={CATEGORY_AXIS_WIDTH}
                    />
                    <Tooltip content={<ChartTooltip labelPrefix="Post: " />} />
                    <Bar
                        dataKey="views"
                        name="Page views"
                        fill="#39FF14"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
