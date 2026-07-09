"use client";

import { FC } from "react";
import { DonutChart } from "@/components/design-system/molecules/chart/donut-chart";
import type { DimensionCount } from "@/types/content/analytics-stats";

interface OsChartProps {
    data: DimensionCount[];
}

export const OsChart: FC<OsChartProps> = ({ data }) => {
    const donutData = data.map((entry) => ({ label: entry.label, value: entry.users }));

    return (
        <DonutChart
            data={donutData}
            centerLabel={data.length.toString()}
            centerSublabel="systems"
        />
    );
};
