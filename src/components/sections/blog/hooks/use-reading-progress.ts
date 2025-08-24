"use client";

import { useEffect, useState } from "react";

export function useReadingProgress(targetId: string) {
  const [readingProgress, setReadingProgress] = useState({
    percentage: 0,
    started: false,
    status: "uploading" as "uploading" | "complete",
  });

  useEffect(() => {
    function updateProgress() {
      const el = document.getElementById(targetId)!;
      const scrollTop = window.scrollY - el.offsetTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = window.innerHeight;
      const total = scrollHeight - clientHeight;
      const percentage = Math.max(
        0,
        Math.min(100, Math.round((scrollTop / total) * 100))
      );
      setReadingProgress({
        percentage,
        started: scrollTop > 0,
        status: percentage >= 100 ? "complete" : "uploading",
      });
    }
    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [targetId]);

  return readingProgress;
}
