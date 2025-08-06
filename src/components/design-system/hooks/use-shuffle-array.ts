'use client';

import React, { useEffect } from "react";
import { shuffleArray } from "./shuffle-array";


export const useShuffleArray = <T>(array: T[] = [], numberOfItems: number): T[] => {
  const [shuffledArray, setShuffledArray] = React.useState<T[]>([]);

  useEffect(() => {
    setShuffledArray(shuffleArray(array, numberOfItems));
  }, [array, numberOfItems]);

  return shuffledArray;
};
