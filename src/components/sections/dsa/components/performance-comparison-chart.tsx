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
import { ChartTooltip } from "./tooltip";

const data = [
  { n: 10, bubble: 0.01, merge: 0.002, quick: 0.0015 },
  { n: 100, bubble: 0.3, merge: 0.05, quick: 0.04 },
  { n: 1000, bubble: 25, merge: 0.8, quick: 0.6 },
  { n: 5000, bubble: 600, merge: 4, quick: 3 },
];

export const PerformanceComparisonChart: FC = () => (
  <div className="glow-container h-[400px] w-full p-5">
    <ResponsiveContainer>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="n"
          label={{
            value: "Input size (n)",
            position: "insideBottom",
          }} />
        <YAxis
          label={{
            value: "Execution time (ms)",
            angle: -90,
            offset: 0,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }} />
        <Tooltip
          content={ChartTooltip} />
        <Line
          type="monotone"
          dataKey="bubble"
          strokeWidth={3}
          stroke="#ef4444"
          name="Bubble Sort" />
        <Line
          type="monotone"
          dataKey="merge"
          strokeWidth={7}
          stroke="#3b82f6"
          name="Merge Sort" />
        <Line
          type="monotone"
          dataKey="quick"
          strokeWidth={3}
          stroke="#22c55e"
          name="Quick Sort" />
        <Legend verticalAlign="top" height={40} style={{ marginTop: 40 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
