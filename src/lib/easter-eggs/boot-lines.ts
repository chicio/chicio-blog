export const bootLinesFor = (slug: string): string[] => [
    `$ ./easter-egg --reveal ${slug}`,
    "> decrypting payload … ok",
    "> mounting /dev/matrix",
    "> playback ready",
];

interface TypewriterLine {
    text: string;
}

export const toTypewriterLines = (lines: string[]): TypewriterLine[] => lines.map(toTypewriterLine);

const toTypewriterLine = (text: string): TypewriterLine => ({ text });
