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
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import { useAmortizedAnalysisStore } from "./use-amortized-analysis-store";

const AXIS_TICK_COLOR = "#9fbf9f";
const AXIS_LINE_COLOR = "#1f5a2e";

export const AmortizedAnalysis: FC = () => {
    const { state } = useAmortizedAnalysisStore();
    const { data } = state;

    return (
        <div className="glow-container h-100 w-full p-5">
            <ResponsiveContainer width={"100%"} height={"100%"} initialDimension={{ width: 320, height: 300 }}>
                <LineChart data={data}>
                    <XAxis
                        dataKey="operation"
                        height={50}
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Insertion number",
                            position: "insideBottom",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                    />
                    <YAxis
                        tick={{ fill: AXIS_TICK_COLOR, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: AXIS_LINE_COLOR }}
                        label={{
                            value: "Operation cost",
                            angle: -90,
                            offset: 10,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fill: AXIS_TICK_COLOR },
                        }}
                    />
                    <Tooltip
                        content={<ChartTooltip labelPrefix="op: " />}
                        cursor={{ stroke: "#39FF1466", strokeWidth: 1 }}
                    />
                    <ReferenceLine y={1} stroke="#39FF14" strokeDasharray="4 4" />
                    <Line
                        type="stepAfter"
                        dataKey="cost"
                        stroke="#ff9f40"
                        strokeWidth={2.5}
                        dot={false}
                        name="Actual cost"
                    />
                    <Line
                        type="monotone"
                        dataKey="amortized"
                        stroke="#00FF41"
                        strokeWidth={2.5}
                        dot={false}
                        name="Amortized average"
                    />
                    <Legend verticalAlign="top" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
