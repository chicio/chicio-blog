import { TooltipContentProps } from "recharts";

export interface ChartTooltipProps extends TooltipContentProps {
    labelPrefix?: string;
}

export const ChartTooltip = ({ active, payload, label, labelPrefix = "n: " }: ChartTooltipProps) =>
    active && payload ? (
        <div
            style={{
                background: "var(--color-primary-dark)",
                color: "var(--color-accent)",
                border: "1px solid var(--color-accent)",
                borderRadius: "8px",
                padding: "8px",
            }}
        >
            <strong>
                {labelPrefix}
                {label}
            </strong>
            {payload.map((entry, i) => (
                <div key={i}>
                    {entry.name}: {entry.value}
                </div>
            ))}
        </div>
    ) : null;
