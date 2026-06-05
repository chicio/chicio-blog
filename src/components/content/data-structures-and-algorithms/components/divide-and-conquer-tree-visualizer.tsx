"use client";

import { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

type Node = {
  level: number;
  nodes: number;
};

const generateData = (levels: number): Node[] => {
  const data: Node[] = [];
  for (let i = 0; i < levels; i++) {
    data.push({
      level: i,
      nodes: Math.pow(2, i),
    });
  }
  return data;
};

export const DivideAndConquerTreeVisualizer: FC = () => {
  const data = generateData(6);

  return (
    <div className="glow-container h-[350px] w-full p-5">
      <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{width : 320, height: 300}}>
        <LineChart data={data}>
          <XAxis
            dataKey="level"
            label={{
              value: "Recursion depth",
              position: "insideBottom",
            }}
          />
          <YAxis
            label={{
              value: "Number of subproblems",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Line
            type="monotone"
            dataKey="nodes"
            dot={false}
            name="Subproblems"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};