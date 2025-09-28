'use client';

import { useState } from "react";

export function DynamicArrayVisualizer() {
  const [arr, setArr] = useState([1, 2, 3]);
  const [capacity, setCapacity] = useState(4);

  const push = () => {
    if (arr.length >= capacity) {
      setCapacity(capacity * 2);
    }
    setArr([...arr, arr.length + 1]);
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {Array.from({ length: capacity }).map((_, i) => {
          const filled = i < arr.length;
          return (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center border rounded ${
                filled
                  ? "bg-blue-400 text-white"
                  : "bg-gray-200 text-gray-400 border-dashed"
              }`}
            >
              {filled ? arr[i] : ""}
            </div>
          );
        })}
      </div>
      <p>
        <strong>Capacity:</strong> {capacity}, <strong>Size:</strong>{" "}
        {arr.length}
      </p>
      <button
        onClick={push}
        className="px-4 py-2 bg-green-500 text-white rounded mt-2"
      >
        Push
      </button>
    </div>
  );
}