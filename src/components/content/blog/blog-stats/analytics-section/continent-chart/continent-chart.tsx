"use client";

import { FC } from "react";
import { DonutChart } from "@/components/design-system/molecules/chart/donut-chart";
import type { DimensionCount } from "@/types/content/analytics-stats";

interface ContinentChartProps {
    data: DimensionCount[];
}

export const ContinentChart: FC<ContinentChartProps> = ({ data }) => {
    const donutData = data.map((entry) => ({ label: entry.label, value: entry.users }));
    const total = data.reduce((sum, entry) => sum + entry.users, 0);

    return (
        <DonutChart
            data={donutData}
            centerLabel={total.toLocaleString("en-US")}
            centerSublabel="users"
        />
    );
};
