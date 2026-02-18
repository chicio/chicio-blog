"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { char: 'a', count: 3 },
  { char: 'b', count: 1 },
  { char: 'c', count: 2 },
];

export const FrequencyMapChart: React.FC = () => {
  return (
    <div className="h-64 w-full p-4 bg-purple-50 rounded-xl">
      <ResponsiveContainer width={'100%'} height={'100%'} initialDimension={{width : 320, height: 300}}>
        <BarChart data={data}>
          <XAxis dataKey="char" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
