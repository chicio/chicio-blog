import { TooltipContentProps } from "recharts";
import type { CumulativePoint } from "@/types/content/analytics-stats";

export const CumulativeChartTooltip = ({ active, payload }: Partial<TooltipContentProps>) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload.find((item) => item.value !== null && item.value !== undefined) ?? payload[0];
    const datum = entry.payload as CumulativePoint | undefined;
    const isEstimated = entry.dataKey === "estimated";
    const views = Number(entry.value ?? 0).toLocaleString("en-US");

    return (
        <div
            style={{
                background: "var(--color-primary-dark)",
                color: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
                borderRadius: "8px",
                padding: "8px",
            }}
        >
            <strong>{datum?.label ?? ""}</strong>
            <div>
                {views} page views{isEstimated ? " (estimated)" : ""}
            </div>
        </div>
    );
};
