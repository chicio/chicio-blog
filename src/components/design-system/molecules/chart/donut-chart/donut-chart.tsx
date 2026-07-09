"use client";

import { FC } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface DonutDatum {
    label: string;
    value: number;
}

interface DonutChartProps {
    data: DonutDatum[];
    colors?: string[];
    centerLabel?: string;
    centerSublabel?: string;
}

const DEFAULT_COLORS = ["#00FF41", "#015c1a", "#7dffa0", "#00a329", "#003b0e", "#cdffdb"];

export const DonutChart: FC<DonutChartProps> = ({ data, colors = DEFAULT_COLORS, centerLabel, centerSublabel }) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className="flex flex-wrap items-center justify-center gap-7 md:justify-start">
            <div className="relative h-[170px] w-[170px] flex-none">
                <ResponsiveContainer
                    width={"100%"}
                    height={"100%"}
                    initialDimension={{ width: 170, height: 170 }}
                >
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={"62%"}
                            outerRadius={"82%"}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={entry.label}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {centerLabel && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-accent text-shadow-md text-lg font-bold tabular-nums">{centerLabel}</span>
                        {centerSublabel && <span className="text-secondary text-xs">{centerSublabel}</span>}
                    </div>
                )}
            </div>
            <ul className="flex min-w-[170px] flex-1 list-none flex-col gap-2.5 p-0">
                {data.map((entry, index) => (
                    <li
                        key={entry.label}
                        className="flex items-center gap-2.5"
                    >
                        <span
                            className="inline-block h-2.5 w-2.5 flex-none rounded-full"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-text flex-1 text-sm">{entry.label}</span>
                        <span className="text-accent text-sm tabular-nums">
                            {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
