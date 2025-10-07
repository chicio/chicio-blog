"use client";

import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { useState } from "react";

const initialCapacity = 4;
const initialArray = [1, 2, 3]

export function DynamicArrayVisualizer() {
  const [arr, setArr] = useState(initialArray);
  const [capacity, setCapacity] = useState(initialCapacity);

  const push = () => {
    if (arr.length >= capacity) {
      setCapacity(capacity * 2);
    }
    setArr([...arr, arr.length + 1]);
  };

  const reset = () => {
    setArr(initialArray);
    setCapacity(initialCapacity);
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {Array.from({ length: capacity }).map((_, i) => (
          <div
            key={i}
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${i < arr.length ? "bg-primary-dark text-white" : "bg-gray-200"}`}
          >
            {arr[i]}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <p>
          Capacity: {capacity}, Size: {arr.length}
        </p>
        <div className="flex flex-row gap-2">
          <RedPillButton
            onClick={push}
          >
            <span className="text-primary-text">Push</span>
          </RedPillButton>
          <BluePillButton
            onClick={reset}
          >
            <span className="text-primary-text">Reset</span>
          </BluePillButton>
        </div>
      </div>
    </div>
  );
}
