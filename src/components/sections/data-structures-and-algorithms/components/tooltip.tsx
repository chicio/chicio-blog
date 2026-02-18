type ChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ name: string; value: number }>;
  label?: string | number;
};

export const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) =>
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
      <strong>n: {label}</strong>
      {payload.map((entry, i) => (
        <div key={i}>
          {entry.name}: {entry.value}
        </div>
      ))}
    </div>
  ) : null;
