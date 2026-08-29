"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";
import type { TagCount } from "@/types/content/blog-stats";
import { LinkedAxisTick } from "../linked-axis-tick";

interface TagDistributionChartProps {
    data: TagCount[];
}

const MIN_CHART_HEIGHT = 300;
const ROW_HEIGHT = 40;
const CATEGORY_AXIS_WIDTH = 200;

export const TagDistributionChart: FC<TagDistributionChartProps> = ({ data }) => {
    const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * ROW_HEIGHT);
    const hrefByValue = new Map(data.map((entry) => [entry.tag, entry.href]));

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
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                    />
                    <YAxis
                        dataKey="tag"
                        type="category"
                        width={CATEGORY_AXIS_WIDTH}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        tick={<LinkedAxisTick hrefByValue={hrefByValue} />}
                    />
                    <Tooltip
                        content={<ChartTooltip labelPrefix="Tag: " />}
                        cursor={{ fill: chartTheme.cursorFill }}
                    />
                    <Bar
                        dataKey="count"
                        name="Posts"
                        fill="#00CC33"
                        radius={[0, 6, 6, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
