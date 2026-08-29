export const HEADER_CLICKS_TO_TRIGGER = 4;

export const isHeaderClickSequenceComplete = (clickCount: number): boolean => clickCount >= HEADER_CLICKS_TO_TRIGGER;
