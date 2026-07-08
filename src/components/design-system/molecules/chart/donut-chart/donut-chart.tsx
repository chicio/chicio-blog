"use client";

import { FC } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

export interface DonutDatum {
    label: string;
    value: number;
}

interface DonutChartProps {
    data: DonutDatum[];
    colors?: string[];
}

const DEFAULT_COLORS = ["#00FF41", "#00CC33", "#39FF14"];

export const DonutChart: FC<DonutChartProps> = ({ data, colors = DEFAULT_COLORS }) => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            initialDimension={{ width: 320, height: 300 }}
        >
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={"55%"}
                    outerRadius={"80%"}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={entry.label}
                            fill={colors[index % colors.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltip labelPrefix={""} />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);
