"use client";

import { FC } from "react";
import {
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartPanel } from "@/components/design-system/molecules/chart/chart-panel";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { chartTheme } from "@/types/configuration/chart-theme";
import { useAmortizedAnalysisStore } from "./use-amortized-analysis-store";

export const AmortizedAnalysis: FC = () => {
    const { state } = useAmortizedAnalysisStore();
    const { data } = state;

    return (
        <ChartPanel>
            <div className="h-100 w-full">
                <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="operation"
                            height={50}
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Insertion number",
                                position: "insideBottom",
                                style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                            }}
                        />
                        <YAxis
                            tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.tickFontSize }}
                            tickLine={false}
                            axisLine={{ stroke: chartTheme.axis.lineColor }}
                            label={{
                                value: "Operation cost",
                                angle: -90,
                                offset: 10,
                                position: "insideLeft",
                                style: { textAnchor: "middle", fill: chartTheme.axis.tickColor },
                            }}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ stroke: chartTheme.cursorStroke, strokeWidth: 1 }}
                        />
                        <ReferenceLine y={1} stroke="#4ade80" strokeDasharray="4 4" />
                        <Line
                            type="stepAfter"
                            dataKey="cost"
                            stroke={chartTheme.series[0]}
                            strokeWidth={2.5}
                            dot={false}
                            name="Actual cost"
                        />
                        <Line
                            type="monotone"
                            dataKey="amortized"
                            stroke={chartTheme.series[1]}
                            strokeWidth={2.5}
                            dot={false}
                            name="Amortized average"
                        />
                        <Legend
                            verticalAlign="top"
                            labelStyle={{ color: chartTheme.legendTextColor }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </ChartPanel>
    );
};
