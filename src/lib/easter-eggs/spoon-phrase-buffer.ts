export const SPOON_PHRASE = "there is no spoon";

const MAX_BUFFER_LENGTH = 40;

const normalize = (value: string): string => value.toLowerCase().replace(/\s+/g, "");

const NORMALIZED_SPOON_PHRASE = normalize(SPOON_PHRASE);

export const appendToSpoonPhraseBuffer = (buffer: string, key: string): string => {
    const isPrintableCharacter = key.length === 1;

    if (!isPrintableCharacter) {
        return buffer;
    }

    const next = buffer + key;

    if (next.length > MAX_BUFFER_LENGTH) {
        return next.slice(next.length - MAX_BUFFER_LENGTH);
    }

    return next;
};

export const matchesSpoonPhrase = (buffer: string): boolean => normalize(buffer).endsWith(NORMALIZED_SPOON_PHRASE);
