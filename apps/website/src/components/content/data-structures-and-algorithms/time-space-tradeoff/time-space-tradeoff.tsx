"use client";

import { FC } from "react";
import {
    CartesianGrid,
    LabelList,
    Legend,
    ResponsiveContainer,
    Scatter,
    ScatterChart,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
    type LabelProps,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";

const data = [
    { time: 1, space: 1, name: "O(1)" },
    { time: 2, space: 2, name: "O(log n)" },
    { time: 5, space: 4, name: "O(n)" },
    { time: 8, space: 6, name: "O(n log n)" },
    { time: 10, space: 10, name: "O(n²)" },
];

const renderLabel = ({ x, y, value }: LabelProps) => {
    if (typeof x !== "number" || typeof y !== "number" || value == null) { return null; }

    return (
        <text
            x={x}
            y={y - 10}
            textAnchor="middle"
            fill={chartTheme.axis.tickColor}
            fontSize={14}
            style={{ whiteSpace: "pre" }}
            dominantBaseline="central"
        >
            {value}
        </text>
    );
};

export const TimeVsSpaceTradeoffVisualizer: FC = () => (
    <ChartPanel>
        <div className="h-80 w-full">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={chartTheme.gridStroke}
                    />
                    <XAxis
                        type="number"
                        dataKey="time"
                        name="Time Complexity"
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Time",
                            position: "insideBottomRight",
                            style: { fill: chartTheme.axis.tickColor },
                        }}
                        domain={[0, 11]}
                    />
                    <YAxis
                        type="number"
                        dataKey="space"
                        name="Space Complexity"
                        tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                        tickLine={false}
                        axisLine={{ stroke: chartTheme.axis.lineColor }}
                        label={{
                            value: "Space",
                            position: "insideLeft",
                            angle: -90,
                            style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                        }}
                        domain={[0, 11]}
                    />
                    <ZAxis range={[80, 120]} />
                    <Tooltip
                        cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 1 }}
                        content={<ChartTooltip />}
                    />
                    <Legend labelStyle={{ color: chartTheme.legendTextColor }} />
                    <Scatter
                        data={data}
                        fill={chartTheme.series[0]}
                        name="Complexity Class"
                    >
                        <LabelList dataKey="name" content={renderLabel} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    </ChartPanel>
);
