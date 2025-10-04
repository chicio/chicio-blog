'use client';

import { useState } from "react";

export function DynamicArrayVisualizer() {
  const [arr, setArr] = useState([1,2,3]);
  const [capacity, setCapacity] = useState(4);

  const push = () => {
    if (arr.length >= capacity) {
      setCapacity(capacity*2);
    }
    setArr([...arr, arr.length+1]);
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {Array.from({length: capacity}).map((_, i) => (
          <div key={i} className={`w-10 h-10 flex items-center justify-center border ${i < arr.length ? "bg-blue-400 text-white" : "bg-gray-200"}`}>
            {i < arr.length ? arr[i] : ""}
          </div>
        ))}
      </div>
      <p>Capacity: {capacity}, Size: {arr.length}</p>
      <button onClick={push} className="px-4 py-2 bg-green-500 text-white rounded">Push</button>
    </div>
  )
}
