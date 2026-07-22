export interface FocusGuardTarget {
    tagName?: string | null;
    isContentEditable?: boolean;
}

const IGNORED_TAG_NAMES = new Set(["input", "textarea", "select"]);

export const shouldIgnoreKeystroke = (target: FocusGuardTarget | null | undefined): boolean => {
    if (!target) {
        return false;
    }

    if (target.isContentEditable) {
        return true;
    }

    const tagName = target.tagName?.toLowerCase();

    return tagName !== undefined && tagName !== null && IGNORED_TAG_NAMES.has(tagName);
};
