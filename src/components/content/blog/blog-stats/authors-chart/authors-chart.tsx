"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { AuthorCount } from "@/types/content/blog-stats";
import { LinkedAxisTick } from "../linked-axis-tick";

interface AuthorsChartProps {
    data: AuthorCount[];
}

const MIN_CHART_HEIGHT = 300;
const ROW_HEIGHT = 40;
const CATEGORY_AXIS_WIDTH = 160;
const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

export const AuthorsChart: FC<AuthorsChartProps> = ({ data }) => {
    const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * ROW_HEIGHT);
    const hrefByValue = new Map(data.map((entry) => [entry.author, entry.href]));

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
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                    />
                    <YAxis
                        dataKey="author"
                        type="category"
                        width={CATEGORY_AXIS_WIDTH}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        tick={<LinkedAxisTick hrefByValue={hrefByValue} />}
                    />
                    <Tooltip
                        content={<ChartTooltip labelPrefix="Author: " />}
                        cursor={{ fill: "#39FF141a" }}
                    />
                    <Bar
                        dataKey="count"
                        name="Posts"
                        fill="#39FF14"
                        radius={[0, 6, 6, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
