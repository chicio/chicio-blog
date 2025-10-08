
'use client';
import React, { useState } from 'react';
export function DynamicArrayVisualizer() {
  const [arr, setArr] = useState([1,2,3]);
  const [capacity, setCapacity] = useState(4);
  const push = () => {
    if (arr.length >= capacity) setCapacity(capacity*2);
    setArr([...arr, arr.length+1]);
  }
  return (
    <div>
      <div className="flex gap-2 mb-2">
        {arr.map((v,i)=><div key={i} className="w-10 h-10 bg-blue-400 flex items-center justify-center">{v}</div>)}
      </div>
      <p>Capacity: {capacity}, Size: {arr.length}</p>
      <button onClick={push} className="px-4 py-2 bg-green-500 text-white rounded">Push</button>
    </div>
  );
}
