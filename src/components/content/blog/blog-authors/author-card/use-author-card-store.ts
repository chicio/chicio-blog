"use client";

import { useCallback } from "react";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { EffectsStore } from "@/types/component-store";

interface AuthorCardEffects {
    onClickAuthor: () => void;
}

export const useAuthorCardStore = (): EffectsStore<AuthorCardEffects> => {
    const onClickAuthor = useCallback(() => {
        trackWith({
            category: tracking.category.blog_authors,
            label: tracking.label.body,
            action: tracking.action.open_blog_author,
        });
    }, []);

    return { effects: { onClickAuthor } };
};
