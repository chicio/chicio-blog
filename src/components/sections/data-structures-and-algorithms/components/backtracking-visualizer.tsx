"use client";

import { useState, useEffect, FC } from "react";
import { RedPillButton, BluePillButton } from "@/components/design-system/molecules/buttons/pills-buttons";

export const BacktrackingVisualizer: FC = () => {
  const [path, setPath] = useState<string[]>([]);
  const [pathsHistory, setPathsHistory] = useState<string[][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const choices = ["0", "1"];
  const maxDepth = 3;
  const stepDelay = 500; // ms tra ogni passo

  const backtrackGenerator = function* (currentPath: string[]): Generator<string[], void, unknown> {
    if (currentPath.length === maxDepth) {
      setPathsHistory((prev) => [...prev, [...currentPath]]);
      yield [...currentPath];
      return;
    }

    for (const choice of choices) {
      currentPath.push(choice);
      yield [...currentPath]; // stato intermedio
      yield* backtrackGenerator(currentPath); // esplora profondità
      currentPath.pop(); // rollback
    }
  };

  // Effetto per animare il processo
  useEffect(() => {
    if (!isRunning) return;
    const gen = backtrackGenerator([]);

    const interval = setInterval(() => {
      const next = gen.next();
      if (next.done) {
        setIsRunning(false);
        clearInterval(interval);
        return;
      }
      setPath(next.value);
    }, stepDelay);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    setPath([]);
    setPathsHistory([]);
    setIsRunning(true);
  };

  const reset = () => {
    setPath([]);
    setPathsHistory([]);
    setIsRunning(false);
  };

  return (
    <div>
      <p>
        Current path (exploration in progress):
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {path.length > 0 ?  path.map((p, i) => (
          <div
            key={i}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dark text-white font-mono"
          >
            {p}
          </div>
        )) : "-"}
      </div>

      <p>
        Completed solutions:
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {pathsHistory.length > 0 ? pathsHistory.map((p, i) => (
          <div
            key={i}
            className="flex h-10 w-10 items-center justify-center rounded-lg glow-container"
          >
            {p.join("")}
          </div>
        )) : "-"}
      </div>

      <div className="flex gap-2 justify-center">
        <RedPillButton onClick={start} disabled={isRunning}>Run</RedPillButton>
        <BluePillButton onClick={reset} disabled={isRunning}>Reset</BluePillButton>
      </div>
    </div>
  );
}