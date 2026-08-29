/**
 * The kung fu egg is armed on the games that taught you to fight, read straight from each game's
 * `genre` frontmatter rather than from a hardcoded list of titles, so it covers every fighting game
 * in the collection and any that get added later without another edit here.
 */
const FIGHTING_GENRE = "fighting";

export const isFightingGenre = (genre: string | undefined): boolean =>
    genre?.trim().toLowerCase() === FIGHTING_GENRE;

export const TAPS_TO_TRIGGER = 5;

export const TAP_RESET_WINDOW_MS = 1500;

export const isTapSequenceComplete = (tapCount: number): boolean => tapCount >= TAPS_TO_TRIGGER;
