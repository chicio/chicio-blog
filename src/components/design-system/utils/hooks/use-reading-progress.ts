'use client'

import { useEffect, useState } from 'react';

export function useReadingProgress(targetId?: string) {
  const [percent, setPercent] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    function updateProgress() {
      let scrollTop, scrollHeight, clientHeight;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          scrollTop = window.scrollY - el.offsetTop;
          scrollHeight = el.scrollHeight;
          clientHeight = window.innerHeight;
        } else {
          scrollTop = window.scrollY;
          scrollHeight = document.body.scrollHeight;
          clientHeight = window.innerHeight;
        }
      } else {
        scrollTop = window.scrollY;
        scrollHeight = document.body.scrollHeight;
        clientHeight = window.innerHeight;
      }
      const total = scrollHeight - clientHeight;
      const pct = Math.max(0, Math.min(100, Math.round((scrollTop / total) * 100)));
      setPercent(pct);
      setStarted(scrollTop > 0);
    }
    window.addEventListener('scroll', updateProgress);
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [targetId]);

  return { percent, started };
}
