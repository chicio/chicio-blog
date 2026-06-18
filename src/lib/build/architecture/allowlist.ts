export type ViolationMode = "warn" | "error";

// Paths (relative to repo root, posix) NOT yet migrated.
// Sections are removed from here as their migration PR lands.
// When this array is empty, enforcement is global.
// Per-SECTION granularity from the start, so a single section (e.g. features/pwa)
// can be flipped to ERROR independently. List the real leaf sections, not broad prefixes.
export const ALLOWLIST: readonly string[] = [
    "src/components/design-system/atoms/",
    "src/components/design-system/molecules/",
    "src/components/design-system/organism/",
    "src/components/design-system/templates/",
    "src/components/design-system/utils/",
    "src/components/content/blog/",
    "src/components/content/chat/",
    "src/components/content/videogames/",
    "src/components/content/art/",
    "src/components/content/", // catch-all for the remaining smaller content pages
    "src/components/features/pwa/",
    "src/components/features/easter-eggs/",
    "src/components/features/matrix-rain-panel/",
];

export const isAllowlisted = (relPath: string): boolean =>
    ALLOWLIST.some((prefix) => relPath.startsWith(prefix));

// A violation inside an allowlisted path is a warning; elsewhere it fails the build.
export const modeFor = (relPath: string): ViolationMode =>
    isAllowlisted(relPath) ? "warn" : "error";
