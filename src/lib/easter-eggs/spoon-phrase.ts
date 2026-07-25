export const SPOON_PHRASE = "there is no spoon";

const normalize = (value: string): string => value.toLowerCase().replace(/\s+/g, "");

const NORMALIZED_SPOON_PHRASE = normalize(SPOON_PHRASE);

export const matchesSpoonPhrase = (buffer: string): boolean => normalize(buffer).endsWith(NORMALIZED_SPOON_PHRASE);
