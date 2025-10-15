"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartTooltip } from "./tooltip";

type StackFrameData = {
  step: number;
  normal: number;
  tail: number;
};

const generateData = (maxDepth = 10): StackFrameData[] => {
  const data: StackFrameData[] = [];
  for (let step = 1; step <= maxDepth; step++) {
    data.push({
      step,
      normal: step, // cresce linearmente
      tail: 1, // costante
    });
  }
  return data;
};

export const StackFrameComparisonChart: React.FC = () => {
  const data = generateData(10);

  return (
    <div className="glow-container h-[400px] w-full p-5">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="step"
            height={50}
            label={{
              value: "Recursion Depth (n)",
              position: "insideBottom",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            label={{
              value: "Stack Frames Used",
              angle: -90,
              offset: 10,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip content={ChartTooltip} />
          <Legend verticalAlign="top" />
          <Line
            type="monotone"
            dataKey="normal"
            stroke="#ef4444"
            dot={false}
            strokeWidth={2}
            name="Normal Recursion"
          />
          <Line
            type="monotone"
            dataKey="tail"
            stroke="#4ade80"
            dot={false}
            strokeWidth={2}
            name="Tail Recursion"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
