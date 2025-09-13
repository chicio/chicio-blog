/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from "react";
import { shuffleArray } from "./shuffle-array";

export const useShuffleArray = <T>(array: T[] = [], numberOfItems: number): T[] => {
  const [shuffled, setShuffled] = useState<T[]>(array.slice(0, numberOfItems));

  useEffect(() => {
    setShuffled(shuffleArray(array, numberOfItems));
  }, []);

  return shuffled;
};
