"use client";

import {
  BluePillButton,
  RedPillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import React, { useState } from "react";

interface KadaneVisualizerProps {
  nums: number[];
}

export const KadaneVisualizer: React.FC<KadaneVisualizerProps> = ({ nums }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMax, setCurrentMax] = useState(nums[0] || 0);
  const [globalMax, setGlobalMax] = useState(nums[0] || 0);
  const [highlighted, setHighlighted] = useState<number[]>([0]);
  const [currentSubarray, setCurrentSubarray] = useState<number[]>([nums[0]]);
  const [finished, setFinished] = useState(false);

  const stepForward = () => {
    if (currentIndex >= nums.length - 1) {
      setFinished(true);
      return;
    }

    const idx = currentIndex + 1;
    let newCurrMax = currentMax + nums[idx];
    let newSubarray = [...currentSubarray];

    if (currentMax + nums[idx] < nums[idx]) {
      newCurrMax = nums[idx];
      newSubarray = [nums[idx]];
    } else {
      newSubarray.push(nums[idx]);
    }

    const newGlobalMax = Math.max(globalMax, newCurrMax);

    setCurrentIndex(idx);
    setCurrentMax(newCurrMax);
    setGlobalMax(newGlobalMax);
    setCurrentSubarray(newSubarray);
    setHighlighted([...newSubarray.map((_, i) => idx - newSubarray.length + 1 + i)]);

    if (idx === nums.length - 1) {
      setFinished(true);
    }
  };

  const resetVisualization = () => {
    setCurrentIndex(0);
    setCurrentMax(nums[0] || 0);
    setGlobalMax(nums[0] || 0);
    setHighlighted([0]);
    setCurrentSubarray([nums[0]]);
    setFinished(false);
  };

  return (
    <div className="font-sans">
      <div className="flex gap-2 mb-4">
        {nums.map((num, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded ${
              highlighted.includes(i) ? "bg-primary-dark text-white" : "bg-general-background-light text-black"
            }`}
          >
            {num}
          </div>
        ))}
      </div>
      <p>
        <strong>Current Index:</strong> {currentIndex}
      </p>
      <p>
        <strong>Current Max:</strong> {currentMax}
      </p>
      <p>
        <strong>Global Max:</strong> {globalMax}
      </p>
      <p>
        <strong>Current Subarray:</strong> [{currentSubarray.join(", ")}]
      </p>

      <div className="flex flex-row gap-2 mt-4">
        <RedPillButton onClick={stepForward} disabled={finished}>
          <span className="text-primary-text">Step</span>
        </RedPillButton>
        <BluePillButton onClick={resetVisualization}>
          <span className="text-primary-text">Reset</span>
        </BluePillButton>
      </div>
    </div>
  );
};