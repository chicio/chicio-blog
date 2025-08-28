'use client';

import { useMemo } from "react";
import { shuffleArray } from "./shuffle-array";

export const useShuffleArray = <T>(array: T[] = [], numberOfItems: number): T[] =>
  useMemo(() => shuffleArray(array, numberOfItems), [array, numberOfItems]);
