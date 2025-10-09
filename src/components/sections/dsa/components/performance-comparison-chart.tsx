"use client";

import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

const data = [
  { n: 10, bubble: 0.1, merge: 0.02, quick: 0.015 },
  { n: 100, bubble: 3, merge: 0.5, quick: 0.4 },
  { n: 1000, bubble: 250, merge: 8, quick: 6 },
  { n: 5000, bubble: 6000, merge: 40, quick: 30 },
];

export const PerformanceComparisonChart: FC = () => {
  return (
    <div className="glow-container h-80 w-full p-5">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="n"
            label={{
              value: "Input size (n)",
              position: "insideBottom",
            }}
          />
          <YAxis
            label={{
              value: "Execution time (ms)",
              angle: -90,
              offset: 0,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload ? (
                <div
                  style={{
                    background: "var(--color-primary-dark)", // Matrix theme
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
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="bubble"
            strokeWidth={3}
            stroke="#ef4444"
            name="Bubble Sort"
          />
          <Line
            type="monotone"
            dataKey="merge"
            strokeWidth={3}
            stroke="#3b82f6"
            name="Merge Sort"
          />
          <Line
            type="monotone"
            dataKey="quick"
            strokeWidth={3}
            stroke="#22c55e"
            name="Quick Sort"
          />
          <Legend verticalAlign="top" height={40} style={{ marginTop: 40 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
