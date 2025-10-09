"use client";

import { FC } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  ZAxis,
  type LabelProps,
} from "recharts";

const data = [
  { time: 1, space: 1, name: "O(1)" },
  { time: 2, space: 2, name: "O(log n)" },
  { time: 5, space: 4, name: "O(n)" },
  { time: 8, space: 6, name: "O(n log n)" },
  { time: 10, space: 10, name: "O(n²)" },
];

// Renderer custom per forzare una singola riga
const renderLabel = ({ x, y, value }: LabelProps) => {
  if (typeof x !== "number" || typeof y !== "number" || value == null) return null;

  return (
    <text
      x={x}
      y={y - 10} // leggero offset sopra il punto
      textAnchor="middle"
      fill="#fff"
      fontSize={14}
      style={{ whiteSpace: "pre" }}
      dominantBaseline="central"
    >
      {value}
    </text>
  );
};

export const TimeVsSpaceTradeoffVisualizer: FC = () => {
  return (
    <div className="bg-general-background h-80 w-full glow-container shadow-sm my-4">
      <ResponsiveContainer >
        <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="time"
            name="Time Complexity"
            label={{
              value: "Time",
              position: "insideBottomRight",
            }}
            domain={[0, 11]}
          />
          <YAxis
            type="number"
            dataKey="space"
            name="Space Complexity"
            label={{
              value: "Space",
              position: "insideLeft",
              angle: -90,
              style: { textAnchor: "middle" },
            }}
            domain={[0, 11]}
          />
          <ZAxis range={[80, 120]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={{ color: "var(--color-accent)" }} />
          <Scatter data={data} fill="#00FF41" name="Complexity Class">
            <LabelList
              dataKey="name"
              content={renderLabel}
            />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
