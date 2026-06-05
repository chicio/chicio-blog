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
} from "recharts";
import { ChartTooltip } from "./tooltip";

type ComplexityData = {
  n: number;
  o1: number;
  ologn: number;
  on: number;
  onlogn: number;
  on2: number;
  o2n: number;
  onfact: number;
};

const factorial = (n: number): number => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

const generateData = (maxN = 8): ComplexityData[] => {
  const data: ComplexityData[] = [];
  for (let n = 1; n <= maxN; n++) {
    data.push({
      n,
      o1: 1,
      ologn: Math.log2(n),
      on: n,
      onlogn: n * Math.log2(n),
      on2: n * n,
      o2n: Math.pow(2, n) / 5, // scaled down for visibility
      onfact: factorial(n) / 500, // scaled factorial for visibility
    });
  }
  return data;
};

export const ComplexityGrowthVisualizer: React.FC = () => (
  <div className="glow-container h-[400px] w-full p-5">
    <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{width : 320, height: 300}}>
      <LineChart data={generateData(8)}>
        <XAxis
          dataKey="n"
          height={50}
          label={{
            value: "Input size (n)",
            position: "insideBottom",
          }}
        />
        <YAxis
          label={{
            value: "Operations (arbitrary units)",
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
          dataKey="o1"
          stroke="#4ade80"
          dot={false}
          name="O(1)"
        />
        <Line
          type="monotone"
          dataKey="ologn"
          stroke="#60a5fa"
          dot={false}
          name="O(log n)"
        />
        <Line
          type="monotone"
          dataKey="on"
          stroke="#facc15"
          dot={false}
          name="O(n)"
        />
        <Line
          type="monotone"
          dataKey="onlogn"
          stroke="#fb923c"
          dot={false}
          name="O(n log n)"
        />
        <Line
          type="monotone"
          dataKey="on2"
          stroke="#ef4444"
          dot={false}
          name="O(n²)"
        />
        <Line
          type="monotone"
          dataKey="o2n"
          stroke="#c084fc"
          dot={false}
          name="O(2ⁿ)"
        />
        <Line
          type="monotone"
          dataKey="onfact"
          stroke="#ec4899"
          dot={false}
          name="O(n!)"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
