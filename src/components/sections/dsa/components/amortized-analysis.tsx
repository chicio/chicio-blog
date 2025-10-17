"use client";

import { FC, useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./tooltip";

export const AmortizedAnalysis: FC = () => {
  const data = useMemo(() => {
    const points = [];
    let capacity = 1;
    let totalCost = 0;

    for (let i = 1; i <= 50; i++) {
      let cost = 1; // normal insertion cost
      if (i > capacity) {
        // resizing happens
        capacity *= 2;
        cost = i; // copying all elements
      }
      totalCost += cost;
      const amortized = totalCost / i;
      points.push({ operation: i, cost, amortized });
    }

    return points;
  }, []);

  return (
    <div className="glow-container h-[400px] w-full p-5">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="operation"
            height={50}
            label={{
              value: "Insertion number",
              position: "insideBottom",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            label={{
              value: "Operation cost",
              angle: -90,
              offset: 10,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip content={ChartTooltip} />
          <ReferenceLine y={1} stroke="#4ade80" strokeDasharray="4 4" />
          <Line
            type="stepAfter"
            dataKey="cost"
            stroke="#ef4444"
            strokeWidth={2.5}
            dot={false}
            name="Actual cost"
          />
          <Line
            type="monotone"
            dataKey="amortized"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
            name="Amortized average"
          />
          <Legend verticalAlign="top" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
