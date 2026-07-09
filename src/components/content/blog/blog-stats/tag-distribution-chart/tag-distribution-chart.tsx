"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { TagCount } from "@/types/content/blog-stats";

interface TagDistributionChartProps {
    data: TagCount[];
}

const MIN_CHART_HEIGHT = 300;
const ROW_HEIGHT = 40;
const CATEGORY_AXIS_WIDTH = 200;

export const TagDistributionChart: FC<TagDistributionChartProps> = ({ data }) => {
    const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * ROW_HEIGHT);

    return (
        <div
            className="w-full"
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
                        dataKey="tag"
                        type="category"
                        width={CATEGORY_AXIS_WIDTH}
                    />
                    <Tooltip content={<ChartTooltip labelPrefix="Tag: " />} />
                    <Bar
                        dataKey="count"
                        name="Posts"
                        fill="#00CC33"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
