"use client";

import { FC, useState } from "react";
import {
  RedPillButton,
  BluePillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";

type Frame = {
  n: number;
};

export const RecursiveCallStackVisualizer: FC = () => {
  const [stack, setStack] = useState<Frame[]>([{ n: 3 }]);
  const [returnValue, setReturnValue] = useState<number | null>(null);

  const step = () => {
    if (stack.length === 0) return;

    const top = stack[stack.length - 1];

    // Base case: produce a value and pop the frame
    if (top.n === 0) {
      setStack(stack.slice(0, -1));
      setReturnValue(0);
      return;
    }

    // If we just returned from a recursive call, consume the value
    if (returnValue !== null) {
      setStack(stack.slice(0, -1));
      setReturnValue(top.n + returnValue);
      return;
    }

    // Recursive call: push next frame
    setStack([...stack, { n: top.n - 1 }]);
  };

  const reset = () => {
    setStack([{ n: 3 }]);
    setReturnValue(null);
  };

  return (
    <div className="glow-container p-4">
      <div className="mb-4">
        <p className="mb-2 font-semibold">
          Call Stack (top at the bottom)
        </p>
        <div className="flex flex-col gap-2">
          {stack.map((frame, i) => (
            <div
              key={i}
              className="rounded-xl bg-primary-dark px-4 py-2 text-white"
            >
              sum({frame.n})
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p>
          Return value: {returnValue !== null ? returnValue : "–"}
        </p>
      </div>

      <div className="flex gap-2">
        <RedPillButton onClick={step}>
          <span className="text-primary-text">Step</span>
        </RedPillButton>
        <BluePillButton onClick={reset}>
          <span className="text-primary-text">Reset</span>
        </BluePillButton>
      </div>
    </div>
  );
};