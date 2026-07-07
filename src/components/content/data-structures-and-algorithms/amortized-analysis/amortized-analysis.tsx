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
                        label={{
                            value: "Insertion number",
                            position: "insideBottom",
                            style: { textAnchor: "middle" },
                        }}
                    />
                    <YAxis
                        label={{
                            value: "Operation cost",
                            angle: -90,
                            offset: 10,
                            position: "insideLeft",
                            style: { textAnchor: "middle" },
                        }}
                    />
                    <Tooltip content={ChartTooltip} />
                    <ReferenceLine y={1} stroke="#4ade80" strokeDasharray="4 4" />
                    <Line
                        type="stepAfter"
                        dataKey="cost"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        dot={false}
                        name="Actual cost"
                    />
                    <Line
                        type="monotone"
                        dataKey="amortized"
                        stroke="#3b82f6"
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
