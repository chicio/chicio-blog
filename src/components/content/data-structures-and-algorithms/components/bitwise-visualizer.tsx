"use client";

import { InputField } from "@/components/design-system/atoms/typography/input-field";
import React, { useState } from "react";

export const BitwiseVisualizer: React.FC = () => {
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);

  const formatBinary = (num: number, bits = 32) =>
    (num >>> 0).toString(2).padStart(bits, "0");

  const operators = [
    { name: "AND (&)", value: a & b },
    { name: "OR (|)", value: a | b },
    { name: "XOR (^)", value: a ^ b },
    { name: "NOT (~a)", value: ~a },
    { name: "a << 1", value: a << 1 },
    { name: "a >> 1", value: a >> 1 },
    { name: "a >>> 1", value: a >>> 1 },
  ];

  return (
    <div className="rounded-xl p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Bitwise Operator Visualizer
      </h3>
      <div className="mb-4 flex gap-4">
        <div>
          <label className="mr-2 mb-1">A:</label>
          <InputField
            type="number"
            value={a}
            onChange={(e) => setA(parseInt(e.target.value) || 0)}
            className="w-20 rounded border px-2 py-1"
          />
        </div>
        <div>
          <label className="mr-2 mb-1">B:</label>
          <InputField
            type="number"
            value={b}
            onChange={(e) => setB(parseInt(e.target.value) || 0)}
            className="w-20 rounded border px-2 py-1"
          />
        </div>
      </div>
      <div className="text-accent mb-4 flex flex-col md:flex-row gap-4 font-mono">
        <div>
          <span className="font-bold">A:</span> <span className="text-xs md:text-base break-all">{formatBinary(a)}</span>
        </div>
        <div>
          <span className="font-bold">B:</span> <span className="text-xs md:text-base break-all">{formatBinary(b)}</span>
        </div>
      </div>
      <table>
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1">Operator</th>
            <th className="px-2 py-1">Decimal</th>
            <th className="px-2 py-1">Binary</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.name} className="border-b">
              <td className="px-2 py-1 font-medium">{op.name}</td>
              <td className="px-2 py-1">{op.value}</td>
              <td className="px-2 py-1 font-mono text-xs md:text-base break-all">{formatBinary(op.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
