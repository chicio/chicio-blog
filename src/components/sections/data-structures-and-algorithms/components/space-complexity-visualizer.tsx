"use client";

import { FC } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartTooltip } from "./tooltip";

const data = () => {
  const points = [];
  for (let n = 1; n <= 100; n += 5) {
    points.push({
      n,
      constant: 1,
      linear: n / 20,
      logn: Math.log2(n) / 5,
      nlogn: (n * Math.log2(n)) / 200,
    });
  }
  return points;
};

export const SpaceComplexityVisualizer: FC = () => {
  return (
    <div className="glow-container h-[400px] w-full p-5">
      <ResponsiveContainer>
        <LineChart data={data()}>
          <XAxis
            dataKey="n"
            height={50}
            label={{
              value: "Input size (n)",
              position: "insideBottom",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            label={{
              value: "Relative Memory Usage",
              angle: -90,
              offset: 10,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip content={ChartTooltip} />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="constant"
            stroke="#7c3aed"
            strokeWidth={2.5}
            dot={false}
            name="O(1)"
          />
          <Line
            type="monotone"
            dataKey="logn"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            dot={false}
            name="O(log n)"
          />
          <Line
            type="monotone"
            dataKey="linear"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            name="O(n)"
          />
          <Line
            type="monotone"
            dataKey="nlogn"
            stroke="#f97316"
            strokeWidth={2.5}
            dot={false}
            name="O(n log n)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
