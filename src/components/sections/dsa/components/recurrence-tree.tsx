'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./tooltip";

const levels = () => {
  const n = 64;
  const a = 2;
  const b = 2;
  const data = [];

  for (let level = 0; level <= Math.log2(n); level++) {
    const numCalls = Math.pow(a, level);
    const subproblemSize = n / Math.pow(b, level);
    const costPerCall = subproblemSize;
    const totalCost = numCalls * costPerCall;
    data.push({
      level,
      "Work per Call": costPerCall,
      "Total Work at Level": totalCost,
    });
  }

  return data;
};

export const RecurrenceTree: React.FC = () => (
  <div className="glow-container h-[400px] w-full p-5">
    <ResponsiveContainer>
      <LineChart data={levels()}>
        <XAxis
          dataKey="level"
          height={50}
          label={{
            value: "Recursion Level",
            position: "insideBottom",
            style: { textAnchor: "middle" },
          }}
        />
        <YAxis
          label={{
            value: "Work",
            angle: -90,
            offset: 10,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={ChartTooltip} />
        <Legend />
        <Line
          type="monotone"
          dataKey="Work per Call"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="Total Work at Level"
          stroke="#06b6d4"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
