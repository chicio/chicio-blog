export const KONAMI_SEQUENCE: readonly string[] = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export const appendKonamiKey = (buffer: readonly string[], key: string): string[] => {
    const next = [...buffer, key];

    if (next.length > KONAMI_SEQUENCE.length) {
        return next.slice(next.length - KONAMI_SEQUENCE.length);
    }

    return next;
};

export const matchesKonamiSequence = (buffer: readonly string[]): boolean =>
    buffer.length === KONAMI_SEQUENCE.length && buffer.every((key, index) => key === KONAMI_SEQUENCE[index]);
